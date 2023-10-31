"use client"
import React from 'react'
import { GeneralContext } from '../../../context/GeneralContextProvider'
import { fileType } from '@/lib/Types';
import getFormattedDate from '../../../../lib/getFormattedDate';
import { Button } from "@mui/material";
import { useRouter } from 'next/navigation';
import { InputContext } from '../../../context/InputTypeProvider';
import Login from "@component/comp/Login";

type mainOpenFileType = {
    setOpenFile: React.Dispatch<React.SetStateAction<boolean>>,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    openFile: boolean
}

export default function OpenFileList({ setOpenFile, openFile, setOpen }: mainOpenFileType) {
    const router = useRouter()
    const { account, user } = React.useContext(GeneralContext);
    const { setFile } = React.useContext(InputContext);
    const [files, setFiles] = React.useState<fileType[]>([]);
    const [fileID, setFileID] = React.useState<string | undefined>()


    // React.useMemo(async () => {

    //     if (!user) return
    //     const getFiles = await getuserFiles(user.id);
    //     if (!getFiles) return
    //     setFiles(getFiles);
    // }, [user, setFiles]);

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        const getFile = files.find(file => (file.id === fileID))
        if (!getFile) return
        setFile(getFile);
        setOpenFile(false)
        setOpen(false)

    }
    const handleSingle = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setFile(files[0]);
        setOpenFile(false)
        setOpenFile(false)

    }
    function nameFile(fileID: string) {
        const getFile = files.find(file => (file.id === fileID))
        if (!getFile) return
        return getFile.name
    }
    const signinStyle = "container mx-auto w-full absolute inset-0 bg-white text-black flex flex-col items-center justify-center rounded-xl shadow-lg shadow-blue-800  "
    const container = openFile ? "container mx-auto w-full absolute inset-0 bg-white text-black flex flex-col sm:flex-row items-center justify-evenly rounded-xl shadow-lg shadow-blue-800" : " hidden";
    const options = "flex flex-row flex-wrap gap-1 sm:gap-2 lg:gap-3 font-bold mx-auto my-1 px-2 underline underline-offset-4";
    const selectEle = " border border-slate-800 rounded-lg shadow shadow-slate-500 py-2 px-3"
    const head4 = " px-3 mx-3  text-center font-bold";
    const para = "my-1 text-italic font-bold px-1 mx-2 sm:px-3 sm:mx-3 lg:px-5 lg:mx-5 ";
    const state = "preserve "

    return (
        <React.Fragment>
            {openFile &&
                <React.Fragment>
                    {(user) ?
                        (
                            <div className={container}>

                                <select
                                    onChange={(e) => setFileID(e.target.value)}
                                    className={selectEle}
                                >
                                    {(files && files.length > 0) && files.map((file, index) => (
                                        <React.Fragment key={index}>
                                            <option value={file.id} className={options}>
                                                name: {file.name}
                                                date: {getFormattedDate(file.date as Date)}
                                            </option>
                                        </React.Fragment>
                                    ))

                                    }
                                </select>
                                {(files && files.length > 0) ?
                                    <Button variant="contained" size="medium" onClick={(e) => handleSubmit(e)} className="bg-slate-800 text-white shadow rounded-lg shadow-slate-600">file:{nameFile(fileID as string)}</Button>
                                    :
                                    <Button variant="contained" size="medium" onClick={(e) => handleSingle(e)} className="bg-slate-800 text-white shadow rounded-lg shadow-slate-600"> new file</Button>
                                }



                            </div>
                        )
                        :
                        (
                            <div className={signinStyle}>
                                <h2 className="text-center font-bold px-3 my-2 ">Sign in to <q>{state.toUpperCase()} your work.</q>
                                </h2>
                                <h4 className={head4}> Your work is only accessed to you to update, create new and or delete make changes to your work</h4>
                                <q className={para}> The work and effort one puts in to display his or hers talent is worth preserving</q>
                                <div className="relative z-10000 px-1 py-[3px] bg-black rounded-lg shadow-lg shadow-emerald-500 ">
                                    <Login />
                                </div>
                            </div>
                        )
                    }
                </React.Fragment>
            }
        </React.Fragment>
    )
}

