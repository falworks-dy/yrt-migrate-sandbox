import { migrateAllAndSaveXmls } from './src/index.mjs';

/**
 * 処理対象ファイルのフィルターです。
 *
 * @param {string} name ファイル名（拡張子なし）
 * @returns {boolean} true ならばファイルを処理対象とする
 */
const inputFilter = (name) => {
    // 必要に応じて変更してください。

    // if (name.startsWith("OK")) return false; // OK なやつを除外
    // if (/^\d/.test(name)) return false; // 数字で始まるやつ（バグ系）を除外
    // if (name.startsWith("FIXED")) return false; // 修正済みのやつを除外

    return true;
}

/**
 * `xml` ディレクトリ内のすべての XML ファイルをマイグレーションして
 * `xml-out` ディレクトリに結果を保存します。
 */
async function main() {
    return migrateAllAndSaveXmls(inputFilter).catch(e => {
        console.error(e);
        process.exit(1);
    });
}

void main();
