import { NextApiRequest, NextApiResponse } from "next";
import type { mediaType, inputType, fileType, postType } from "@/lib/Types";
import prisma from "@_prisma/client";
import S3 from "aws-sdk/clients/s3";
import { insertUrlPost } from "@/lib/s3ApiComponents";

const s3 = new S3({
    apiVersion: "2006-03-01",
    accessKeyId: process.env.sdk_ACCESS_KEY,
    secretAccessKey: process.env.sdk_ACCESS_SECRET,
    region: process.env.BUCKET_REGION,
    signatureVersion: "v4"
})

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const userID = req.query.userID as string
    // console.log(userID)
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userID
            }
        });
        if (user) {
            const posts = await prisma.post.findMany({
                where: {
                    userId: user.id
                },
                include: {
                    likes: true,
                    rates: true
                }
            });
            if (posts && posts.length > 0) {
                let arr: postType[] = posts as postType[]
                const retFiles = arr.map(post => insertUrlPost(post));
                res.status(200).json(retFiles);
            } else {
                res.status(404).json({ message: "no posts" });
                await prisma.$disconnect()
            }
        }

    } catch (error) {
        throw new Error("server error from api/getuserfiles()")
    } finally {
        await prisma.$disconnect()
    }
}
export function insertUrls(file: fileType) {

    if (file) {
        let tempFile: fileType = file;
        if (tempFile.imageKey) {
            const s3Params = {
                Bucket: process.env.AWS_BUCKET_NAME as string,
                Key: file.imageKey,
            };
            const imageUrl = s3.getSignedUrl(
                "getObject", s3Params
            );
            tempFile.imageUrl = imageUrl;
        };
        tempFile.inputTypes.map((inputType => {
            if (inputType.s3Key && inputType.name === "image") {
                const s3Params = {
                    Bucket: process.env.AWS_BUCKET_NAME as string,
                    Key: inputType.s3Key,
                };
                const imageUrl = s3.getSignedUrl(
                    "getObject", s3Params
                );
                inputType.url = imageUrl;
            }
            return inputType
        }));
        return tempFile;
    };


}
