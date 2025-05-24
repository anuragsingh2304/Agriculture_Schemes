import fs from 'fs/promises';
import path from 'path';

/**
 * Saves uploaded files to a specified directory and returns their details.
 *
 * @param {Array<Object>} files - An array of file objects. Each object is expected
 *                                to have `originalname` (string) and `buffer` (Buffer).
 *                                This format is typical for files processed by multer's
 *                                `memoryStorage`.
 * @param {string} [relativeTargetDir='public/image'] - The directory where files will be saved,
 *                                                      relative to the project root.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of objects,
 *                                   where each object contains details of a saved file:
 *                                   `originalName`, `filename` (the new unique name),
 *                                   `path` (full absolute server path), `publicPath`
 *                                   (URL-friendly path for web access, assuming 'public'
 *                                   is the static root), `size`, and `mimetype`.
 * @throws {Error} If an issue occurs during directory creation or file writing,
 *                 or if the `files` argument is not a valid array.
 */
async function saveUploadedFiles(files, relativeTargetDir = 'public/image') {
    if (!Array.isArray(files)) {
        throw new Error('Invalid input: files parameter must be an array.');
    }

    if (files.length === 0) {
        return []; // No files to save
    }

    // Assuming this utility is run from the project's root or a context where process.cwd() is the project root.
    const projectRoot = process.cwd();
    const absoluteTargetDir = path.join(projectRoot, relativeTargetDir);

    try {
        // Ensure the target directory exists, creating it if necessary.
        await fs.mkdir(absoluteTargetDir, { recursive: true });
    } catch (error) {
        console.error(`Error creating directory ${absoluteTargetDir}:`, error);
        throw new Error(`Failed to create target directory: ${error.message}`);
    }

    const savedFileInfos = [];

    for (const file of files) {
        if (!file || typeof file.originalname !== 'string' || !Buffer.isBuffer(file.buffer)) {
            console.warn('Skipping invalid file object:', file);
            // Optionally, you could throw an error here if strict validation is needed.
            continue;
        }

        // Sanitize originalname to remove potentially harmful characters and create a URL-friendly name.
        // path.basename ensures we only use the filename part, preventing path traversal.
        const sanitizedOriginalName = path.basename(file.originalname).replace(/[^a-zA-Z0-9._-]/g, '_');
        const uniqueFilename = `${Date.now()}-${sanitizedOriginalName}`;
        const absoluteFilePath = path.join(absoluteTargetDir, uniqueFilename);

        try {
            await fs.writeFile(absoluteFilePath, file.buffer);

            // Construct the public path (e.g., /image/yourfile.jpg)
            // This assumes that the 'public' directory (or the first segment of relativeTargetDir if it starts with 'public')
            // is served as the root for static assets.
            const publicPath = path.join('/', relativeTargetDir.replace(/^public[\\/]?/, ''), uniqueFilename).replace(/\\/g, '/');

            savedFileInfos.push({
                originalName: file.originalname,
                filename: uniqueFilename,
                path: absoluteFilePath, // Full path on the server
                publicPath: publicPath,   // Path for web access
                size: file.buffer.length, // Get size from buffer
                mimetype: file.mimetype || 'application/octet-stream', // Provide a default mimetype
            });
        } catch (error) {
            console.error(`Error saving file ${file.originalname} to ${absoluteFilePath}:`, error);
            // If one file fails, this will stop the process and throw.
            // You might want to collect errors and continue, depending on requirements.
            throw new Error(`Failed to save file ${file.originalname}: ${error.message}`);
        }
    }

    return savedFileInfos;
}

export default saveUploadedFiles;