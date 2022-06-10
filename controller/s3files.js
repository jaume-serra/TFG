const S3 = require("aws-sdk/clients/s3");
const fs = require("fs");

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;


const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey,
});

// UPLOAD FILE TO S3
function uploadFile(file, folder) {
    const fileStream = fs.createReadStream(file.path);
    const key = folder + '/' + file.filename
    const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: key
    }
    return s3.upload(uploadParams).promise()
}



async function emptyS3Directory(bucket, dir) {
    const listParams = {
        Bucket: bucket,
        Prefix: dir
    };

    const listedObjects = await s3.listObjectsV2(listParams).promise();

    if (listedObjects.Contents.length === 0) return;

    const deleteParams = {
        Bucket: bucket,
        Delete: { Objects: [] }
    };

    listedObjects.Contents.forEach(({ Key }) => {
        deleteParams.Delete.Objects.push({ Key });
    });

    await s3.deleteObjects(deleteParams).promise();

    if (listedObjects.IsTruncated) await emptyS3Directory(bucket, dir);
}



module.exports = { uploadFile, emptyS3Directory };
