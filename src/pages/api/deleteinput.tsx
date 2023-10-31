import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@_prisma/client";
import type { fileType, inputType } from "@lib/Types";
import S3 from "aws-sdk/clients/s3";


const s3 = new S3({
    apiVersion: "2006-03-01",
    accessKeyId: process.env.sdk_ACCESS_KEY,
    secretAccessKey: process.env.sdk_ACCESS_SECRET,
    region: process.env.BUCKET_REGION,
    signatureVersion: "v4"
})


export default async function handle(req: NextApiRequest, res: NextApiResponse) {

    const input: inputType = req.body as inputType;
    // console.log("input", input)
    if (input) {

        const inputDelete = await prisma.inputType.delete({
            where: {
                id: input.id
            }
        });
        try {
            if (inputDelete) {
                res.status(200).json(inputDelete)

            } else {
                res.status(404).json({ message: `no unit to delete-could not find ${input.id}` })
            }

        } catch (error) {

        } finally {
            await prisma.$disconnect();
        }



    } else {
        res.status(400).json({ message: `did not delete input component, did not recieve` })
    }
    await prisma.$disconnect();

}

function upsertImageUrl(input: inputType) {
    if (input.name === "image" && input.s3Key) {
        const s3Params = {
            Bucket: process.env.AWS_BUCKET_NAME as string,
            Key: input.s3Key,
        };

        input.url = s3.getSignedUrl(
            "getObject", s3Params
        );

        return input
    } else {
        return input
    }
}

function fileInsertImages(file: fileType) {
    let tempFile: fileType = file;
    if (tempFile.imageUrl) {
        const s3Params = {
            Bucket: process.env.AWS_BUCKET_NAME as string,
            Key: tempFile.imageKey,
        };
        tempFile.imageUrl = s3.getSignedUrl(
            "getObject", s3Params
        );
    }
    tempFile.inputTypes.forEach((input, index) => {
        const upsertImage = upsertImageUrl(input);
        return upsertImage
    });
    return tempFile
}