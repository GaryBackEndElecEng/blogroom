import React from 'react';
import prisma from "@_prisma/client";
import { NextApiRequest, NextApiResponse } from 'next';
import { userType } from '@/lib/Types';
import S3 from "aws-sdk/clients/s3";

const s3 = new S3({
    apiVersion: "2006-03-01",
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_ACCESS_SECRET,
    region: process.env.AWS_BUCKET_REGION,
    signatureVersion: "v4"
})

export default async function handle(req: NextApiRequest, res: NextApiResponse) {

    const body = req.query;
    const { fileID } = body;

    if (fileID as string) {
        try {
            const file = await prisma.file.findUnique({
                where: {
                    id: fileID as string
                },
            });
            if (file) {
                const user = await prisma.user.findUnique({
                    where: {
                        id: file.userId
                    }
                });
                if (user) {
                    const addUserProfile = upsertImageUrl(user as userType)
                    res.status(200).json(addUserProfile);
                } else {
                    res.status(400).json({ message: " user not found" })
                }
            }
        } catch (error) {
            console.error(new Error("no fileID-bad request"));
        } finally {
            await prisma.$disconnect();
        }
    }
}
const matchEnd = (s3Key: string) => {
    let arr: string[] = [".png", ".jpeg", ".Web", "PNG", "JPEG"]
    let check: boolean = false;
    arr.forEach((end, index) => {
        if (s3Key?.endsWith(end)) {
            return check = true
        }
    });
    return check
}

function upsertImageUrl(user: userType) {
    if (user.imgKey && matchEnd(user.imgKey)) {
        const s3Params = {
            Bucket: process.env.AWS_BUCKET_NAME as string,
            Key: user.imgKey,
        };

        user.image = s3.getSignedUrl(
            "getObject", s3Params
        );

        return user
    } else {
        return user
    }
}
