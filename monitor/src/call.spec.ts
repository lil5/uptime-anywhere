import { call } from "./call"
import { ConfigSite } from "./types"
import * as https from "https"
import * as http from "http"
import * as pem from "pem"

test("if duration calculation works correctly", () => {
	const currentTime = new Date()
	const startTime = new Date(currentTime.setMilliseconds(0))
	const endTime = new Date(currentTime.setMilliseconds(120))

	expect(startTime.valueOf() - endTime.valueOf() === 120)
})

describe("calling one config site", () => {
	let serverHttp: http.Server
	let serverHttpsSelfSigned: https.Server
	beforeAll(async () => {
		// setup test servers
		const app: http.RequestListener = (req, res) => {
			res.writeHead(200, { "Content-Type": "text/plain" })
			res.end("okay")
		}
		// http server
		serverHttp = http.createServer(app).listen(12340)
		// https self signed server
		const keys = await new Promise<pem.CertificateCreationResult>(
			(resolve, reject) => {
				pem.createCertificate({ days: 1, selfSigned: true }, (err, cert) => {
					if (err) {
						reject(err)
					}

					resolve(cert)
				})
			}
		)
		serverHttpsSelfSigned = https
			.createServer(
				{
					key: keys.serviceKey,
					cert: keys.certificate,
				},
				app
			)
			.listen(12341)
	})

	afterAll(() => {
		serverHttp.close()
		serverHttpsSelfSigned.close()
	})
	const sutSites: ConfigSite[] = [
		{
			name: "Google",
			url: "https://www.google.com/",
		},
	]

	it("call test http server", async () => {
		const response = await call({
			name: "Test http",
			url: "http://localhost:12340",
		})

		expect(response.status).toBe("up")
		expect(response.responseTime).toBeGreaterThan(0)
	})
	it("call test https self-signed server with insecure true and expect status 'up'", async () => {
		const response = await call({
			name: "Test https self-signed",
			url: "https://localhost:12341",
			insecure: true,
		})

		expect(response.status).toBe("up")
	})
	it("call test https self-signed server without insecure true and expect status 'down'", async () => {
		const response = await call({
			name: "Test https self-signed",
			url: "https://localhost:12341",
		})

		expect(response.status).toBe("down")
	})
	it("call google using https", async () => {
		const response = await call({
			name: "Google",
			url: "https://www.google.com",
		})

		expect(response.status).toBe("up")
	})
})
