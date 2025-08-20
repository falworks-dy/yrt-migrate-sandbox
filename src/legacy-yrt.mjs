import { writeFile } from "node:fs/promises";

/**
 * @typedef {[string] | [string, Partial<Record<string, Uint8Array>>]} DecodedLegacyYrt
 * msgpackでデコードした直後の旧形式YRT (v1.0.0-alpha.13) のデータ
 *
 * ※ yagisan-report-devtool リポジトリーの YrtFormat モジュールより
 *
 * - `[0]`: レイアウトXMLの文字列（`<LayoutXml>...</LayoutXml>`）
 * - `[1]`: アセットのマップオブジェクト（キー: 識別名、値: Uint8Array）
 */

/**
 * Encodes a Legacy YRT binary buffer.
 *
 * @param {DecodedLegacyYrt} legacyYrt
 * @returns {Uint8Array}
 */
export function encodeLegacyYrt(legacyYrt) {
    // @ts-ignore
    return encode(legacyYrt);
}

/**
 * Encodes and saves a Legacy YRT binary buffer to a file.
 *
 * @param {DecodedLegacyYrt} legacyYrt
 * @param {string} filePath
 */
export async function encodeAndSaveLegacyYrt(legacyYrt, filePath) {
    const binary = encodeLegacyYrt(legacyYrt);
    await writeFile(filePath, binary);
}
