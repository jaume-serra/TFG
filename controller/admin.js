//BBDD
const Rating = require('../models/rating')
const Place = require('../models/place')

//Send email
const { sendEmail } = require('./sendEmail')
const { emptyS3Directory } = require('./s3files')

const getAdmin = async (req, res) => {
    //Mostrar solicituds espais
    //Acceptar o eliminar
    //Posar a true active
    const places = await Place.find({ 'active': false })
    return res.render("./admin/admin", { 'places': places })
}


const postActivate = async (req, res) => {
    const { id, email } = req.body

    try {
        const place = await Place.findByIdAndUpdate({ '_id': id }, { 'active': true })
        const mailData = {
            from: process.env.USER_EMAIL,
            to: email,
            subject: `Sol·licitud de creació d'un espai acceptada`,
            html:
                `<h2> Sol·licitud d'un espai</h2>
            <p>Benvolgut client, s'ha acceptat la sol·licitud de creació d'un espai.<br><br>Pots trobar el link a continuació: <br><a href="https://getKeepers.net/place/${place.id}?lat=${place.lat}&lng=${place.lng}">Visita el lloc</a><br>Qualsevol cosa, posa't amb contacte amb nosaltres <br/><br/> Moltes gràcies, equip getKeepers </p>
            `
        }
        await sendEmail(mailData)
        const places = await Place.find({ 'active': false })
        return res.render("./admin/admin", { 'places': places, 'activated': true, 'msg': "Has activat l'espai correctament" })


    } catch (error) {
        const places = await Place.find({ 'active': false })
        return res.render("./admin/admin", { 'places': places, 'error': error })

    }
}


const postEliminate = async (req, res) => {
    //Eliminar sol·licitud espai
    //Enviar correu al propietari
    //Eliminar fotos de S3

    const { id, email } = req.body

    try {
        const placeRemoved = await Place.findByIdAndRemove({ '_id': id })
        const mailData = {
            from: process.env.USER_EMAIL,
            to: email,
            subject: `Cancel·lació de la sol·licitud de creació d'un espai`,
            html:
                `<h2>Cancel·lació de la sol·licitud</h2>
            <p>Benvolgut client, l'administrador de la plataforma ha eliminat la teva sol·licitud de creació d'un espai perquè no complia la política de l'empresa. <br><br/>Qualsevol cosa, posa't amb contacte amb nosaltres <br/><br/> Moltes gràcies, equip getKeepers </p>
            `
        }
        await sendEmail(mailData)
        const dir = `spaceImages/${placeRemoved.id}/`
        await emptyS3Directory(process.env.AWS_BUCKET_NAME, dir);
        const places = await Place.find({ 'active': false })
        return res.render("./admin/admin", { 'places': places, 'activated': true, 'msg': "Has eliminat la sol·licitud d'espai correctament" })

    } catch (error) {
        const places = await Place.find({ 'active': false })
        return res.render("./admin/admin", { 'places': places, 'error': error })
    }
}

module.exports = { getAdmin, postActivate, postEliminate }