import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from "@_prisma/client";
import type { userType, fileType, inputType } from "@lib/Types";
// import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import S3 from "aws-sdk/clients/s3";
import { insertUrls } from "@lib/s3ApiComponents";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const bucketName = "masterultils-postimages"
const region = process.env._AWS_BUCKET_REGION as string
const accessKeyId = process.env._AWS_ACCESS_KEY as string
const secretAccessKey = process.env._AWS_ACCESS_SECRET as string

const s3 = new S3({
    apiVersion: "2006-03-01",
    accessKeyId: process.env.sdk_ACCESS_KEY,
    secretAccessKey: process.env.sdk_ACCESS_SECRET,
    region: process.env.BUCKET_REGION,
    signatureVersion: "v4"
})


export default async function handleFile(req: NextApiRequest, res: NextApiResponse) {
    // const session= await getServerSession(authOptions);
    const { fileID } = req.query;


    console.log(fileID)
    try {
        const file = await prisma.file.findUnique({
            where: {
                id: fileID as string,
            },
            include: {
                inputTypes: true,
                likes: true,
                rates: true,
            }
        });
        if (file) {
            const retInsertFile = insertUrls(file as unknown as fileType);
            // console.log("getfile.tsx=> returned file", retInsertFile)
            res.status(200).json(retInsertFile)
        } else {
            res.status(400).json({ message: `bad request` })
        }
        await prisma.$disconnect();
    } catch (error) {
        res.status(500).json({ message: "server issue at create/add file" })
    }


}



