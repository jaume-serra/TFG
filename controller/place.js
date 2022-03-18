const { Error } = require('mongoose');

const User = require('../models/users')
const Place = require('../models/place')

const { uploadFile } = require('./s3files')
const fs = require('fs');
const util = require('util');
const unlinkFile = util.promisify(fs.unlink)


const postCreatePlace = async (req, res) => {
    //Guardem espai i després fotos de l'espai
    console.log(req.body);



    //Guardar imatge a S3
    for(const file of req.files){
        try{
            //folderPath es el id del espai 
            const folderPath = "hola"
            // const result = await uploadFile(file,folderPath)
            await unlinkFile(file.path)
        }catch(err){
            res.send(err)
            console.log('err :>> ', err);
        }
    }
    res.render("place/create_place")
}




module.exports = { postCreatePlace }