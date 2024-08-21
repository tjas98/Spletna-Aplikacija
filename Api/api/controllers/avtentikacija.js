const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client();
const model = require('../models/models')

const Admin = model.Admin


const auth = (req, res, next) => {

    var token = req.headers.authorization

    if (!token) {
        res.status(401).send({ sporocilo: "Ni avtorizacije" })
        return;
    }

    token = token.replace('Bearer ', '');


    client.verifyIdToken({
        idToken: token,
        audience: process.env.ID_CLIENT,
    }).catch(r => {
        console.log(r)
        res.send({ status: "error", odgovor: "Prišlo je do napake. Prosim prijavise ponovno" })
    }).then(ticket => {
        if (ticket) {
            const payload = ticket.getPayload();
            const email = payload.email;
            Admin.findOne({ mail: email }).then(r => {
                if (r) next()
                else res.send({ sporocilo: false })
            })

        }
    })

}

var dodajAdmina = (req, res) => {
    var mail = req.body.mail;
    var password = req.body.password;

    if (password != process.env.PASSWORD) res.send({ sporocilo: "Geslo ni pravilo" })
    else {
        var admin = new model.Admin()
        admin.mail = mail
        admin.save()
        res.send({ sporocilo: "Uspešno dodan administrator" })
    }

}

module.exports = {
    auth,
    dodajAdmina
};