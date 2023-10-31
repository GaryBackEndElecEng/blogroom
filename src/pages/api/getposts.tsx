import prisma from "@_prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { insertUrlPost } from "@lib/s3ApiComponents"
import { postType } from "@/lib/Types";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {


    try {

        const posts = await prisma.post.findMany({
            include: {
                likes: true,
                rates: true
            }
        });
        if (posts) {
            const insertPosts: postType[] = posts.map((post) => insertUrlPost(post as postType));
            res.status(200).json(insertPosts)
            await prisma.$disconnect()
        }

    } catch (error) {
        console.error(new Error("Did not recieved query @ getpost"))
    } finally {
        await prisma.$disconnect()
    }
}