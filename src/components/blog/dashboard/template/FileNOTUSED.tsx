"use client";
import React from 'react';
import { InputContext } from '../../../context/InputTypeProvider';
// import getFormattedDate from "@lib/getFormattedDate";
import type { fileType, msgType, userAccountType, } from '@lib/Types';
import Button from "@component/comp/Button";
import { IconButton, TextField } from "@mui/material";
import Msg from "@/components/comp/Msg";
import { saveFile } from "@lib/fetchTypes";
import DisplayInputTypes from "@/components/blog/dashboard/template/DisplayInputTypesNOTUSED";
import { saveToStorage } from "@lib/storePullLocStorage";
import SavedMsg from "@component/comp/SavedMsg";
import { GeneralContext } from '../../../context/GeneralContextProvider';


import OpenFileList from "@/components/blog/dashboard/template/OpenFileListNOTUSED";
import FileImage from "../../../comp/FileImage";
import ParagraphCreator from "@component/comp/ParagraphCreator"
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';

type mainFile = {
    saved: msgType,
    account: userAccountType | undefined,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    open: boolean,
    setOpenFile: React.Dispatch<React.SetStateAction<boolean>>,
    openFile: boolean,


}


///!NOTE:!! CHECK TO SEE IF THIS IS USED
export default function File({ saved, account, setOpen, open, setOpenFile, openFile }: mainFile) {

    const { file, setFile, date, inputArr, setMsg, msg, select } = React.useContext(InputContext);
    const { user } = React.useContext(GeneralContext);
    // const [isSubmit, setIsSubmit] = React.useState<boolean>(false);
    const [signup, setSignup] = React.useState<boolean>(false);



    const handleSubmit = async (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.preventDefault();
        if (!file) return setMsg({ loaded: false, msg: "no file" })
        const check = (account && account.data?.status === "authenticated") ? true : false
        if (!check) return setSignup(true)
        console.log(file.name)
        if (file.name === "filename" || !file.name || file.name === "") {
            return setMsg({ loaded: false, msg: "please enter a filename" })
        }
        try {
            const svFile: fileType | undefined = await saveFile(file)
            if (!svFile) return setMsg({ loaded: false, msg: "svFile doesn't exist" });
            setMsg({ loaded: true, msg: "file saved" });
            saveToStorage(svFile);
            setFile(svFile)

        } catch (error) {
            setMsg({ loaded: false, msg: "could not store on submit" });
        }

    }

    const handleOpenList = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault();
        if (open === false) {
            // console.log(open)
            setOpen(true);
            // console.log(openFile)
            setOpenFile(true);//opens fileList
        } else {
            // console.log(open)
            setOpen(false);
            setOpenFile(false)

        }
        // console.log("open", open, "openFile", openFile)
    }

    const summary = "mx-auto container flex flex-col w-full px-3 py-2"
    const container = "mx-auto lg:container flex flex-col items-center gap-3 justify-evenly lg:w-3/4 w-full "

    const NameFileName = "showItems flex flex-row justify-evenly items-center flex-wrap mx-auto mt-4 shadow shadow-blue-600 rounded-lg p-2 rounded-xl w-full relative";

    const select_ = "w-full font-bold flex flex-col flex-wrap gap-1 items-center justify-start px-2"

    const userInfo = "showItems flex flex-col justify-around items-center flex-wrap mx-auto my-3 shadow shadow-blue-600 rounded-lg p-2 rounded-xl w-full relative"

    return (
        <div className={container}>
            <div className={userInfo}>

                <div className="mx-auto flex flex-col gap-2">
                    {user &&
                        <h4 className={"text-center font-bold"}>{user.email}</h4>
                    }
                </div>
                <div className={NameFileName}>
                    <h5 className="font-bold">name: {user && user.name}</h5>
                    <h5 className="font-bold">Filename: {file && file.name}</h5>
                </div>
                {openFile ?
                    (
                        <IconButton size={"small"} className="px-4 rounded-xl w-[100px] bg-blue-800 shadow shadow-emerald-300 my-2 py-0 mx-auto " onClick={handleOpenList}>
                            <DriveFileMoveIcon sx={{ m: 1, color: "red", size: "50%" }} /><span className=" text-white"> close</span>
                        </IconButton>
                    )
                    :
                    (
                        <IconButton size={"small"} className="px-4 rounded-xl w-[100px] bg-blue-800 shadow shadow-emerald-300 my-2 py-0 mx-auto text-white" onClick={handleOpenList}>
                            <DriveFileMoveIcon sx={{ m: 1, color: "red", size: "50%" }} /><span className=" text-white"> open</span>
                        </IconButton>
                    )
                }
                <OpenFileList
                    setOpen={setOpen}
                    setOpenFile={setOpenFile}
                    openFile={openFile}
                />
            </div>
            <h4 className="font-bold text-left">selected:</h4>
            <div className={select_}>

                {file && file.inputTypes &&
                    (<DisplayInputTypes inputs={file.inputTypes} />)
                }
            </div>
            <small className="text-center font-bold">Date: {date && date.date}</small>
            <h1>FILE LIST- IS IT SHOWING!!</h1>



            <div className="mx-auto my-2 mt-4 " onClick={(e) => handleSubmit(e)}>
                <Msg msg={msg} setMsg={setMsg} />
                <Button tracking={true} border={true} color={"emerald"} >submit</Button>
            </div>



            <div className="border-2 border-white h-[5px] w-full mt-2" />



            <div className="flex flex-col items-center relative">
                <SavedMsg saved={saved} />
            </div>
            <section className={summary}>
                <h2 className="text-center px-5 my-2 mb-4 underline underline-offset-8 mx-auto">{file?.title}</h2>
                <FileImage />
                <div id={`${file?.id}- summary`} className="FileSummary  text-white my-2 text-lg">
                    {file && file.content && <ParagraphCreator content={file.content as string} subject={"summary"} />}

                </div>
            </section>
        </div>
    )
}

