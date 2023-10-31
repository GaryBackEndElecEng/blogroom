"use client"
import React from 'react';
import { fetchGetJsonFile } from "@lib/fetchTypes";
import { Heading, Section, Summary, SubHeading, Conclusion, type_, ImageJsx, FileContent, Question, HLink } from "@blogElement/elements";
import type { fetchSingleFileType, fetchSingleWrapType, msgType, userType, fileType } from "@lib/Types";
import { inputArr } from "@lib/Types";
import Button from '@component/comp/Button';
import Link from 'next/link';
import getFormattedDate from "@lib/getFormattedDate";
import Image from 'next/image';
import { InputContext } from '@context/InputTypeProvider';
import Published from "@component/comp/Published";
import ListComp from '@/components/comp/ListComp';


type mainBlogItemType = {
    get_file: fileType

}

export default function GenFileItem({ get_file }: mainBlogItemType) {
    const [getData, setGetData] = React.useState<fetchSingleFileType>({} as fetchSingleFileType);
    const { msg } = React.useContext(InputContext);
    const [published, setPublished] = React.useState<boolean>(false);
    const [staticFile, setStaticFile] = React.useState<fileType>({} as fileType)

    React.useEffect(() => { setStaticFile(get_file) }, [get_file, setStaticFile]);



    const container = type_("container");
    const h2 = type_("h2");
    const h1 = type_("h1");
    const msg_ = type_("msgAbs");
    const msgFalse = type_("msgfalse");
    const msgTrue = type_("msgTrue");
    const flexrow = type_("flexRowcenter");
    const dateToStr = get_file && get_file.date && getFormattedDate(get_file.date);
    // console.log(staticFile)

    return (
        <div className={container && container.item1}>
            <div className="flex flex-col justify-start items-center">
                <div className={msg_ && msg_.item1}>
                    {msg.loaded ? (
                        <div className={msgTrue && msgTrue.item1}>{msg.msg}</div>
                    ) : (<div className={msgFalse && msgFalse.item1}>{msg.msg}</div>)}
                </div>

                <div className={flexrow && flexrow.item1}>
                    <h6 className="font-bold">{getData.filename}</h6>
                </div>
                <small className="font-bold">{dateToStr && dateToStr}</small>
            </div>
            <div className="mx-auto lg:container px-2 my-2 flex flex-col items-center">
                <FileContent file={staticFile} />
            </div>
            <div className="mx-auto ">
                <Published published={published} setPublished={setPublished} get_file={get_file} />
            </div>
            <details>
                <summary className="mb-4 mx-auto cursor-pointer text-2xl"> open body</summary>
                <div className="mx-auto lg:container">
                    {staticFile && staticFile.inputTypes?.length!! &&
                        staticFile.inputTypes.map((input, index) => {
                            const check = inputArr.find(name => (name === input.name)) ? true : false;
                            if (!(check && index)) return
                            return (
                                <React.Fragment key={index}>
                                    <Heading input={input} />
                                    <SubHeading input={input} />
                                    <ImageJsx input={input} />
                                    <Summary input={input} />
                                    <Section input={input} />
                                    <Conclusion input={input} />
                                    <Question input={input} />
                                    <HLink input={input} />
                                    <ListComp input={input} />
                                </React.Fragment>
                            )
                        })
                    }
                </div>
            </details>

        </div>
    )
}