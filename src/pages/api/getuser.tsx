import { NextApiRequest, NextApiResponse } from "next";
import type { mediaType, inputType, fileType } from "@/lib/Types";
import S3 from "aws-sdk/clients/s3";
import prisma from "@_prisma/client";
import { getProfilePic } from "@lib/s3ApiComponents";


const s3 = new S3({
    apiVersion: "2006-03-01",
    accessKeyId: process.env.sdk_ACCESS_KEY,
    secretAccessKey: process.env.sdk_ACCESS_SECRET,
    region: process.env.BUCKET_REGION,
    signatureVersion: "v4"
})
// This returns all files from the DB and doesnot include inputTypes

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const userId = req.query.userId
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId as string
            },
            include: {
                files: true,
                posts: true
            }
        });
        if (user) {
            if (user.imgKey) {
                let tempUrl = getProfilePic(user.imgKey);
                const userInsertImg = { ...user, image: tempUrl }
                res.status(200).json(userInsertImg)
            } else {
                res.status(200).json(user)
            }
            await prisma.$disconnect();
        } else {
            res.status(404).json({ message: "no user found" })
        }
    } catch (error) {
        throw new Error("server error from api/getallFiles()")
    } finally {
        await prisma.$disconnect();
    }
}