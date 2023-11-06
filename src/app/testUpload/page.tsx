"use client";
import React from 'react';
// import "@/lib/axios/defaultAxios";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import Image from 'next/image';
import type { gets3ProfilePicType } from "@lib/Types";


export default function TestPage() {
    const urlImage = "/images/gb_logo.png"
    const [img, setImg] = React.useState<string>(urlImage);

    const handleOnSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        const body = await uploadFile(e) as gets3ProfilePicType
        console.log("ONSUBMIT STAGE", body)//undefined
        if (body.imageUrl) {
            setImg(body.imageUrl);
        }

    };
    return (
        <div className="lg:container mx-auto prose prose-lg">
            <h3 className="text-center text-xl font-bold"> upload file</h3>
            <form action="" className="flex flex-col mx-auto gap3" onSubmit={handleOnSubmit}>
                <input
                    type="file"
                    name="file"
                    accept="image/png image/jpg image/jpeg"
                />
                <button className="buttonmd" type="submit">

                </button>
            </form>
            <div className="flex flex-col w-3/4 mx-auto">
                <Image src={img} width={600} height={400} alt="www.ablogroom.com" />
            </div>
        </div>
    )
}

export async function uploadFile(e: React.ChangeEvent<HTMLFormElement>) {
    const formdata = new FormData(e.currentTarget);
    const genKey = `${uuidv4().split("-").slice(0, 2).join("")}`;
    const file: File | null = formdata.get("file") as File;
    const key = `${genKey}-username/${file.name}`;
    formdata.set("Key", key)
    const passkey = key;
    if (!file) return null

    try {
        const options = {
            method: "PUT",
            headers: {
                Accept: "application/x-www-form-urlencoded"
            },
            body: formdata
        }
        await fetch(`/api/uploadImage`, options);

        const res2 = await fetch(`/api/getprofilepic?Key=${passkey}`);
        const body: gets3ProfilePicType | undefined = await res2.json()
        console.log("uploadFile func", body)//not recieved

        if (body) {
            return body
        } else {
            return null
        }

        // }
    } catch (error) {

    }
}

