const model = require("../models/models");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_GOOGLE,
        pass: process.env.GOOGLE
    }
})


var vsiProfesorji = (req, res) => {
    
    model.Profesor.find({}).sort('ime').select({ "ime": 1, "mail": 1, "_id": 0}).then(r => {
        try {
            res.status(200).send({sporocilo: "Uspešno vrnjeni profesorji", podatki: r})
        } catch {
            res.status(500).send({sporocilo: "Prišlo je do napake"})
        }
       
    })
    
}

const vsiRazredi = (req, res) => {

    model.Razred.find({}).sort('razred').select({ "razred": 1, "_id": 0}).then(r => {
        try {
            res.status(200).send({sporocilo: "Uspešno vrnjeni razredi", podatki: r})
        } catch {
            res.status(500).send({sporocilo: "Prišlo je do napake"})
        }
       
    })
}

const ure = (req, res) => {
    model.PodatkiUrnika.find({}).then(r => {
        if (r[0] != undefined) {
            res.send(r[0])
        } else {
            res.send({ure: false})
        }
    })
}

var posljiMail = (req, res) => {
    
    var mailRazredi = []
    var mailProfesorji = []

    var podatki = req.params.podatki.split(','); 
    var kdo = req.params.kdo;
    var dan = najdiDan(req.params.dan.toLowerCase());

    function najdiDan(x) {
        if (x == 'pon') return "ponedeljek"
        if (x == 'tor') return "torek"
        if (x == 'sre') return "sredo"
        if (x == 'cet') return "četrtek"
        if (x == 'pet') return "petek"
    }
    
    const buffer = req.body

    var text = "Pozdravljeni. \nV priponki pošiljamo spremembo urnika za " + dan + 
    ".\nLp\n\nTo sporočilo je bilo avtomatično poslano." 
     
    
    if (kdo == 1) {
        model.Mail.find({profesor: podatki}).then(r => {
            r.forEach((x) => {
                mailProfesorji.push(x.mail)
            })
        }).then(() => {
            const mailOptions = {
                from: process.env.MAIL_GOOGLE,
                text: text,
                to: mailProfesorji,
                subject: "Sprememba urnika za " +  dan,
                attachments: [{
                    filename: 'Urnik.pdf',
                    content: buffer,
                }]
            }
    
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) res.send({odgovor: "Prišlo je do napake", status: "error"})
                else res.send({odgovor: "Uspešno poslana mail", status: "success"})
                    
            })
            
            
        })
    } else {
        for (var i in podatki) {
            var text = podatki[i] + "@preseren.edu.it"
            mailRazredi.push(text)
        }
       
        const mailOptions = {
            from: process.env.MAIL_GOOGLE,
            text: text,
            to: mailRazredi,
            subject: "Sprememba urnika za " +  dan,
            attachments: [{
                filename: 'Urnik.pdf',
                content: buffer,
            }]
        }

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) res.send({odgovor: "Prišlo je do napake", status: "error"})
            else res.send({odgovor: "Uspešno poslana mail", status: "success"})
        })
        
    }

    
}

var user = (req, res) => {
    var mail = req.query.mail
    model.Profesor.findOne({mail: mail}).then(r => {
        if (r) {
            res.send({sporocilo: "Uspešno vrnjen profesor", ime: r.ime})
        } else {
            res.send({sporocilo: "Profesorja ni v podatkovni zbirki"})
        }
        
    })
}


module.exports = {
    vsiProfesorji,
    vsiRazredi,
    ure,
    posljiMail,
    user
}