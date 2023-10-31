import fs from "fs";
import path from "path";
import { fileType } from "@lib/Types";


const root = process.cwd();
const jsonDir = path.join(root, "/blogs/ID");

export function storeFileJSON(json: fileType, filename: string) {
    //fs.writeFileSync('../data/phraseFreqs.json', JSON.stringify(output));
    const fullPath = path.join(jsonDir, `${filename}`);
    fs.writeFileSync(fullPath, JSON.stringify(json));
}

export function allFilesJSON() {
    const files: string[] | null = fs.readdirSync(jsonDir);
    if (files) {
        const allFiles = files.map((filename, index) => {
            const fullPath = path.join(jsonDir, filename);
            const contentBuff = fs.readFileSync(fullPath).toString();
            return {
                id: filename.split("-")[0],
                filename: filename.split("-")[1],
                content: contentBuff
            }
        });
        return allFiles
    }
}
export function getFileJSON(id: string | null, filename: string | null) {

    if (id && filename) {
        const fileName = `${id}-${filename}`;
        const fullPath = path.join(jsonDir, fileName);
        const contentBuffer = fs.readFileSync(fullPath).toString();

        return {
            id,
            filename,
            content: contentBuffer,
            status: 200
        }
    } else {
        return
    }
}
