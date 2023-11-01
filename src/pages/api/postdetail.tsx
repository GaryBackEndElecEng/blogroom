import prisma from "@_prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { insertUrlPost } from "@lib/s3ApiComponents"
import { postType } from "@/lib/Types";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {

    const getQuery = req.query;
    const { postId } = getQuery;
    // console.log(req.query, "HERE")
    if (postId) {
        try {

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
            } else {
                res.status(404).json({ message: "could not find item@postdetail" })
                await prisma.$disconnect()
            }


        } catch (error) {
            console.error(new Error("Did not recieved query @ getpost"))
        } finally {
            await prisma.$disconnect()
        }
    } else {
        res.status(404).json({ message: "no recieved query item from postdetail" })
    }
}