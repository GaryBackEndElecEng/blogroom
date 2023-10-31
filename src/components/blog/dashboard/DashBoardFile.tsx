"use client";
import React from 'react';
import Title from "@/components/comp/Title";
import Heading from "@/components/comp/Heading";
import { InputContext } from '../../context/InputTypeProvider';
import { gen_uuid } from "@lib/codeGenerator";
import getFormattedDate from "@lib/getFormattedDate";
import { inputArrType, inputType, contentType, fileType, msgType, propCompareType, userType, userAccountType, accountType } from '@lib/Types';
import Button from "@component/comp/Button";
import { IconButton, TextField } from "@mui/material";
import Msg from "@/components/comp/Msg";
import { fetchTemplateData, saveFile } from "@lib/fetchTypes";
import { gets3Image } from "@lib/s3ApiComponents";
import DisplayInputTypes from "@/components/blog/dashboard/template/DisplayInputTypes";
import { saveToStorage, getFromStorage } from "@lib/storePullLocStorage";
import SavedMsg from "@component/comp/SavedMsg";
import { insertType, addSelectAndSpread } from "@lib/generalFunc";
import { GeneralContext } from '../../context/GeneralContextProvider';
import PopUp from "@component/comp/PopUp";
import OpenFileList from "@/components/blog/dashboard/template/OpenFileList";
import { useRouter } from 'next/navigation';
import FileImage from "@component/comp/FileImage";
import ParagraphCreator from "@component/comp/ParagraphCreator"
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';


type mainFile = {
    setSaved: React.Dispatch<React.SetStateAction<msgType>>,
    saved: msgType,
    user: userType | null,
    file: fileType | null,


}



