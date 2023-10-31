import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from "@_prisma/client";
import type { userType, fileType, inputType } from "@lib/Types";
import { getServerSession } from "next-auth";
import authOptions from "@lib/authOptions";
import S3 from "aws-sdk/clients/s3";
import { insertUrls } from "@lib/s3ApiComponents"


const s3 = new S3({
    apiVersion: "2006-03-01",
    accessKeyId: process.env.SDK_ACCESS_KEY,
    secretAccessKey: process.env.SDK_ACCESS_SECRET,
    region: process.env.BUCKET_REGION,
    signatureVersion: "v4"
})


export default async function handleFile(req: NextApiRequest, res: NextApiResponse<any>) {
    // const session= await getServerSession(authOptions);
    const input = req.body as inputType;
    const name: string = input.name
    // console.log(req.body, "INCOMMING", "FILE ID", input)


    if (input) {

        try {
            const addInput = await prisma.inputType.update({
                where: {
                    id: input.id
                },
                data: {
                    id: input.id,
                    name: input.name,
                    content: input.content,
                    s3Key: input.s3Key,
                    url: input.url,
                    fileId: input.fileId,
                    date: input.date
                },

            });
            console.log(addInput.id, "recieved", input.id)
            if (addInput) {
                const retFile = await prisma.file.findUnique({
                    where: {
                        id: input.fileId
                    },
                    include: {
                        inputTypes: true
                    }
                });
                if (retFile) {
                    const inputFile = insertUrls(retFile as fileType)
                    if (!inputFile) return res.status(400).json({ message: "issues inserting imgs and missing file" })
                    res.status(200).json(inputFile)

                } else {
                    res.status(400).json({ message: `could noy find file: ${input.fileId}` })
                }
            } else {
                res.status(400).json({ message: "did not save/update @ addinput" })
            }
        } catch (error) {
            // throw new Error(" did not add input @ addinput")
        } finally {
            await prisma.$disconnect()
        }
    } else {
        res.status(404).json({ message: "did not recieve input ID for file return" });
    }
    await prisma.$disconnect()

}
const matchEnd = (input: inputType) => {
    let arr: string[] = [".png", ".jpeg", ".Web", "PNG", "JPEG"]
    let check: boolean = false;
    arr.forEach((end, index) => {
        if (input.s3Key?.endsWith(end)) {
            return check = true
        }
    });
    return check
}

function upsertImageUrl(input: inputType) {
    if (input.name === "image" && input.s3Key && matchEnd(input)) {
        const s3Params = {
            Bucket: process.env.BUCKET_NAME as string,
            Key: input.s3Key,
        };

        input.url = s3.getSignedUrl(
            "getObject", s3Params
        );

        return input
    } else {
        return input
    }
}

function fileInsertImages(file: fileType) {
    let tempFile: fileType = file;
    if (tempFile.imageUrl) {
        const s3Params = {
            Bucket: process.env.BUCKET_NAME as string,
            Key: tempFile.imageKey,
        };
        tempFile.imageUrl = s3.getSignedUrl(
            "getObject", s3Params
        );
    }
    tempFile.inputTypes.forEach((input, index) => {
        const upsertImage = upsertImageUrl(input);
        return upsertImage
    });
    return tempFile
}