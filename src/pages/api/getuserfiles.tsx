import { NextApiRequest, NextApiResponse } from "next";
import type { mediaType, inputType, fileType, userType } from "@/lib/Types";
import prisma from "@_prisma/client";
import S3 from "aws-sdk/clients/s3";
import { insertUrls } from "@lib/s3ApiComponents";

const s3 = new S3({
    apiVersion: "2006-03-01",
    accessKeyId: process.env.sdk_ACCESS_KEY,
    secretAccessKey: process.env.sdk_ACCESS_SECRET,
    region: process.env.BUCKET_REGION,
    signatureVersion: "v4"
})

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const userID = req.query.userID as string
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userID
            }
        });
        if (user) {
            const files = await prisma.file.findMany({
                where: {
                    userId: user.id
                },
                include: {
                    inputTypes: true,
                    rates: true,
                    likes: true
                }
            });
            if (files && files.length > 0) {
                let arr: fileType[] = files as unknown[] as fileType[]
                let arr2 = arr as fileType[]
                const retFiles = arr2.map(file => insertUrls(file));
                if (!retFiles) {
                    res.status(200).json(arr);
                    return
                }
                res.status(200).json(retFiles);
                await prisma.$disconnect()


            } else {
                const file = await prisma.file.create({
                    data: {
                        name: "",
                        content: "",
                        title: "",
                        imageUrl: null,
                        imageKey: null,
                        published: false,
                        userId: user.id,
                        fileUrl: "none"

                    }
                });
                if (file) {
                    const url = genFileUrl(user as userType, file as fileType);
                    const updateFile = await prisma.file.update({
                        where: {
                            id: file.id
                        },
                        data: {
                            fileUrl: url
                        }
                    });
                    let arr: fileType[] = [updateFile as fileType]
                    res.status(200).json(arr)
                    await prisma.$disconnect()
                }
            }
        }

    } catch (error) {
        throw new Error("server error from api/getuserfiles()")
    } finally {
        await prisma.$disconnect()
    }
}

export function genFileUrl(user: userType, file: fileType) {
    if (user && user.name) {
        const username = encodeURIComponent(user.name);
        const url = `/blog/usershomelinks/${username}/${file.id}`
        return url

    }
}

// export function insertUrls(file: fileType) {

//     if (file) {
//         let tempFile: fileType = file;
//         if (tempFile.imageKey) {
//             const s3Params = {
//                 Bucket: process.env.AWS_BUCKET_NAME as string,
//                 Key: file.imageKey,
//             };
//             const imageUrl = s3.getSignedUrl(
//                 "getObject", s3Params
//             );
//             tempFile.imageUrl = imageUrl;
//         };
//         tempFile.inputTypes.map((inputType => {
//             if (inputType.s3Key && inputType.name === "image") {
//                 const s3Params = {
//                     Bucket: process.env.AWS_BUCKET_NAME as string,
//                     Key: inputType.s3Key,
//                 };
//                 const imageUrl = s3.getSignedUrl(
//                     "getObject", s3Params
//                 );
//                 inputType.url = imageUrl;
//             }
//             return inputType
//         }));
//         return tempFile;
//     };


// }
