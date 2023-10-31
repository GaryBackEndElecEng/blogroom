import React from 'react';
import type { gets3ProfilePicType, upload3ProfilePicType, userType } from "@lib/Types";
import { getS3ProfilePic, uploadProfileToS3 } from "@lib/s3ApiComponents";
import { GeneralContext } from '@context/GeneralContextProvider';
import { Button } from "@chakra-ui/react";
import Image from 'next/image';
import { saveUser } from "@lib/fetchTypes";

type mainType = {
    setData: React.Dispatch<React.SetStateAction<userType>>,
    Data: userType
}
export default function UploadDisplayPic({ Data, setData }: mainType) {
    const imgKey = (Data && Data.imgKey) ? Data.imgKey : null;
    const imageUrl = (Data && Data.image) ? Data.image : undefined
    const { setUser, setMsg, msg } = React.useContext(GeneralContext);
    const [Key, setKey] = React.useState<string | null>(imgKey);
    const [s3Image, setS3Image] = React.useState<string | undefined>(imageUrl);
    const [tempImg, setTempImg] = React.useState<string | null>(null);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, Data: userType) => {
        e.preventDefault();
        if (!Data) return
        setIsLoading(true)
        const body = await uploadProfileToS3(e, Data) as upload3ProfilePicType | undefined
        if (!body) {
            return setMsg({ loaded: false, msg: "upload failed" })
        }
        setMsg({ loaded: true, msg: "uploaded" })
        const { key, msg } = body
        const modUser = { ...Data, imgKey: key } as userType;
        setKey(key);
        setData(modUser)
        setIsLoading(false)
        setTempImg(null)

    }

    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (!e.currentTarget.files) return
        const fileImg = e.currentTarget.files[0]
        //inserting temp img
        const tempImg_ = URL.createObjectURL(fileImg);
        setTempImg(tempImg_)

    }
    const cirImage = "border border-white shadow shadow-blue-300 p-1 rounded-full"

    return (
        <div className="flex flex-col items-start justify-evenly w-full">
            <form action="" onSubmit={(e) => handleSubmit(e, Data)}
                className="flex flex-row flex-wrap justify-around items-center gap-3 text-xs"
            >
                <label htmlFor="file" className="text-xs">pic upload</label>
                <input
                    id="file"
                    type="file"
                    name="file"
                    accept="image/png,image/jpeg,image/webP,image/svg"
                    onChange={onFileChange}
                />
                <div>
                    {msg.loaded ? (
                        <h3 className="text-blue-800 font-bold text-center">{msg.msg}</h3>
                    ) : (<h3 className="text-orange-800 font-bold text-center">{msg.msg}</h3>)}
                </div>
                <Button isLoading={isLoading} colorScheme="teal" variant="ghost" size="small" className="py-1 border border-blue shadow shadow-blue mt-10 rounded-lg aria-label px-3 rounded-full" type="submit" isDisabled={isLoading}  >up load</Button>

                <Button as={"label"} htmlFor="file" colorScheme="teal" variant="ghost" size="small" className="py-1 border border-blue shadow shadow-blue mt-10 rounded-lg aria-label opacity-0"   >choose file</Button>
            </form>

            <div className="flex flex-col justify-center items-center mt-2">
                {(tempImg && !s3Image) ?
                    (
                        <Image src={tempImg} width={75} height={75} alt="www.garymasterconnect.ca" className={cirImage} />
                    )
                    :
                    s3Image && (
                        <Image src={s3Image} width={75} height={75} alt="www.garymasterconnect.ca" className={cirImage} />
                    )
                }
            </div>
        </div>
    )
}
