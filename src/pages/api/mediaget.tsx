import type { NextApiRequest, NextApiResponse } from "next";
import type { mediaType } from "@/lib/Types";
import S3 from "aws-sdk/clients/s3";
import { v4 as uuidv4 } from "uuid";

type dataType = {
    name: string
}
const s3 = new S3({
    apiVersion: "2006-03-01",
    accessKeyId: process.env.sdk_ACCESS_KEY,
    secretAccessKey: process.env.sdk_ACCESS_SECRET,
    region: process.env.BUCKET_REGION,
    signatureVersion: "v4"
})
//------------THIS SEND AN S3 PRESIGNED URL TO THE USER FOR IMAGE UPLOADS ----//

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const ext = (req.query.fileType as string).split("/")[1]
    const Key: string = (req.query.Key as string)
    // console.log("Key", Key)
    const s3Params = {
        Bucket: process.env.AWS_BUCKET_NAME as string,
        Key,
        Expires: 90,
        ContentType: `image/${ext}`,
    };
    const uploadUrl = await s3.getSignedUrl(
        "getObject", s3Params
    )
    let handleMsg: mediaType = { loaded: true, message: "success" };
    res.status(200).json({
        uploadUrl,
        key: Key,
        msg: handleMsg

    });
}