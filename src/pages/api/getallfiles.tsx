import { NextApiRequest, NextApiResponse } from "next";
import type { mediaType, inputType, fileType } from "@/lib/Types";
import S3 from "aws-sdk/clients/s3";
import prisma from "@_prisma/client";


const s3 = new S3({
    apiVersion: "2006-03-01",
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_ACCESS_SECRET,
    region: process.env.AWS_BUCKET_REGION,
    signatureVersion: "v4"
})
// This returns all files from the DB and doesnot include inputTypes

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    try {
        const allFiles = await prisma.file.findMany();
        if (allFiles) {
            const files: fileType[] = allFiles as fileType[];
            const getFiles = retUrlInserts(files)

            res.status(200).json(getFiles)
        } else {
            res.status(404).json({ message: "no files found from getallfiles" })
        }
    } catch (error) {
        throw new Error("server error from api/getallFiles()")
    }
}
export function checkS3KeyEnd(s3Key: string | undefined) {
    if (!s3Key) return false
    const arrEnds = [".png", ".jpeg", ".web"];
    let check: boolean = arrEnds.filter(end => (s3Key.endsWith(end)))[0] ? true : false
    return check
}

export function retUrlInserts(files: fileType[]) {

    const getFiles = files.map(file => {
        if (!(file && file?.imageKey && file?.imageUrl)) return file
        let check: boolean = checkS3KeyEnd(file?.imageKey);
        if (!check) return file
        const s3Params = {
            Bucket: process.env.AWS_BUCKET_NAME as string,
            Key: file.imageKey,
        };
        const imageUrl = s3.getSignedUrl(
            "getObject", s3Params
        );
        file.imageUrl = imageUrl;

        return file
    });
    return getFiles
}
