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
            const post = await prisma.post.findUnique({
                where: {
                    id: parseInt(postId as string)
                },
                include: {
                    rates: true,
                    likes: true
                }
            });
            if (post) {
                const insertPost = insertUrlPost(post as postType);
                res.status(200).json(insertPost)
                await prisma.$disconnect()
            }
        } else {
            res.status(404).json({ message: "did not get post@getpost" })
        }

    } catch (error) {
        console.error(new Error("Did not recieved query @ getpost"))
    } finally {
        await prisma.$disconnect()
    }
}