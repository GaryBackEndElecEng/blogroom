import type { paramsType, fetchFilesType } from "@/types_";
import path from "path";
import fs from "fs";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const root = process.cwd();
const blogDirectory = path.join(root, "/blogs");
const imageBlogDir = path.join(root, "/public/images/blogs");

export function converFormToHtmlFileStr({ form }: { form: paramsType }) {
    const { heading, summary, summary2, heading2, date, id, section, section2, subheading2, subheading, filename, name } = form;
    const HTMLForm = (
        <div className="lg:container mx-auto w-full bg-slate-200 text-black">
            <h3 className="text center text-2xl underline underline-offset-8 my-2 mb-4">
                {heading}
            </h3>
            <p className="px-3 py-1">{summary}</p>
            <section>
                <h4 className="text-center my-2 mb-3">{subheading}</h4>
                <p className="px-3 py-1">{section}</p>
            </section>
            <h3 className="text center text-2xl underline underline-offset-8 my-2 mb-4">
                {heading2}
            </h3>
            <p className="px-3 py-1">{summary2}</p>
            <section>
                <h4 className="text-center my-2 mb-3">{subheading2}</h4>
                <p className="px-3 py-1">{section2}</p>
            </section>
            <div className="flex flex-row mt-4 justify-evenly gap-2">
                <h6 className="text-md text-italic font-bold">{name}</h6>
                <small className="text-sm font-bold  text-left">{date}</small>
            </div>
        </div>
    )
    return JSON.stringify(HTMLForm)
}

export function getHtmlFiles() {
    const filenames = fs.readdirSync(blogDirectory);
    //NOTE WHEN IMAGE, GET IMAGE TO FILENAME
    const allHtmlFiles = filenames.map((htmlFile) => {
        if (htmlFile.endsWith(".txt")) {
            const removeExt = htmlFile.replace(/\.txt$/, "");
            const filename = removeExt.split("-")[1];
            const id = removeExt //uuid-filename
            return {
                id,
                filename,
            }
        }
    });

    return allHtmlFiles
}
export async function getHtmlFileStr(htmlid: string) {

    const fullPath = path.join(blogDirectory, `${htmlid}.txt`);
    const fileHtmlContents = fs.readFileSync(fullPath, "utf8");
    //use gray-matter to parse metadata
    const matterRes = matter(fileHtmlContents);
    const processedContent = await remark().use(html).process(matterRes.content);
    const contentHTML = processedContent.toString()
    const blogHTML: { id: string, htmlContent: string } = {
        id: htmlid,
        htmlContent: contentHTML
    }
    return blogHTML;
}
