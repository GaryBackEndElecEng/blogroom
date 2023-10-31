import { getServerSession } from "next-auth";
import { postType, userAccountType, userType } from "./Types";
import prisma from "@_prisma/client";
import authOptions from "./authOptions";
import { insertUrls, insertUrlPost, getS3ProfilePic } from "@lib/s3ApiComponents";
import { fileType } from "@lib/Types";

export async function getAccount(): Promise<userAccountType | undefined> {
    "use server"
    const session = await getServerSession(authOptions);
    if (session && session.user?.email) {
        const user = await prisma.user.findUnique({
            where: {
                email: session.user.email
            }
        });
        try {
            if (user) {
                const userBody: userAccountType = {
                    loaded: true,
                    data: {
                        id: user.id,
                        name: user.name as string,
                        email: user.email as string,
                        image: user.image as string,
                        imgKey: (user.imgKey) ? user.imgKey : undefined,
                        status: "authenticated"
                    }
                }
                return userBody
            }
        } catch (error) {
            throw new Error(" not registered")
        } finally {
            await prisma.$disconnect()
        }
    }
}

export async function getUser() {
    "use server";
    const session = await getServerSession(authOptions);
    if (session && session.user?.email) {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    email: session.user.email
                },
                include: {
                    files: true,
                    posts: true
                }
            });
            if (user) {
                let newUser = user as userType;
                if (newUser.files.length > 0) {
                    const updateUserFiles = newUser.files.map((file) => (insertUrls(file as fileType)));
                    if (newUser.posts.length > 0) {
                        const newPosts = newUser.posts.map(post => insertUrlPost(post as postType))
                        newUser = { ...newUser, posts: newPosts, files: updateUserFiles };
                        return newUser
                    }
                }
                return newUser
            }


        } catch (error) {
            throw new Error(" Did not get user")
        } finally {
            await prisma.$disconnect()
        }
    }
}