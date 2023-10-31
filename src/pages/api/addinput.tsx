import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from "@_prisma/client";
import type { userType, fileType, inputType } from "@lib/Types";
import { getServerSession } from "next-auth";
import authOptions from "@lib/authOptions";
import S3 from "aws-sdk/clients/s3";
import { insertUrls } from "@lib/s3ApiComponents";


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



    try {
        const addInput = await prisma.inputType.create({
            data: {
                name: input.name,
                content: input.content,
                type: input.type,
                s3Key: input.s3Key,
                url: input.url,
                fileId: input.fileId
            }
        });
        if (addInput) {
            const getFile = await prisma.file.findUnique({
                where: {
                    id: addInput.fileId
                },
                include: {
                    inputTypes: true
                }
            });
            if (getFile) {
                const modFile = insertUrls(getFile as fileType)
                res.status(200).json(modFile)
            }
        } else {
            res.status(400).json({ message: "did not save/update @ addinput" })
        }
    } catch (error) {
        // throw new Error(" did not add input @ addinput")
    } finally {
        await prisma.$disconnect()
    }

}

