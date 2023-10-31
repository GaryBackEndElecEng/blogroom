import type {GrayMatterFile} from "gray-matter"
type dataType={
    data: { 
        id:string,
        title:string,
        date:string
     }
}

type GraymatterType={
    data: { [key: string]: any }
    content: string
    excerpt?: string
    orig: Buffer | I
    language: string
    matter: string
    stringify(lang: string): string
}
 export interface BlogpostType extends GrayMatterFile{
id:string,
title:string,
date:string
}
 export interface BlogStoreType{
id:string,
title?:string,
date:string
}
export type paramsType = {
    id:string,
    filename:string,
    heading?: string,
    summary?:string,
    summary2?:string,
    subheading?: string,
    section?: string,
    heading2?: string,
    subheading2?: string,
    section2?: string,
    name:string,
    date: string
}
export type msgType={
    loaded:boolean,
    msg:string
}
export type htmlDirsType={
    id:string,
    filename:string,
}
export type fetchFilesType={
    htmlDirs:htmlDirsType[] 
    status:number,
    message:string 
}

export type IDCollectorType={
    targetIDs:string[],
    id:string
}
export type inputNameType = {
    nameType:"title"| "summary"|"section"|"heading"|"subHeading"| undefined
}
export type inputArrType = string[]

export type inputType = {
    id?: string ,
    name:string,
    input: string,
    targetID: string
  }
export type contentType = {
    id?: string ,
    name:string,
    input: string,
    targetID: string
  }

  export type dateType = {
    id: string,
    date: string,
  
  }
 
  export type fileType = {
    id: string,
    name: string,
    date:dateType,
    filename: string,
    inputTypes:inputType[],
  }
 
  export type masterfileType = {
    id: string,
    file:fileType,
    inputtypes:inputTypes
  }
  export const inputArr: inputArrType = ["select", "title", "summary", "section", "heading", "subHeading"];