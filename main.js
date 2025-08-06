import { migrateAllAndSaveXmls } from './src/index.mjs';

/**
 * 処理対象ファイルのフィルターです。必要に応じて変更します。
 *
 * @param {string} path 
 * @returns {boolean}
 */
let fileFilter = (path) => true;

/**
 * `xml` ディレクトリ内のすべての XML ファイルをマイグレーションして
 * `xml-out` ディレクトリに結果を保存します。
 */
async function main() {
    return migrateAllAndSaveXmls(fileFilter).catch(e => {
        console.error(e);
        process.exit(1);
    });
}

void main();
