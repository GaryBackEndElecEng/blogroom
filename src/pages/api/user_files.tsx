import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@_prisma/client";
import { insertUrls, retUrlInserts } from "@lib/s3ApiComponents";
import { fileType, userType, userTypeShort } from "@/lib/Types";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const email: string = req.query.email as string;

    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email
            },
        });

        if (user) {
            const userFiles = await prisma.file.findMany({
                where: {
                    userId: user.id
                },
                include: {
                    inputTypes: true,
                    likes: true,
                    rates: true
                }
            });
            if (userFiles) {
                const insertFiles = retUrlInserts(userFiles as fileType[]);
                res.status(200).json(insertFiles)
                await prisma.$disconnect()
            } else {
                const newFile = await prisma.file.create({
                    data: {
                        name: "",
                        title: "",
                        published: false,
                        content: "",
                        userId: user.id,
                        fileUrl: "none",
                        imageKey: null,
                        imageUrl: null,
                    }
                });
                const url = genFileUrl(user as userType, newFile as fileType);
                const updateFile = await prisma.file.update({
                    where: {
                        id: newFile.id
                    },
                    data: {
                        fileUrl: url
                    },
                    include: {
                        inputTypes: true,
                        likes: true,
                        rates: true
                    }
                });
                res.status(200).json(updateFile)
                await prisma.$disconnect()
            }
        } else {
            res.status(400).json({ message: "no user's files" })
        }
    } catch (error) {

    } finally {
        await prisma.$disconnect()
    }
}

export function genFileUrl(user: userType, file: fileType) {
    if (user && user.name) {
        const username = user.name.replace(" ", "-");
        const url = `/blog/usershomelinks/${username}/${file.id}`
        return url

    }
}