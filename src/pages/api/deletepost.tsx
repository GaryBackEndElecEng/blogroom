import prisma from "@_prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { insertUrlPost } from "@lib/s3ApiComponents"
import { postType } from "@/lib/Types";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {

    const getQuery = req.query;
    const { userId, postId } = getQuery;
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId as string
            }
        });
        if (user) {
            const post = await prisma.post.delete({
                where: {
                    id: parseInt(postId as string)
                }
            });
            if (post) {
                res.status(200).json(post)
                await prisma.$disconnect()
            }
        }

    } catch (error) {
        console.error(new Error("Did not recieved query @ deletepost"))
    } finally {
        await prisma.$disconnect()
    }
}