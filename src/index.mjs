import fs from 'node:fs/promises';
import { join } from 'node:path';
import { unpackYrt, extractXmlsFromYrt } from './yrt.mjs';
import { exists, findFiles, getFilenameWithoutExt } from './fs-utils.mjs';
import { runNpx } from './process-utils.mjs';

/**
 * Directory containing the input XML files.
 */
const XML_DIR = 'xml';

/**
 * Directory where the unpacked XMLs will be saved.
 */
const XML_OUT_DIR = 'xml-out';

/**
 * Migrates a YRT XML file using the `yrt-migrate` command
 * and saves the unpacked XMLs.
 *
 * @param {string} xmlFilepath 
 */
export async function migrateAndSaveXmls(xmlFilepath) {
    console.log(`- input : ${xmlFilepath}`);
    await runNpx('yrt-migrate', xmlFilepath);

    const name = getFilenameWithoutExt(xmlFilepath);
    const yrtFilepath = join(XML_DIR, `${name}.yrt`); // same dir as input
    const yrtBuffer = await fs.readFile(yrtFilepath);
    await fs.unlink(yrtFilepath); // clean up
    const outDir = join(XML_OUT_DIR, name);
    await extractXmlsFromYrt(unpackYrt(yrtBuffer), outDir);
    console.log(`  output: ${outDir}`);
}

/**
 * Cleans up the output directory.
 */
export async function cleanUp() {
    if (!await exists(XML_OUT_DIR)) return;

    const children = await fs.readdir(XML_OUT_DIR);
    await Promise.all(children.map(child => {
        const childPath = join(XML_OUT_DIR, child);
        fs.rm(childPath, { recursive: true, force: true });
    }));
}

/**
 * Migrates all XML files in the input directory
 * and saves the unpacked XMLs.
 *
 * @param {(path: string) => boolean} [inputNameFilter] 
 */
export async function migrateAllAndSaveXmls(inputNameFilter) {
    let xmlFiles = await findFiles(XML_DIR, ".xml");
    if (inputNameFilter) {
        xmlFiles = xmlFiles.filter(filepath => inputNameFilter(getFilenameWithoutExt(filepath)));
    }
    if (xmlFiles.length === 0) {
        console.log("No XML files found to migrate.");
        return;
    }

    await cleanUp();
    for (const file of xmlFiles) {
        await migrateAndSaveXmls(file);
    }
}
