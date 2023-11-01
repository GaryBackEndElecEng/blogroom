import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@_prisma/client";
import { insertUrls, retUrlInserts } from "@lib/s3ApiComponents";
import { fileType, userType, userTypeShort } from "@/lib/Types";
import S3 from "aws-sdk/clients/s3";

const s3 = new S3({
    apiVersion: "2006-03-01",
    accessKeyId: process.env.SDK_ACCESS_KEY,
    secretAccessKey: process.env.SDK_ACCESS_SECRET,
    region: process.env.BUCKET_REGION,
    signatureVersion: "v4"
})

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const username: string = req.query.username as string;
    const user_name = username.replace("-", " ")
    try {
        const user = await prisma.user.findMany({
            where: {
                name: user_name
            },

            skip: 0,
            take: 1,
            include: {
                files: true
            }
        });
        if (user[0]) {
            // console.log(user[0])//works
            const userWithImage = upsertImageUrl(user[0] as userType)
            res.status(200).json(userWithImage)
            await prisma.$disconnect()
        } else {
            res.status(404).json({ message: "could not find" })
        }

    } catch (error) {

    } finally {
        await prisma.$disconnect()
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
            Bucket: process.env.BUCKET_NAME as string,
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