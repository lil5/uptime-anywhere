import fs, { promises as fsp } from "fs"

/**
 * Reads the last lines of a file.
 */
export async function readLastLinesWithFileHandle(
	f: fsp.FileHandle,
	fstats: fs.Stats,
	nlines: number = 1
): Promise<Buffer> {
	let ichars = 0
	let ilines = 0
	let lines = ""

	// Read characters backwards until it's enough
	while (ichars < fstats.size && ilines < nlines) {
		const pchar = await readPreviousChar(f, fstats, ichars)
		lines = pchar + lines
		if (pchar === "\n" && ichars > 0) ilines++
		ichars++
	}

	// Do not include the first newline character when there is one
	if (lines[0] === "\n") lines = lines.slice(1)

	return Buffer.from(lines, "binary")
}

async function readPreviousChar(
	f: fsp.FileHandle,
	stats: fs.Stats,
	/** current character count */
	ccc: number
): Promise<string> {
	const buffer = Buffer.alloc(1)
	await f.read(buffer, 0, 1, stats.size - 1 - ccc)
	return String.fromCharCode(buffer[0])
}
