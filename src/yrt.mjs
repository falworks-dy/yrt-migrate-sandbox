import { decode } from "@msgpack/msgpack";
import { promises as fs } from "fs";
import { join } from "path";

/**
 * @typedef {Object} DecodedYrtBody
 * msgpackでデコードした直後の YRT v1.0 データのbody部分
 *
 * ※ yagisan-report-devtool リポジトリーの YrtFormat モジュールより
 *
 * @property {Array<[string|null, string]>} l レイアウト配列: [name, xml][]
 * @property {string|null} s スタイルXML（nullable）
 * @property {Object<string, Uint8Array>|null} a アセット（nullable, key: string, value: Uint8Array）
 */

/**
 * @typedef {["YRT", 1, DecodedYrtBody]} DecodedYrt
 * msgpackでデコードした直後の YRT v1.0 データ
 *
 * ※ yagisan-report-devtool リポジトリーの YrtFormat モジュールより
 */

/**
 * @typedef {Object} UnpackedYrtXmls YRT v1.0 から抽出したXML（本リポジトリー専用）
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
 * @returns {UnpackedYrtXmls}
 */
export function unpackYrtXmls(binary) {
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
 * @param {UnpackedYrtXmls} yrt 
 * @param {string} outDir 
 */
export async function saveYrtXmls(yrt, outDir) {
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