import { NextApiRequest, NextApiResponse } from "next";
import S3 from "aws-sdk/clients/s3";
import { gets3ProfilePicType } from '@lib/Types';
const s3 = new S3({
    apiVersion: "2006-03-01",
    accessKeyId: process.env.SDK_ACCESS_KEY,
    secretAccessKey: process.env.SDK_ACCESS_SECRET,
    region: process.env.BUCKET_REGION,
    signatureVersion: "v4"
});

export default function handle(req: NextApiRequest, res: NextApiResponse) {
    const Key = req.query.Key as string;
    if (!(Key)) res.status(400).json({ message: "missing parameters" })
    try {

        const s3Params = {
            Bucket: process.env.BUCKET_NAME as string,
            Key,
        };
        const imageUrl = s3.getSignedUrl(
            "getObject", s3Params
        )
        const retObj: gets3ProfilePicType = {
            imageUrl,
            Key
        }
        res.status(200).json(retObj)
    } catch (error) {
        res.status(500).json({ message: "did not return user's url Pic" })
        console.error(new Error("Did not get imageUrl"))
    }

}