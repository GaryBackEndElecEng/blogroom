import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from "@_prisma/client";
import type { fileType, inputType } from "@lib/Types";
import S3 from "aws-sdk/clients/s3";
import { insertUrls } from "@lib/s3ApiComponents"


const s3 = new S3({
    apiVersion: "2006-03-01",
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_ACCESS_SECRET,
    region: process.env.AWS_BUCKET_REGION,
    signatureVersion: "v4"
})


export default async function handleFile(req: NextApiRequest, res: NextApiResponse<any>) {
    const input = req.body as inputType;
    const name: string = input.name


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
            // console.log(addInput.id, "recieved", input.id)
            if (addInput) {
                const addUrl = upsertImageUrl(addInput)
                res.status(200).json(addUrl)
            } else {
                res.status(400).json({ message: "did not save/update @ addinput" })
            }
        } catch (error) {
            console.error(new Error("try did not pass @ inputUpdatenew"))
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
            Bucket: process.env.AWS_BUCKET_NAME as string,
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