export default function DashBoardFile({ setSaved, saved, user, file }: mainFile) {
    const router = useRouter();
    const { setFile, date, inputArr, setMsg, input, setInput, setGetComponents, getComponents, setSelect, select, newFileAndInputControlPoint } = React.useContext(InputContext);
    const [select_2, setSelect_2] = React.useState<string>("select");
    const [signup, setSignup] = React.useState<boolean>(false);


    const handleSubmit = async (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.preventDefault();
        if (!file) return
        const check = (user && user.email) ? true : false
        if (!check) return setSignup(true)
        try {
            const svFile: fileType | undefined = await saveFile(file)
            if (!svFile) return
            setMsg({ loaded: true, msg: "file saved" });
            saveToStorage(svFile);
            setFile(svFile)

        } catch (error) {
            setMsg({ loaded: false, msg: "could not store on submit" });
        }

    }
    const handleAdd = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        if (!file) return
        const newFile = await newFileAndInputControlPoint(select_2, file);
        if (!newFile) return
        setFile(newFile)
    }

    const summary = "mx-auto container flex flex-col w-full px-3 py-2"
    const container = "mx-auto lg:container flex flex-col items-center gap-3 justify-evenly lg:w-3/4 w-full "
    const Form = "mx-auto lg:container flex  flex-col flex-wrap  items-center gap-3 justify-start sm:justify-evenly w-full relative ";
    const NameFileName = "showItems flex flex-row justify-evenly items-center flex-wrap mx-auto mt-4 shadow shadow-blue-600 rounded-lg p-2 rounded-xl w-full relative";
    const textfield = "text-black bg-white rounded-lg border border-blue-900 shadow shadow-white border border-red-900 cursor-pointer ";
    const textarea = "text-black bg-white rounded-lg border border-blue-900 shadow shadow-white border border-red-900 w-full ";
    const select_ = "w-full font-bold flex flex-col flex-wrap gap-1 items-center justify-start px-2"
    const select2 = "text-black shadow shadow-white rounded-md py-1 px-2 border border-white text-sm"
    const userInfo = "showItems flex flex-col justify-around items-center flex-wrap mx-auto my-3 shadow shadow-blue-600 rounded-lg p-2 rounded-xl w-full relative"
    const button = "flex flex-col justify-center items-center px-2 py-1 rounded-full border border-orange-300 shadow shadow-orange-600 mb-4";

    return (
        <div className={container}>
            <div className={userInfo}>

                <div className="mx-auto flex flex-col gap-2">
                    {user &&
                        <h4 className={"text-center font-bold"}>{user.email}</h4>
                    }
                </div>
                <div className={NameFileName}>

                    <h5 className="font-bold">Filename: {file && file.name}</h5>
                </div>
            </div>
            <small className="text-center font-bold">Date: {date && date.date}</small>

            <div className={Form}>

                <div className="mx-auto flex flex-col gap-2">
                    {user &&
                        <h4 className={"text-center font-bold"}>{user.name}</h4>
                    }
                </div>
                <div className="mx-auto flex flex-col my-2 text-white">
                    {file &&
                        <TextField
                            id={`${file.id}-${file.name}`}
                            required
                            label={"filename"}
                            name="filename"
                            aria-label="filename"
                            // helperText={" name"}
                            multiline={false}
                            className={textfield}
                            size={"small"}
                            placeholder={"filename"}
                            type="text"
                            value={file.name ? file.name : ""}
                            onChange={(e) => {
                                // if (!file.name) return
                                setFile({ ...file, name: e.target.value });
                            }}
                        />}
                </div>
                <div className="mx-auto flex flex-col my-2 text-white">
                    {file &&
                        <TextField
                            id={`${file.id}-${file.title}`}
                            required
                            label={"title"}
                            name="title"
                            aria-label="title"
                            // helperText={" name"}
                            multiline={false}
                            className={textfield}
                            size={"small"}
                            placeholder={"title"}
                            type="text"
                            value={file.title ? file.title : ""}
                            onChange={(e) => {
                                // if (!file.name) return
                                setFile({ ...file, title: e.target.value });
                            }}
                        />}
                </div>
                <div className="mx-auto flex flex-col my-2 text-white w-full px-3">
                    {file &&
                        <TextField
                            id={`${file.id}-${file.title}`}
                            required
                            label={"summary"}
                            name="content"
                            aria-label="summary"
                            // helperText={" name"}
                            multiline={true}
                            minRows={7}
                            margin={"dense"}
                            className={textarea}
                            size={"medium"}
                            placeholder={"content"}
                            type="text"
                            variant={"filled"}
                            value={file.content ? file.content : ""}
                            onChange={(e) => {
                                // if (!file.name) return
                                setFile({ ...file, content: e.target.value });
                            }}
                        />}
                </div>

                <div className="mx-auto flex flex-row justify-evenly items-center gap-2">
                    <select
                        id={"select"}
                        required
                        name="select"
                        aria-label="select input"
                        // defaultValue={"select"}
                        className={select2}
                        value={select_2}
                        onChange={(e) => {
                            setSelect_2(e.target.value)

                        }}
                    >
                        {inputArr.map((type, index) => {
                            if (type === "select") {
                                return (
                                    <option key={index} value="select" disabled>select type</option>
                                )
                            } else {
                                return (
                                    <React.Fragment key={index}>
                                        <option value={type} key={index}>{index + 1}.{type}</option>
                                    </React.Fragment>

                                )
                            }
                        })}
                    </select>
                    <button className={button} onClick={(e) => handleAdd(e)}>add</button>
                </div>
                <PopUp signup={signup} setSignup={setSignup} />
            </div>


            <div className="mx-auto my-2 mt-4 " onClick={(e) => handleSubmit(e)}>
                <Msg />
                <Button tracking={true} border={true} color={"emerald"} >submit</Button>
            </div>



            <div className="border-2 border-white h-[5px] w-full mt-2" />



            <div className="flex flex-col items-center relative">
                <SavedMsg saved={saved} />
            </div>
            <section className={summary}>
                <h2 className="text-center px-5 my-2 mb-4 underline underline-offset-8 mx-auto">{file?.title}</h2>
                <FileImage />
                <div id={`${file?.id}- summary`} className="text-sm text-white my-2">
                    {file && file.content && <ParagraphCreator content={file.content as string} subject={summary} />}

                </div>
            </section>
        </div>
    )
}