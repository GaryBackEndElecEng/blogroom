"use client"
import React from 'react';
import { inputType, mediaType } from '@/lib/Types';
import { v4 as uuidv4 } from "uuid";
import { InputContext } from "@context/InputTypeProvider";
import { Button } from "@chakra-ui/react"
import { saveToStorage } from "@lib/storePullLocStorage";
import { uploadToS3, } from "@lib/s3ApiComponents";
import Image from 'next/image';
import { updateInput } from '@/lib/fetchTypes';

type mediaInputType = {
    imageObj: inputType | null,
    setImageObj: React.Dispatch<React.SetStateAction<inputType | null>>
}
type getUrlType = {
    uploadUrl: string
    key: string,
    msg: string
}


export default function UploadPreSigned({ imageObj, setImageObj }: mediaInputType) {
    const { file, setSaved, setFile, setSelect } = React.useContext(InputContext);
    const [tempImg, setTempImg] = React.useState<string | null>(null);
    const [msg, setMsg] = React.useState<mediaType>({ loaded: false, message: "" });
    const [isUploading, setIsUploading] = React.useState<boolean>(false)
    const randNum = uuidv4().split("-")[0];


    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (!file) return
        if (!e.currentTarget.files) return
        const fileImg = e.currentTarget.files[0]
        //inserting temp img
        const tempImg_ = URL.createObjectURL(fileImg);
        setTempImg(tempImg_)
        setSelect(null)
        if (!file) return

    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsUploading(true);
        //THIS GETS PRESIGNED URL FOR UPLOADS then uploads to s3 directly FROM @lib/s3ApiComponents
        if (!file || !imageObj) return
        setIsUploading(true)
        const result = await uploadToS3(e, imageObj)

        if (result && file) {
            const body: { key: string, msg: mediaType } = result
            //KEY EXTENSION CHANGED (ext) ADDING TO imageObj
            const prevImageObj: inputType = { ...imageObj, s3Key: body.key }
            // console.log("matchEnd", matchEnd(prevImageObj))
            // console.log(prevImageObj)
            setImageObj(prevImageObj)
            setMsg(body.msg);
            //adding s3Key to file
            //GETTING URL;
            const update_file = await updateInput(prevImageObj)
            if (update_file) {
                setFile(update_file)
                //save to storage
                saveToStorage(update_file);
                setTempImg(null)
                setSaved({ loaded: true, msg: "saved" });
            }
        } else {
            setMsg({ loaded: false, message: "only image files are excepted, try again" })
        }
        setIsUploading(false);

    }
    // console.log("KEY", imageObj?.s3Key)
    const msgStyle = "text text-center top-0 inset-0 bg-inherit text-xl";
    const imageStyle = " mx-auto"
    return (
        <div className="container mx-auto w-full lg:w-full relative overflow-hidden">
            {msg.message && <div className={`${msgStyle} ${msg.loaded ? "text-white" : " text-red-800"} bg-white`}>{msg.message}</div>}
            <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col mx-auto  my-2 z-1">
                <input
                    hidden={tempImg ? true : false}
                    id={(imageObj && imageObj.id) ? String(imageObj.id) : "image id"}
                    type="file"
                    name="file"
                    accept="image/png,image/jpeg,image/webP,image/svg"
                    onChange={onFileChange}
                />
                {tempImg ?

                    <Button isLoading={isUploading} colorScheme="teal" variant="ghost" size="small" className="py-1 border border-blue shadow shadow-blue mt-10 rounded-lg aria-label px-3 rounded-full" type="submit" isDisabled={isUploading}  >up load</Button>
                    :
                    <Button as={"label"} htmlFor="file" colorScheme="teal" variant="ghost" size="small" className="py-1 border border-blue shadow shadow-blue mt-10 rounded-lg aria-label opacity-0"   >choose file</Button>
                }
            </form>
            <div className="container  w-full mx-auto flex flex-col flex-1 items-center justify-center  z-1000">
                {tempImg
                    &&
                    <Image src={tempImg}
                        alt={`${randNum}-image`}
                        width={600}
                        height={400}
                        className={imageStyle}
                    />
                }
                {(imageObj && imageObj.url && !tempImg) &&
                    <Image src={imageObj.url}
                        id={String(imageObj.id)}
                        alt={`${imageObj.content}-${file && file.name} image`}
                        width={600}
                        height={400}
                        className={imageStyle}
                    />
                }
            </div>
        </div>
    )
}