"use client"
import React from 'react';
import { inputType, propCompareType, fileType, mediaType } from '@/lib/Types';
import { v4 as uuidv4 } from "uuid";
import { InputContext } from "@context/InputTypeProvider";
import axios from "axios";
import { Button } from "@chakra-ui/react"
import { inputComponent, insertInput } from '@/lib/generalFunc';
import { saveToStorage, getFromStorage } from "@lib/storePullLocStorage";
import { uploadToS3, gets3Image, fileUploadToS3 } from "@lib/s3ApiComponents";
import Image from 'next/image';
import { addInput, saveFile } from '@/lib/fetchTypes';
import { updateFile } from "@lib/generalFunc";

type mediaInputType = {
    imageObj: inputType,
    setImageObj: React.Dispatch<React.SetStateAction<inputType | null>>
}
type getUrlType = {
    uploadUrl: string
    key: string,
    msg: string
}


export default function FileImage() {
    const { file, setFile } = React.useContext(InputContext);
    const [tempImg, setTempImg] = React.useState<string | null>(null);
    const [msg, setMsg] = React.useState<mediaType>({ loaded: false, message: "" });
    const [isUploading, setIsUploading] = React.useState<boolean>(false)
    const randNum = uuidv4().split("-")[0];



    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (!e.currentTarget.files) return
        const fileImg = e.currentTarget.files[0]
        //inserting temp img
        const tempImg_ = URL.createObjectURL(fileImg);
        setTempImg(tempImg_)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsUploading(true);
        //THIS GETS PRESIGNED URL FOR UPLOADS then uploads to s3 directly FROM @lib/s3ApiComponents
        if (!file) return
        const result = await fileUploadToS3(e, file)

        if (result && file) {
            const body: { key: string, msg: mediaType } = result
            //KEY-MODIFIED-ADDED FILE EXTENSION TO KEY
            const prevImageObj: fileType = { ...file, imageKey: body.key }
            const savedFile = await saveFile(prevImageObj);//saving/getting file.imageUrl
            if (!savedFile) return
            setFile(savedFile);
            //save to storage
            saveToStorage(savedFile);
            setTempImg(null)
        } else {
            setMsg({ loaded: false, message: "only image files are excepted, try again" })
        }
        setIsUploading(false);

    }
    const msgStyle = "text text-center top-0 inset-0 bg-inherit text-xl";

    return (
        <div className="container mx-auto w-full lg:w-3/4 relative overflow-hidden">
            {msg.message && <div className={`${msgStyle} ${msg.loaded ? "text-white" : " text-red-800"} bg-white`}>{msg.message}</div>}
            <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col mx-auto  my-2 z-1">
                <input
                    hidden={tempImg ? true : false}
                    id={(file && file.id) ? file.id as string : "file cover image"}
                    type="file"
                    name="file"
                    accept="image/png,image/jpeg,image/webP,image/svg"
                    onChange={onFileChange}
                />
                {tempImg ?

                    <Button isLoading={isUploading} colorScheme="teal" variant="ghost" size="medium" className="py-1 border border-blue shadow shadow-blue mt-10 rounded-lg aria-label px-3 rounded-full" type="submit" isDisabled={isUploading}  >up load</Button>
                    :
                    <Button as={"label"} htmlFor="file" colorScheme="teal" variant="ghost" size="medium" className="py-1 border border-blue shadow shadow-blue mt-10 rounded-lg aria-label opacity-0"   >choose file</Button>
                }
            </form>
            <div className="container image w-full mx-auto flex flex-col items-center justify-center  z-1000">
                {
                    tempImg ?
                        <Image src={tempImg}
                            alt={`${file ? file.title : "cover image"}`}
                            width={600}
                            height={400}
                            className={"image m-auto"}
                        />
                        :
                        (file && file.imageUrl && file.imageUrl.startsWith("https") &&
                            <Image
                                id={file.id}
                                src={file && file.imageUrl as string}
                                alt={`main cover image`}
                                width={600}
                                height={400}
                                className={"image m-auto"}
                            />
                        )
                }
            </div>
        </div>
    )
}