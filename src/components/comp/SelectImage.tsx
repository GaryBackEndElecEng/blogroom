"use client"
import React from 'react';
import { InputContext } from "@context/InputTypeProvider";
import { inputType, inputArr, fileType, msgType } from "@lib/Types";
import { TextField } from "@mui/material";
import { saveToStorage, getFromStorage } from "@lib/storePullLocStorage";
import SavedMsg from "@component/comp/SavedMsg";
import { inputComponent, inputComponentImage, inputInsertUrl, reduceModAndAddComp, removeComponent } from '@/lib/generalFunc';
import { addInput, fetchPostImage, saveFile } from '@/lib/fetchTypes';
import Image from "next/image";
import { gets3Image } from "@lib/s3ApiComponents";

import UploadPreSigned from './UploadPreSigned'
import ButtonGroup from './ButtonGroup';

type mainHeader = {
    input: inputType
}

export default function SelectImage({ input }: mainHeader) {
    const subject = 'image';
    const initImageObj: inputType | null = input.name === subject ? input : null
    //----at Meta(top file) -id represents the BLOg ID---//

    const { saved, file, setFile, setMsg, msg, setSelect } = React.useContext(InputContext);
    const [imageObj, setImageObj] = React.useState<inputType | null>(initImageObj)
    const [deleteUnit, setDeleteUnit] = React.useState<inputType | null>(initImageObj);
    const [popup, setPopup] = React.useState<boolean>(false);
    const show = input.name === subject && initImageObj && initImageObj.id === input.id ? true : false;


    const container = show ? "mx-auto flex flex-col flex-1 gap-2 lg:container border border-2 shadow-lg shadow-orange-600 w-full lg:w-full  cursor-pointer" : "hidden";

    const handleDelete = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        if (!deleteUnit || !file) return
        const retFile = await removeComponent(file, deleteUnit);
        if (!retFile) return;
        setFile(retFile)
        setMsg({ loaded: true, msg: `${deleteUnit.name}-${deleteUnit.id} has been deleted` });
        // console.log(deleteUnit)
        setPopup(false);
        setSelect(null)
        return
    }



    return (
        <div className={container}>
            <SavedMsg saved={saved} />
            <UploadPreSigned
                imageObj={imageObj}
                setImageObj={setImageObj}

            />
            <button className="button" onClick={handleDelete}> delete image</button>
        </div>

    )
}