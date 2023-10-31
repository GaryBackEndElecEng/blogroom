import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from "@_prisma/client";
import type { userType, fileType, inputType } from "@lib/Types";
import { getServerSession } from "next-auth";
import authOptions from "@lib/authOptions";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import S3 from "aws-sdk/clients/s3";
import { insertUrls } from "@lib/s3ApiComponents";

const s3 = new S3({
    apiVersion: "2006-03-01",
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_ACCESS_SECRET,
    region: process.env.AWS_BUCKET_REGION,
    signatureVersion: "v4"
})



export default async function handleFile(req: NextApiRequest, res: NextApiResponse<any>) {
    // const session= await getServerSession(authOptions);
    const file = req.body as fileType;

    // console.log(req.body, "INCOMMING", "FILE ID", file.id)

    if (req.method === "POST") {
        try {
            const isUser = await prisma.user.findUnique({
                where: {
                    id: file.userId
                }
            });

            if (isUser) {

                const addFile = await prisma.file.upsert({
                    where: {
                        id: file.id,
                    },
                    include: {
                        inputTypes: true,
                        likes: true,
                        rates: true
                    },
                    create: {
                        name: file.name,
                        title: file.title,
                        content: file.content,
                        date: file.date,
                        userId: isUser.id,
                        published: false,
                        fileUrl: file.fileUrl,
                        imageKey: file.imageKey,
                        imageUrl: file.imageUrl,

                    },
                    update: {
                        name: file.name,
                        title: file.title,
                        content: file.content,
                        date: file.date,
                        published: file.published,
                        imageKey: file.imageKey,
                        imageUrl: file.imageUrl,
                        fileUrl: file.fileUrl,
                    }

                });

                if (addFile && addFile.imageKey) {
                    let tempFile = insertUrls(addFile as fileType);
                    if (tempFile) {
                        res.status(200).json(tempFile)
                    } else {
                        res.status(400).json({ message: `did not create@savefile-insertUrl issues` });
                        await prisma.$disconnect();
                    }
                    // console.log("OUTGOING", addFile)
                } else {
                    res.status(200).json(addFile);
                }
                await prisma.$disconnect();
            } else {
                res.status(400).json({ message: `did not create,either missing info or no user associated` });
            }
            await prisma.$disconnect();
        } catch (error) {
            res.status(500).json({ message: "server issue at create/add file" });
        } finally {
            await prisma.$disconnect();
        }
    }

}



