const dotenv = require('dotenv');

const testEnv = dotenv.config({ path: ".env.test" })

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
}
