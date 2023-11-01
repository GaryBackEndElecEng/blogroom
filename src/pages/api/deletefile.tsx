import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from "@_prisma/client";
import type { userType, fileType, inputType } from "@lib/Types";
// import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import S3 from "aws-sdk/clients/s3";
import { insertUrls } from "@lib/s3ApiComponents";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export default async function handleFile(req: NextApiRequest, res: NextApiResponse) {
    // const session= await getServerSession(authOptions);
    const { fileID } = req.query;



    try {
        const file = await prisma.file.delete({
            where: {
                id: fileID as string,
            }
        });
        if (file) {
            res.status(200).json(file)
        } else {
            res.status(400).json({ message: `bad request` })
        }
        await prisma.$disconnect();
    } catch (error) {
        res.status(500).json({ message: "server issue at create/add file" })
    }


}



