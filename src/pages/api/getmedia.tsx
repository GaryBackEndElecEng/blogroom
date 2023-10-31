import type { NextApiRequest, NextApiResponse } from "next";
import type { mediaType, inputType } from "@/lib/Types";
import S3 from "aws-sdk/clients/s3";
import { v4 as uuidv4 } from "uuid";
import prisma from "@_prisma/client";


const s3 = new S3({
    apiVersion: "2006-03-01",
    accessKeyId: process.env.sdk_ACCESS_KEY,
    secretAccessKey: process.env.sdk_ACCESS_SECRET,
    region: process.env.BUCKET_REGION,
    signatureVersion: "v4"
})
//------------THIS SEND AN S3 PRESIGNED URL TO THE USER FOR IMAGE UPLOADS  AND INSERTS THE PRESIGNED URL INTO THE IMAGEOBJ----//

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    //NEED THE FILE ID
    const fileID = (req.query.fileID as string)
    const ext = (req.query.fileType as string).split("/")[1]
    const Key: string = (req.query.Key as string)
    // console.log("Getting Key", Key, "Before uploaded")
    const s3Params = {
        Bucket: process.env.AWS_BUCKET_NAME as string,
        Key,
    };
    const imageUrl = s3.getSignedUrl(
        "getObject", s3Params
    )
    const imageObj = await insertURLToInput(fileID, imageUrl, Key);
    // console.log("getmedia-imageObj", imageObj)
    let handleMsg: mediaType = { loaded: true, message: "success" };
    res.status(200).json({
        imageUrl,
        key: Key,
        imageObj,
        msg: handleMsg

    });
}

export async function insertURLToInput(fileID: string, imageUrl: string, key: string) {
    try {
        const file = await prisma.file.findUnique({
            where: {
                id: fileID
            },
            include: {
                inputTypes: true
            }
        });
        if (file) {
            let imageInput: inputType = file.inputTypes
                .filter(input => (input.name === "image")).filter(input => input.s3Key === key)[0];
            imageInput.url = imageUrl
            return imageInput

        }
    } catch (error) {

    }
}