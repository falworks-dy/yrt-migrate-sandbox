import fs from 'fs/promises';
import path from 'path';

/**
 * @param {string} src 
 * @param {string} dest 
 */
export async function copyDir(src, dest) {
    await fs.rm(dest, { recursive: true, force: true });
    await fs.mkdir(dest, { recursive: true });
    for (const entry of await fs.readdir(src, { withFileTypes: true })) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
            await copyDir(srcPath, destPath);
        } else {
            await fs.copyFile(srcPath, destPath);
        }
    }
}

/**
 * @param {string} dir Directory path to search in.
 * @param {string} ext File extension to search for, e.g., ".xml".
 * @returns {Promise<string[]>} Files with the specified extension in the directory and subdirectories.
 */
export async function findFiles(dir, ext) {
    /**
     * @type {string[]}
     */
    const results = [];

    /**
     * @param {string} current
     * @returns {Promise<void>}
     */
    async function walk(current) {
        return fs.readdir(current, { withFileTypes: true }).then(entries => {
            return Promise.all(entries.map(entry => {
                const fullPath = path.join(current, entry.name);
                if (entry.isDirectory()) {
                    return walk(fullPath);
                } else if (entry.isFile()) {
                    if (entry.name.endsWith(ext)) {
                        results.push(fullPath);
                    }
                }
            }));
        }).then(_ => { });
    }
    return walk(dir).then(() => results);
}

/**
 * Returns files with the specified extension in the given directory (non-recursive).
 * @param {string} dir Directory path to search in.
 * @param {string} ext File extension to search for, e.g., ".xml".
 * @returns {Promise<string[]>} Files with the specified extension in the directory.
 */
export async function findFilesShallow(dir, ext) {
    const results = [];
    for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
        if (entry.isFile()) {
            if (entry.name.endsWith(ext)) {
                results.push(path.join(dir, entry.name));
            }
        }
    }
    return results;
}

/**
 * Returns the filename without extension from a given filepath.
 * @param {string} filepath
 * @returns {string}
 */
export function getFilenameWithoutExt(filepath) {
    return path.parse(filepath).name;
}
