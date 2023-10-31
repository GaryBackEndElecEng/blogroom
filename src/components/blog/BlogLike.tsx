import React from 'react';
import styles from "@component/posts/posts.module.css";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import FavoriteIcon from '@mui/icons-material/Favorite';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import StarBorderPurple500Icon from '@mui/icons-material/StarBorderPurple500';

import { likefileType, fileType } from '@/lib/Types';
import { GeneralContext } from '../context/GeneralContextProvider';
import { sendFileLike } from '@/lib/fetchTypes';


//make line of switches for likes and dislikes, then add it to files=> DO THE SAME FOR POSTS

type mainIconType = {
    id: number,
    name: string,
    icon: React.ReactNode,
    class: string

}
type mainFileLikeType = {
    file: fileType,

}
export default function FileLike({ file }: mainFileLikeType) {
    const { setFileLikes, fileLikes } = React.useContext(GeneralContext);
    const notclicked = { loaded: false, class: styles.noname }
    const [named, setNamed] = React.useState<mainIconType | null>(null)
    const iconArr: mainIconType[] = [
        { id: 1, name: "avg", icon: <ThumbUpIcon />, class: styles.average },
        { id: 2, name: "great", icon: <FavoriteIcon />, class: styles.great },
        { id: 3, name: "loveit", icon: <InsertEmoticonIcon />, class: styles.loveit },
        { id: 4, name: "poor", icon: <ThumbDownIcon />, class: styles.poor },
        { id: 5, name: "amazed", icon: <StarBorderPurple500Icon />, class: styles.amazed },
    ]




    const handlePic = async (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, obj: mainIconType) => {
        e.preventDefault();
        setNamed({ id: obj.id, name: obj.name, icon: obj.icon, class: obj.class });
        const tempFileLike: likefileType = { name: obj.name, fileId: file.id as string }
        const updateFilelike = await sendFileLike(tempFileLike);
        if (!updateFilelike) return
        setFileLikes([...fileLikes, updateFilelike])

    }
    return (
        <div className="lg:container mx-auto w-full ">
            <div className="flex flex-row items-center justify-start  h-[75px] gap-5 mb-0 mx-auto">
                {
                    iconArr && iconArr.map((obj, index) => {

                        return (
                            <div className="mx-auto" key={index}>
                                <div className="flex flex-col items-center justify-center">
                                    <span onClick={(e) => handlePic(e, obj)} className={(named && named.id === obj.id) ? named.class : styles.noname}>
                                        {obj.icon}
                                    </span>
                                </div>
                                <div className="flex flex-col items-center justify-center">
                                    <span className={(named && named.id === obj.id) ? " underline underline-offset-4 text-slate-100 font-bold" : "text-slate-400"}>
                                        {obj.name}
                                    </span>
                                </div>
                            </div>
                        )
                    })
                }
            </div>

        </div>
    )
}
