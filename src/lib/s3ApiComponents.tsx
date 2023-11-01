import axios from 'axios';
import { v4 as uuidv4 } from "uuid";
import { fileType, gets3ImageType, gets3ProfilePicType, mediaType, postType, userType } from './Types';
import { inputType } from '@lib/Types';
import S3 from "aws-sdk/clients/s3";

export const s3 = new S3({
    apiVersion: "2006-03-01",
    accessKeyId: process.env.SDK_ACCESS_KEY,
    secretAccessKey: process.env.SDK_ACCESS_SECRET,
    region: process.env.BUCKET_REGION,
    signatureVersion: "v4"
})

type masterData = {
    data: mainData
}
type mainData = {
    uploadUrl: string,
    key: string,
    msg: string
}


export async function uploadToS3(e: React.FormEvent<HTMLFormElement>, imageObj: inputType) {
    e.preventDefault();
    const formdata = new FormData(e.currentTarget);
    const file: File = formdata.get("file") as File
    if (!file) return null
    const ext = file.type.split("/")[1]
    const Key = `${imageObj.s3Key}.${ext}`
    // console.log("key", key)
    const fileType = new URLSearchParams(file.type).toString();
    formdata.append("file", file);
    formdata.append("filename", file?.name);

    try {
        //api/media has req.query.fileType/& Key
        const { data } = await axios.get(`/api/media?fileType=${fileType}&Key=${Key}`);
        const { uploadUrl, key, msg } = data;
        // doing a put requestmsg={loaded,message}
        if (msg.loaded) {
            await axios.put(uploadUrl, file);
            return { key: key, msg }
        } else {
            return { key: key, msg }
        }

    } catch (error) {
        throw new Error("did not get urlkey")
    }
}
export async function uploadProfileToS3(e: React.FormEvent<HTMLFormElement>, user: userType) {
    e.preventDefault();
    const genUuid = uuidv4().split("-")[0]
    if (!(user.name)) return
    const username = user.name.replace(" ", "-")
    const userImage = `${genUuid}-${username}`
    const formdata = new FormData(e.currentTarget);
    const file: File = formdata.get("file") as File

    if (!file) return null
    const ext = file.type.split("/")[1]
    const key = `${userImage}.${ext}`
    const Key = `${userImage}.${ext}`
    const fileType = new URLSearchParams(file.type).toString();
    formdata.append("file", file);
    formdata.append("filename", file?.name);
    formdata.append("userImage", key);

    try {
        //api/media has req.query.fileType/& Key
        const { data } = await axios.get(`/api/media?fileType=${fileType}&Key=${Key}`);
        const { uploadUrl, key, msg } = data;
        // doing a put requestmsg={loaded,message}
        if (msg.loaded) {
            await axios.put(uploadUrl, file);
            return { key: key, msg }
        } else {
            return { key: key, msg }
        }

    } catch (error) {
        throw new Error("did not get urlkey")
    }
}
//SAVEFILE IN FETCHTYPES RETURNS THE PRESIGNED URL: THIS FUNCTION IS ONLY USED IN SPECIAL CASES:
//NOTE ALL GET FILES HAVE PRESIGNED URL!!!!!!!!
export async function gets3Image(Key: string | null, fileType: string, fileID: string) {
    let missing: string | undefined;
    if (!(Key && fileID && fileType)) return
    try {
        //api/media has req.query.fileType/& Key
        const { data } = await axios.get(`/api/getmedia?fileType=${fileType}&Key=${Key}&fileID=${fileID}`);
        const body: gets3ImageType = data;
        // givin a temp url to get image
        missing = switchFunct(data)
        return body

    } catch (error) {
        throw new Error(`did not get the following:${missing}`)
    }
}
export async function getS3ProfilePic(Key: string | undefined) {

    if (!(Key)) return
    try {
        //api/media has req.query.fileType/& Key
        const { data } = await axios.get(`/api/getprofilepic?Key=${Key}`);
        const body: gets3ProfilePicType = data;
        // givin a temp url to get image
        return body

    } catch (error) {
        console.error(new Error("did not get user's image S3 URL"))
    }
}


function switchFunct(data: gets3ImageType) {
    const { imageUrl, key, msg, imageObj } = data;
    switch (false) {
        case (!imageUrl):
            return "uploadUrl";
        case (!key):
            return "key";
        case (!msg):
            return "msg"
        default:
            return "data was undefined"
    }
}

