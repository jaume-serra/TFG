const S3 = require("aws-sdk/clients/s3");
const fs = require("fs");

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
console.log('process.env.AWS_ACCES_KEY_ID :>> ', process.env.AWS_ACCES_KEY_ID);
const s3 = new S3({  
    region,  
    accessKeyId,  
    secretAccessKey,});

// UPLOAD FILE TO S3
function uploadFile(file) {  
    const fileStream = fs.createReadStream(file.path);  
    const uploadParams = {    
        Bucket: bucketName,    
        Body: fileStream,    
        Key: file.filename
    }
    return s3.upload(uploadParams).promise()
}
module.exports = { uploadFile };