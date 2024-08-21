const model = require("../models/models");

const TedenZaProfesorja = model.TedenZaProfesorja;
const TedenPredmeti = model.TedenPredmeti;
const StalenZaProfesorja = model.StalenZaProfesorja;
const Profesorji = model.Profesorji;
const UrnikPredmeti = model.UrnikPredmeti
const UrnikZaProfesorja = model.UrnikZaProfesorja;

const Placilo = model.Placal
const Admin = model.Admin;

// Vsi profesorji
var vsiProfesorji = (req, res) => {
    StalenZaProfesorja.find({}).select({ "profesor": 1, "_id": 0}).then((r) => {
        res.send(r)
    });
}

// Vsi razredi
var vsiRazredi = (req, res) => {

    UrnikPredmeti.find({}).select({"razred": 1, "_id": 0}).then((r) => {
        res.send(r)
    });
}

// Urnik vseh razredov
var urnikVsehRazredov = (req, res) => {
    var a = UrnikPredmeti.find({}).select({'_id': 0}).sort({razred: 1});
    var b = Profesorji.find({}).select({'_id': 0}).sort({razred: 1});
    var c = UrnikZaProfesorja.find({}).select({'_id': 0}).sort({profesor: 1});

    var obj = {
        predmeti: Array,
        profesorji: Array,
        urnikZaProf: Array
    } 

    Promise.all([a,b,c]).then((r) => {
        obj.predmeti = r[0];
        obj.profesorji = r[1];
        obj.urnikZaProf = r[2];
        res.send(obj);
    })
}

// Pridobi ure
var ure = (req, res) => {
    model.PodatkiUrnika.find({}).then(r => {
        if (r[0] != undefined) {
            res.send(r[0])
        } else {
            res.send({ure: false})
        }
    })
}

var stalenUrnik = (req, res) => {
    var a = StalenPredmeti.find({}).select({'_id': 0});
    var b = StalenProfesorji.find({}).select({'_id': 0});
    var c = StalenZaProfesorja.find({}).select({'_id': 0});

    var obj = {
        predmeti: Array,
        profesorji: Array,
        urnikZaProf: Array
    } 

    Promise.all([a,b,c]).then(r => {
        obj.predmeti = r[0];
        obj.profesorji = r[1];
        obj.urnikZaProf = r[2];
        res.send(obj)
    })
}

var stalenStalenUrnik = (req, res) => {
    var a = model.StalenStalenDijaki.find({}).select({'_id': 0});
    var b = model.StalenStalenProfeosorji.find({}).select({'_id': 0});
    var c = model.StalenStalenZaProfesorja.find({}).select({'_id': 0});

    var obj = {
        predmeti: Array,
        profesorji: Array,
        urnikZaProf: Array
    } 

    Promise.all([a,b,c]).then(r => {
        obj.predmeti = r[0];
        obj.profesorji = r[1];
        obj.urnikZaProf = r[2];
        res.send(obj)
    })
}

var placilo = (req, res) => {
    
    var mail = req.params.mail;
    console.log(mail)
    Placilo.findOne({mail: mail}).then((r) => {
        if (r) {
           
            res.send(true)
        } else {
            res.send(false)
        }
    })
    
}

var jePlacal = (req, res) => {
    var mail = req.body.mail
    var name = req.body.name

    var placilec = new Placilo({
        mail: mail,
        name: name
    })

    placilec.save()
    res.send({odgovor: "Placal"})
}

var admin = (req, res) => {
    var mail = req.params.mail;
    console.log(mail)
    Admin.findOne({mail: mail}).then(r => {
        console.log(r)
        if (r) {
            res.send(true)
        } else {
            res.send(false)
        }
    })
}

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_GOOGLE,
        pass: process.env.GOOGLE
    }
})


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


var pridobiMaile = (req, res) => {
    var profesorji = req.query.profesorji;
    var razredi = req.query.razredi;
    var mails = "";

    model.Mail.find({}).select({'profesor': 1, 'mail': 1, '_id': 0}).then((rez) => {
        
        
        res.send({mails: rez})
    })

    /*

    if (razredi != undefined) {
        razredi = razredi.split(',')
        for (var i = 0; i < razredi.length; i++) {
            razredi[i] = razredi[i].toLowerCase() + "@preseren.edu.it"
            mails += razredi[i] + ','
        }
        mails = mails.slice(0,-1) 
        res.send({mails: mails})
    }
    
    if (profesorji != undefined) {
        profesorji = profesorji.split(',')
        Mail.find({profesor: profesorji}).then((rez) => {
            rez.forEach(function(r) {
                mails += r.mail + ','
            })
            mails = mails.slice(0,-1) 
            res.send({mails: mails})
        })
    }
   */
}


module.exports = {
    urnikVsehRazredov,
    stalenUrnik,
    vsiProfesorji,
    vsiRazredi,
    ure,
    stalenStalenUrnik,
    placilo,
    jePlacal,
    admin,
    posljiMail,
    pridobiMaile
}