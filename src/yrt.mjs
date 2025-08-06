import { decode } from "@msgpack/msgpack";
import { promises as fs } from "fs";
import { join } from "path";

/**
 * @typedef {["YRT", 1, { l: [string, string][], s?: string }]} DecodedYrt
 */

/**
 * @typedef {Object} UnpackedYrt
 * @property {string[]} layouts - Array of layout XML strings.
 * @property {string | null} style - Style XML string or null if not present.
 */

/**
 * Decodes a YRT binary buffer.
 * No validation is performed.
 *
 * @param {Uint8Array} binary 
 * @returns {DecodedYrt}
 */
export function decodeYrt(binary) {
    // @ts-ignore
    return decode(binary);
}

/**
 * Unpacks a YRT binary buffer and extracts layouts and style.
 *
 * @param {Uint8Array} binary - The packed binary buffer.
 * @returns {UnpackedYrt}
 */
export function unpackYrt(binary) {
    const raw = decodeYrt(binary);
    // raw: [doctype, version, body]
    const body = raw[2];
    // layouts: array of [name, xml] -> ignore name
    const layouts = (body.l || []).map(entry => entry[1]);
    // style: string or undefined
    const style = body.s || null;

    return { layouts, style };
}

/**
 * Extracts XML files from a YRT object and saves them
 * to the specified directory.
 * 
 * The files are named as `layout-<index>.xml` for layouts
 * and `style.xml` for style.
 * 
 * @param {UnpackedYrt} yrt 
 * @param {string} outDir 
 */
export async function extractXmlsFromYrt(yrt, outDir) {
    let { layouts, style } = yrt;

    // Ensure output directory exists
    await fs.mkdir(outDir, { recursive: true });

    // Write layouts
    for (let i = 0; i < layouts.length; i++) {
        let layoutXml = layouts[i];
        const layoutPath = join(outDir, `layout-${i}.xml`);
        await fs.writeFile(layoutPath, layoutXml, "utf8");
    }

    // Write style if present
    if (style) {
        const stylePath = join(outDir, "style.xml");
        await fs.writeFile(stylePath, style, "utf8");
    }
}