"use client";
import React from 'react';
import Title from "@/components/comp/Title";
import Heading from "@/components/comp/Heading";
import SubHeading from "@/components/comp/SubHeading";
import HLink from "@/components/comp/HLink";
import Section from "@/components/comp/Section";
import Summary from "@/components/comp/Summary";
import Conclusion from "@/components/comp/Conclusion";
import Question from "@/components/comp/Question";
import File from "@/components/blog/dashboard/template/File";
import SelectImage from "@component/comp/SelectImage";
import { InputContext } from '../../../context/InputTypeProvider';
import { gen_uuid } from "@lib/codeGenerator";
// import getFormattedDate from "@lib/getFormattedDate";
import type { userAccountType, userType, } from '@/lib/Types';
import SavedMsg from "@component/comp/SavedMsg";
import Button from "@component/comp/Button";
import Link from "next/link";
import { selectControl } from "@lib/generalFunc";
import ListComp from '@/components/comp/ListComp';

type mainTemplateType = {
    account: userAccountType | undefined,
    user: userType | undefined
}

export default function Template1({ account, user }: mainTemplateType) {
    const getCode = gen_uuid();
    const { file, saved, select, newFileAndInputControlPoint } = React.useContext(InputContext);
    const [open, setOpen] = React.useState<boolean>(false);
    const [openFile, setOpenFile] = React.useState<boolean>(true);

    React.useMemo(async () => {
        if (!select || !file) return
        ///----THIS ADDS A NEWLY CREATED SELECT INPUT TO THE FILE
        await newFileAndInputControlPoint(select, file);
    }, [select]);



    const container = "flex flex-col items-center justify-start mx-auto gap-2 my-0";
    const subContainer = "flex flex-col items-center justify-start mx-auto gap-1 w-full lg:w-3/4";
    return (
        <div className={container}>
            <div className={subContainer}>
                <h3 className="text-center font-bold my-3">
                    {user?.name} &#8217;s Blog
                </h3>
                <File
                    saved={saved}
                    setOpen={setOpen}
                    open={open}
                    setOpenFile={setOpenFile}
                    openFile={openFile}
                    account={account}
                />

                <div className="border-2 border-white h-[5px] w-full mt-2" />

            </div>
            <div className={subContainer}>
                <SavedMsg saved={saved} />
                {file && file.inputTypes && file.inputTypes.length!! &&
                    file.inputTypes.map((input, index) => {
                        let check: boolean = selectControl(input);
                        console.log("check", check)
                        if (check) {
                            console.log(input)
                            return (
                                <React.Fragment key={index}>
                                    <Title input={input} />
                                    <SelectImage input={input} />
                                    <Heading input={input} />
                                    <Summary input={input} />
                                    <SubHeading input={input} />
                                    <Section input={input} />
                                    <HLink input={input} />
                                    <Conclusion input={input} />
                                    <Question input={input} />
                                    <ListComp input={input} />
                                </React.Fragment>
                            )
                        }
                    })
                }
            </div>
            <Link href={"/blog"} className={"mb-4"}>
                <Button color={"emerald"} border={true} > go to posts</Button>
            </Link>
        </div>
    )
}
