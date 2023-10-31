import { NextApiRequest, NextApiResponse } from "next";
import type { mediaType, inputType, fileType, userType, postType } from "@/lib/Types";
import S3 from "aws-sdk/clients/s3";
import prisma from "@_prisma/client";
import { getProfilePic, insertUrlPosts, retUrlInserts } from "@lib/s3ApiComponents";


const s3 = new S3({
    apiVersion: "2006-03-01",
    accessKeyId: process.env.sdk_ACCESS_KEY,
    secretAccessKey: process.env.sdk_ACCESS_SECRET,
    region: process.env.BUCKET_REGION,
    signatureVersion: "v4"
})
// This returns all files from the DB and doesnot include inputTypes

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    try {
        const users = await prisma.user.findMany({

        });

        if (users) {
            const body: userType[] | [] = users as userType[]
            const insertS3Img: userType[] = body.map((user, index) => {
                if (user.imgKey) {
                    let imageURL = getProfilePic(user.imgKey);
                    const tempUser = { ...user, image: imageURL as string };
                    return tempUser
                } else {
                    return user
                }

            });
            res.status(200).json(insertS3Img)

        } else {
            res.status(404).json({ message: "no users found" })
        }
    } catch (error) {
        throw new Error("server error from api/getallFiles()")
    }
}