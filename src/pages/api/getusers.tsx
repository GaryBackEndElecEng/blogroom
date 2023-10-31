import { NextApiRequest, NextApiResponse } from "next";
import type { mediaType, inputType, fileType } from "@/lib/Types";
import S3 from "aws-sdk/clients/s3";
import prisma from "@_prisma/client";
import { getProfilePic } from "@lib/s3ApiComponents";


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
        const allUsers = await prisma.user.findMany({
            include: {
                files: true,
            }
        });
        if (allUsers) {
            const users = allUsers.map((user, index) => {
                if (!user.imgKey) return user;
                let tempUrl = getProfilePic(user.imgKey);
                return { ...user, image: tempUrl }
            });
            res.status(200).json(users)
        } else {
            res.status(404).json({ message: "no users found" })
        }
    } catch (error) {
        throw new Error("server error from api/getallFiles()")
    }
}