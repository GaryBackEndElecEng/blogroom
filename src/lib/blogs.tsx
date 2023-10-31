import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { GrayMatterFile } from "gray-matter"
import { remark } from "remark";
import html from "remark-html";
import { BlogStoreType, BlogpostType } from "@/types_";
import getFormattedDate from "./getFormattedDate";
import { Metadata } from "next";


const root = process.cwd();
const blogDirectory = path.join(root, "/blogs");
const imageBlogDir = path.join(root, "/public/images/blogs");

export function getBlogMdxFiles() {
    const filenames = fs.readdirSync(blogDirectory);
    const imgs = fs.readdirSync(imageBlogDir);

    const allBlogsdata = filenames.map((filename) => {
        if (filename.endsWith(".mdx")) {
            const id = filename.replace(/\.mdx$/, "");
            const fullPath = path.join(blogDirectory, filename);
            const ext = readImgType(filename);
            // console.log(ext)
            const img = imgs.find(ob => (ob === `${id}.${ext}`))
            const fileContents = fs.readFileSync(fullPath, "utf8");
            const matterResult = matter(fileContents);

            const blogBlog: BlogpostType & { img: string } = {
                id: id,
                title: matterResult.data.title,
                date: matterResult.data.date,
                img: img as string
            }
            return blogBlog
        } else { return }
    });
    return allBlogsdata;
}


export async function getBlogMdxData(id: string) {
    const img = `/images/blogs/${id}.png`;
    const fullPath = path.join(blogDirectory, `${id}.mdx`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    //use gray-matter to parse metadata
    const matterResult = matter(fileContents);
    const processedContent = await remark().use(html).process(matterResult.content);
    const contentHTML = processedContent.toString()
    const blogBlogWithHTML: BlogpostType & { contentHTML: string, img: string } = {
        id,
        title: matterResult.data.title,
        date: matterResult.data.date,
        contentHTML,
        img
    }
    return blogBlogWithHTML;

}

export function generateMdxMetaData({ params }: { params: { blogid: string } }): Metadata {
    const blogs = getBlogMdxFiles() //deduped- info was already pulled( its stored in cache)
    const { blogid } = params;
    const blog = blogs?.find((post) => post?.id === blogid);
    if (!blog) {
        return {
            title: "blog not found"
        }
    } else {
        return {
            title: blog.title
        }
    }
}

export async function writeBlogData(htmlFile: string, filename: string) {
    const fullPath = path.join(blogDirectory, `${filename}.html.txt`);
    const fileContents = fs.writeFileSync(fullPath, htmlFile, "utf8");
    const newDate = new Date()
    const storedResponse: BlogStoreType = {
        id: filename,
        title: "html",
        date: getFormattedDate(newDate),
    }
    return storedResponse;

}
export async function getBlogHtmlData(id: string) {
    const fullPath = path.join(blogDirectory, `${id}.html.txt`);
    const contentHTML = fs.readFileSync(fullPath, "utf8");
    const date = new Date()
    const blogBlogWithHTML: BlogStoreType & { contentHTML: string } = {
        id,
        title: "html",
        date: getFormattedDate(date),
        contentHTML
    }
    return blogBlogWithHTML;

}
export function readImgType(filename: string) {
    const arrExt = ["png", "jpeg"]
    const removeExt = filename.replace(/\.mdx$/, "");
    //LOOP TO FIND TYPE PNG,JPEG,,=> EXT=>use pattern /\png$/
    //fileData reads the content, below
    const fullPath = path.join(imageBlogDir, `${removeExt}.png`);
    const fileData = fs.readFileSync(fullPath).toString();
    const type = fileData.startsWith("image") ? fileData.split("image")[1] : null; // is not reading=> find METHOD
    // console.log(fileData)
    if (type) {
        return type
    } else {
        return "png"
    }

}