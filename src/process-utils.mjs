import { spawn } from 'node:child_process';

/**
 * Runs an npx command in a child process and returns a Promise that resolves when the process exits.
 * @param {string} command - The command to run with npx (e.g., 'yrt-migrate').
 * @param {string[]} args - Arguments for the command.
 * @returns {Promise<void>} Resolves if exit code is 0, rejects otherwise.
 */
export async function runNpx(command, ...args) {
    return new Promise((resolve, reject) => {
        const child = spawn('npx', [command, ...args], { stdio: 'inherit' });
        child.on('error', (error) => {
            console.error(`Error processing npx ${command} ${args.join(' ')}`);
            reject(error);
        });
        child.on('exit', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`Process exited with code ${code}`));
            }
        });
    });
}