export async function fileUploadToS3(e: React.FormEvent<HTMLFormElement>, file: fileType) {
    e.preventDefault();
    const formdata = new FormData(e.currentTarget);
    const file_: File = formdata.get("file") as File
    if (!file_) return null
    const ext = file_.type.split("/")[1];
    const genKey = `${uuidv4().split("-")[0]}-${file.name}-${uuidv4().split("-")[0]}`
    const Key = `${genKey}.${ext}`
    const fileType = new URLSearchParams(file_.type).toString();
    formdata.append("file", file_);
    formdata.append("filename", file_?.name);

    try {
        //api/media has req.query.fileType/& Key
        const { data } = await axios.get(`/api/media?fileType=${fileType}&Key=${Key}`);
        const { uploadUrl, key, msg } = data;
        // doing a put requestmsg={loaded,message}
        if (msg.loaded) {
            await axios.put(uploadUrl, file_);
            return { key: key, msg }
        } else {
            return { key: key, msg }
        }

    } catch (error) {
        throw new Error("did not get urlkey")
    }
}
export async function imgPostUploadToS3(e: React.FormEvent<HTMLFormElement>, user: userType) {
    e.preventDefault();
    if (!user! || !user.name) return
    const formdata = new FormData(e.currentTarget);
    const file_: File = formdata.get("file") as File;
    if (!file_) return null
    const ext = file_.type.split("/")[1];
    const encodeUsername = user.name.replace(" ", "-")
    const genKey = `${user.id}-${encodeUsername}/${uuidv4().split("-")[0]}-${file_.name}`
    const key = `${genKey}`
    const fileType = new URLSearchParams(file_.type).toString();
    const Key = `${genKey}`;
    formdata.append("file", file_);
    formdata.append("filename", file_?.name);

    try {
        //api/media has req.query.fileType/& Key
        const { data } = await axios.get(`/api/media?fileType=${fileType}&Key=${Key}`);
        const { uploadUrl, key, msg } = data;
        // doing a put requestmsg={loaded,message}
        if (msg.loaded) {
            await axios.put(uploadUrl, file_);
            return { key: key, msg }
        } else {
            return { key: key, msg }
        }

    } catch (error) {
        throw new Error("did not get urlkey")
    }
}

const matchEnd = (input: inputType) => {
    let arr: string[] = [".png", ".jpeg", ".Web", "PNG", "JPEG"]
    let check: boolean = false;
    arr.forEach((end, index) => {
        if (input.s3Key?.endsWith(end)) {
            return check = true
        }
    });
    return check
}

export function insertUrls(file: fileType) {
    // if (!file) return
    let tempFile: fileType = file;
    if (!tempFile.imageKey) return tempFile
    let checkS3 = checkS3KeyEnd(tempFile.imageKey)
    if (!checkS3) return tempFile
    const s3Params = {
        Bucket: process.env.BUCKET_NAME as string,
        Key: tempFile.imageKey,
    };
    const imageUrl = s3.getSignedUrl(
        "getObject", s3Params
    );
    tempFile.imageUrl = imageUrl;
    if (!tempFile.inputTypes || !(tempFile.inputTypes?.length > 0)) return tempFile
    tempFile.inputTypes.map((input, index) => {
        if (!input.s3Key) return input
        let checkS3 = checkS3KeyEnd(input.s3Key)
        if (!checkS3 || input.name !== "image") return input
        const s3Params = {
            Bucket: process.env.BUCKET_NAME as string,
            Key: input.s3Key,
        };
        const imageUrl = s3.getSignedUrl(
            "getObject", s3Params
        );
        input.url = imageUrl;
        return input
    });
    return tempFile
}

export function checkS3KeyEnd(s3Key: string | undefined) {
    if (!s3Key) return false
    const arrEnds = [".png", ".jpeg", ".web"];
    let check: boolean = arrEnds.find(end => (s3Key.endsWith(end))) ? true : false
    return check
}
//THIS RETURNS ALL S3 URL TO AN ARRAY OF FILES AND WORKS!!
export function retUrlInserts(files: fileType[]) {

    const getFiles = files.map(file => {
        if (!(file && file?.imageKey && file?.imageUrl)) return file
        let check: boolean = checkS3KeyEnd(file?.imageKey);
        if (!check) return file
        const s3Params = {
            Bucket: process.env.BUCKET_NAME as string,
            Key: file.imageKey,
        };
        const imageUrl = s3.getSignedUrl(
            "getObject", s3Params
        );
        file.imageUrl = imageUrl;
        if (!file.inputTypes) return file
        file.inputTypes.map((input, index) => {
            return retUrlInput(input)
        });
        return file
    });
    return getFiles
}
export function retUrlInput(input: inputType) {
    if (input.name !== "image" || !input.s3Key) return input
    let checkS3Key = checkS3KeyEnd(input.s3Key)
    if (!checkS3Key) return input
    const s3Params = {
        Bucket: process.env.BUCKET_NAME as string,
        Key: input.s3Key,
    };
    const imageUrl = s3.getSignedUrl(
        "getObject", s3Params
    );
    input.url = imageUrl;
    return input

}
export function getProfilePic(key: string) {
    if (!key) return null
    let checkS3Key = checkS3KeyEnd(key)
    if (!checkS3Key) return null
    const s3Params = {
        Bucket: process.env.BUCKET_NAME as string,
        Key: key,
    };
    const imageUrl = s3.getSignedUrl(
        "getObject", s3Params
    );
    return imageUrl

}

export function insertUrlPost(post: postType) {
    if (!post.s3Key) return post
    let checkS3Key = checkS3KeyEnd(post.s3Key)
    if (!checkS3Key) return post
    const s3Params = {
        Bucket: process.env.BUCKET_NAME as string,
        Key: post.s3Key,
    };
    const imageUrl = s3.getSignedUrl(
        "getObject", s3Params
    );
    post.imageUrl = imageUrl;
    return post

}
export function insertUrlPosts(posts: postType[]) {
    if (!posts) return
    return posts.map(post => insertUrlPost(post))


}
