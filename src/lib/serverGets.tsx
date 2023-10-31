import prisma from "@_prisma/client";
import { fileType, postType, userAccountType, userType } from "@lib/Types";
import S3 from "aws-sdk/clients/s3";
import { insertUrls, retUrlInserts, getProfilePic } from "@lib/s3ApiComponents";
import { getServerSession } from "next-auth";
import authOptions from "./authOptions";

const s3 = new S3({
    apiVersion: "2006-03-01",
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_ACCESS_SECRET,
    region: process.env.AWS_BUCKET_REGION,
    signatureVersion: "v4"
});


export async function getUsers() {
    try {
        const users = await prisma.user.findMany({
            include: { files: true }
        });
        const body: userType[] | [] = users as userType[]
        const insertS3Img: userType[] = body.map((user, index) => {
            if (!user.imgKey) return user;
            let imageURL = getProfilePic(user.imgKey);
            if (!imageURL) return user
            return { ...user, image: imageURL }
        })
        return insertS3Img
    } catch (error) {
        throw new Error("issues getting users")
    } finally {
        await prisma.$disconnect()
    }
}

export async function getUser() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return
    if (session.user && session.user.email) {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    email: session.user.email
                }
            });
            const valUser: userType = user as userType
            let url: string | null = getProfilePic(valUser.imgKey as string)
            const insertS3Img: userType = { ...valUser, image: url ? url : undefined }

            return insertS3Img
        } catch (error) {
            throw new Error("issues getting users")
        } finally {
            await prisma.$disconnect()
        }
    }
}
export async function getUserPostDetail(userId: string) {
    if (!userId) return
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        const valUser: userType = user as userType
        let url: string | null = getProfilePic(valUser.imgKey as string)
        const user_insertS3Img: userType = { ...valUser, image: url ? url : undefined }
        return user_insertS3Img
    } catch (error) {
        throw new Error("issues getting users")
    } finally {
        await prisma.$disconnect()
    }

}
export async function getFile(fileID: string) {
    try {
        const file = await prisma.file.findUnique({
            where: {
                id: fileID
            },
            include: {
                inputTypes: true
            }
        });
        const body: fileType | undefined = await insertUrls(file as fileType)
        return body
    } catch (error) {
        throw new Error("issues getting file")
    } finally {
        await prisma.$disconnect()
    }
}

export async function getUserAccount() {
    const session = await getServerSession(authOptions);
    var account: userAccountType = {} as userAccountType;
    if (session) {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    email: session.user?.email as string
                }
            });
            if (user) {
                account = {
                    loaded: true,
                    data: {
                        status: "authenticated",
                        id: user.id,
                        name: session.user?.name as string,
                        email: session.user?.email as string,
                        image: session.user?.image ? session.user?.image : user.image,
                        imgKey: user.imgKey ? user.imgKey : undefined

                    }
                }
            }
        } catch (error) {

        } finally {
            await prisma.$disconnect()
        }

    } else {
        account = {
            loaded: false,
            data: {
                status: "unauthenticated",
                id: "",
                name: "",
                email: "",
                image: "",
                imgKey: undefined

            }
        }
    }
    return account


}

export async function getAllFiles() {
    try {
        const allFiles = await prisma.file.findMany();
        const body: fileType[] | undefined = allFiles as fileType[];
        const retUrlsFiles = retUrlInserts(body);
        return retUrlsFiles
    } catch (error) {
        console.error(new Error("did not return files, check:getAllFiles@serverGets"))
    } finally {
        await prisma.$disconnect()
    }
}

export async function getUserFiles() {
    const account = await getUserAccount();
    if (!account || !(account && account.data)) return
    const email: string | undefined = account.data?.email
    if (!email) return
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email
            },
            include: {
                files: true
            }
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
            const retUserFiles = userFiles.map((file) => insertUrls(file as fileType));
            return retUserFiles
        }


    } catch (error) {
        console.error(new Error("could not get userfiles@serverGets"))
    }
}

export async function getPosts() {
    try {
        const posts = await prisma.post.findMany();
        const insertUrlPosts = posts.map((post, index) => {
            if (post.s3Key && post.imageUrl) {
                return insertUrlPost(post as postType)
            } else {
                return post
            }
        });
        return insertUrlPosts;
    } catch (error) {
        console.error(new Error(" server issue- no posts"))
    }
}
export function checkS3KeyEnd(s3Key: string | undefined) {
    if (!s3Key) return false
    const arrEnds = [".png", ".jpeg", ".web"];
    let check: boolean = arrEnds.find(end => (s3Key.endsWith(end))) ? true : false
    return check
}

export function insertUrlPost(post: postType) {
    if (!post.s3Key) return post
    let checkS3Key = checkS3KeyEnd(post.s3Key)
    if (!checkS3Key) return post
    const s3Params = {
        Bucket: process.env.AWS_BUCKET_NAME as string,
        Key: post.s3Key,
    };
    const imageUrl = s3.getSignedUrl(
        "getObject", s3Params
    );
    post.imageUrl = imageUrl;
    return post

}

export async function getDetailPost(postId: number) {
    try {
        const post = await prisma.post.findUnique({
            where: {
                id: postId
            },
            include: {
                rates: true,
                likes: true
            }
        });
        return insertUrlPost(post as postType)
    } catch (error) {

    }
}