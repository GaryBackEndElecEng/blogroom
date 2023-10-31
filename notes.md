**TODO:**

- ## adjust time delay access on s3 images
- ## MAKE A POST => shows that its not showing the post under user's post

- ### >> git init

  > > ## git add README.md
  > >
  > > ## git commit -m "first commit"
  > >
  > > ## git branch -M main
  > >
  > > ## git remote add origin https://github.com/GaryBackEndElecEng/blogroom.git
  > >
  > > ## git push -u origin main

- ## harden meta links with process.ENV_NODE==="production" => site address verse localhost
- ### Look into npx aws-sdk-js-codemod -t v2-to-v3 PATH.. ( migrating your code)-You have to provide at least one file/directory to transform.

# SNAPCHAT IS ALLOWING DEVELOPERS TO EMBED PUBLIC CONTENT WITHIN THEIR APP..!!

**to hook the viewer**
**START WITH A TITLE\*\*
**CATCHY TITLES- HOW TO,,, WHAT TO DO,,WHY,,USING THE 5-Ws,& list base post\*\*
**INTRODUCTION WITH A BOLD STATEMENT WITH WHAT WILL BE COVERED IN THE POST**
**BODY INCLUDES SUBE HEADINGS**

- ##CREATE A POLICY
- ##fill links,FB,instagram,GitHub,Websites
  -## ad blockquoet to patter match /"/gm and add &#\_\_; to /'/gm

- **easy reading and easy to skim- 1.5-2-lineheight separation with photos**
- **subheading -5-6lines max**
  **create links!!-MAKES YOU MORE CREDITABLE-!record the links-to-users in db**
  **CONCLUSION-LEAVE WITH A QUESTION**
  **EMPHASIZE , WITH COLOR THE CONCLSION** -**!IMPORTANT- end your blog with a question and means to a reply**

  - \*\*CREATE A NEW INPUT FOR FORMULAS- BLACK BACKGRAOUND(MODIFY SYNTACS FOR SPECIAL CHARACTORS ^=> <sup>,^^=><sub>,(=> (+space,,,,sum()=>sigma(find the anscii code,,etc)

- => blockquote with "reply"- button-( subscribed or none(anonymous))
  -\*\*IMPORTANT- WHEN YOU LINK TO SOMESIT- TELL THEM THAT YOU LINKED TO THEIR SITE.- SEND EMAIL

- **sort <Login/> in small format**
- ** DO META FOR USER PAGE**
- **Do upload image using cs3Client and signedUrl ( secret/client key, using the other technique. assign key name: uuid-header-image.ext=> give option of various images from other db linking images to masterconnect bucket**
- ** use element ID to change styles for user.**
- **build post page**
  **example**
  > test2=encodeURIComponent(test1)
  > 'gary%20wallace'
  > test3=decodeURIComponent(test2)
  > 'gary wallace'
  > OR remove space
  >
  > **html tricks**

<details className="testThis">
  <summary> This is clickable</summary>
  <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non velit quidem distinctio provident ipsa voluptate illo! Sint dicta officiis itaque ut voluptates est explicabo, veritatis sequi dolores aspernatur unde magni tempora distinctio aliquam deleniti autem possimus quaerat voluptate! Et tenetur doloribus iusto similique minima voluptatibus consequuntur illum rerum fuga nesciunt!</p>
  <input type="range" min="0" max="10" list="options" />
    <datalist id="options" className="text-white">
        <option value="0">not good</option>
        <option value="5">happy</option>
        <option value="10">stupendous</option>
    </datalist>
</details>

**STEPS TO CREATE A DB**

**VPC**

- 1.) select postgres
- 2.)select security group(side-panel)
- 3.)name it postgres-SG
- 4.) create inbound rule (TCP/v4 and TCP/V6)
- 5.) select PostgresSQL for the inbound rule for v4 and v6
- 6.) outbound leave-DONT TOUCH
  **NOW CREATE A DATABASE**
- 1.) standard create DB
- 2.) name it
- 3.) create passwords
- 4.) select db.t2.micro
- 5.) storage: select SSD (gp-2)
- 6.) unselect Enable storage auto scaling (or you will be charged- 20GB is large for free tier)
- 7.) connection: ensure IPv4 is selected and don't connect to an EC@ computer resource is selected
- 8.) enable public access
- 9.) IMPORTANT- " existing VPC" select the VPC postgres that you just created or use and existing one.
- 10.) available zone- leave as default
- 11.) Port under addition configuration leave as default 5432
  **additional configurations**
- 12.) give the name to your DB under **additional configurations**- Database options (masterultils/garymasterconnectDB). If you don't you will not be able to connect to it in PgAdmin or outside because, the instance is within a server group.
- 13.) disable **auto back-up**
- 14.) disable **encryption**
- 15.) disable **performance highlights**
- 16.) **NOW CREATE DB**
  **ONCE INSTANCE HAS BEEN CREATED**
  **CONNECTING TO TEH PGADMIN SW**
- 1.) click on your instance and copy the end-point to a clip-board;
  **garymasterconnect-db.cxxgkzn476nq.us-east-1.rds.amazonaws.com**
- 2.) open the **PgAdmin**
- 3.) paste the end-point into the the PgAdmin;
  **CREATING PGaDMIN CONNECTION**
- 4.) **create new server**
- 5.)**paster the end-point into connection**
- 6.) **enter your username **postgres** and pasword that you created**
- 7.) **click save password**
- -8.) you will see you instance name(masterultils / garymasterconnectDB)
  **"postgresql://postgres:JamieIsNow20@garymasterconnect-db.cxxgkzn476nq.us-east-1.rds.amazonaws.com/garymasterconnectDB?schema=public"**
- **postgresql://username:password@end-point/instance name?schema=public**
- **the schema=public is what you configured**

templateChld: perform a React state update on a component that hasn't mounted yet. This indicates that you have a side-effect in your render function that asynchronously later calls tries to update the component

USE THE KEY TO GET THE PRESIGNED URL FOR VIEWING (REFETCH IS DONE ON PAGE REFRESH): THE KEY IS ALL THAT IS NEEDED;
const { data } = await axios.get(`/api/media?Key=${Key}`);
const { uploadUrl, key, msg } = data;
=> THEN ON VIEWING THE SIDE, USING THE SAME AXIOS FUNCTION

PRESIGNEDURL:
1.)Flow=>
user=>gets a presigned URL from /api/\*
2.) now user has a limited amount of time to upload directly to s3 buckets.
3.) creat a new bucket

**NOTE!!!!!!!!**
Before the browser script can access the Amazon S3 bucket, you must first set up its CORS configuration as follows.
'''json
[
{
"AllowedHeaders": [
"*"
],
"AllowedMethods": [
"HEAD",
"GET",
"PUT",
"POST",
"DELETE"
],
"AllowedOrigins": [
"*"
],
"ExposeHeaders": [
"ETag"
]
}
]
'''

Upload an object in parts by using the AWS SDKs, REST API, or AWS CLI – Using the multipart upload API operation, you can upload a single large object, up to 5 TB in size.

The multipart upload API operation is designed to improve the upload experience for larger objects. You can upload an object in parts. These object parts can be uploaded independently,\n in any order, and in parallel. You can use a multipart upload for objects from 5 MB to 5 TB in size. For more information, see Uploading and copying objects using multipart upload.

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const client = new S3Client({});

export const main = async () => {
const command = new PutObjectCommand({
Bucket: "test-bucket",
Key: "hello-s3.txt",
Body: "Hello S3!",
});

try {
const response = await client.send(command);
console.log(response);
} catch (err) {
console.error(err);
}
};
