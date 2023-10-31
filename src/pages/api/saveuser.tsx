import { NextApiRequest, NextApiResponse } from "next";
import type { userType } from "@/lib/Types";
import prisma from "@_prisma/client";

// import S3 from "aws-sdk/clients/s3";
import { getProfilePic } from "@lib/s3ApiComponents";


// const s3 = new S3({
//     apiVersion: "2006-03-01",
//     accessKeyId: process.env.AWS_ACCESS_KEY,
//     secretAccessKey: process.env.AWS_ACCESS_SECRET,
//     region: process.env.AWS_BUCKET_REGION,
//     signatureVersion: "v4"
// })
// This returns all files from the DB and doesnot include inputTypes

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const body = req.body as userType
    if (!body) return res.status(400).json({ message: "bad request: missing paramters" });
    const { id, name, email, imgKey, bio, image } = body;
    // console.log(name, id, imgKey, bio)
    try {
        const user = await prisma.user.update({
            where: {
                id: id
            },
            data: {
                name,
                imgKey,
                bio,
                image
            }
        });
        if (user) {
            const tempImgKey = user.imgKey
            if (!tempImgKey) res.status(200).json(user)
            const getuser = { ...user, image: getProfilePic(tempImgKey as string) }
            res.status(200).json(getuser)
        } else {
            res.status(404).json({ message: "no users found" })
        }
    } catch (error) {
        throw new Error("server error from api/getallFiles()")
    } finally {
        await prisma.$disconnect()
    }
}