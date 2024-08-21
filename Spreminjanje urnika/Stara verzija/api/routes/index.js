const express = require('express');
const router = express.Router();

const model = require("../models/models");
const spremembe = require('../controllers/spremembe')
const podatki = require('../controllers/podatki')
const urnik = require('../controllers/urniki')
const izleti = require('../controllers/izleti')
const noviUrnik = require('../controllers/noviUrnik');


require('../controllers/db')

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client();

const avtentikacija = (req, res, next) => {

    var idClient = process.env.ID_CLIENT
    var email = req.headers.authorization

    model.Admin.findOne({ mail: email }).then(r => {
        if (r) next()
        else res.send({sporocilo: false})
    })

    /*

    client.verifyIdToken({
        idToken: token,
        audience: idClient,
    }).then(ticket => {
        const payload = ticket.getPayload();
        const email = payload.email;
        model.Admin.findOne({ mail: email }).then(r => {
            if (r) next()
            else res.send({sporocilo: false})
        })
    })
    */
}


router.get('/prova-user',  (req, res) => {
    var idClient = process.env.ID_CLIENT
    var token = req.query.token

    client.verifyIdToken({
        idToken: token,
        audience: idClient,
    }).then(ticket => {
        console.log(ticket)
        const payload = ticket.getPayload();
        const email = payload.email;
        model.Admin.findOne({ mail: email }).then(r => {
            if (r) res.send({sporocilo: true})
            else res.send({sporocilo: false})
        })
    })
    
})




// GET
router.get('/vsi-profesorji', podatki.vsiProfesorji);
router.get('/vsi-razredi', podatki.vsiRazredi);
router.get('/ure', podatki.ure)
router.get('/vrni-urnik', urnik.vrniIzbranUrnik)
router.get('/urnik-vseh', podatki.urnikVsehRazredov);

router.get('/urnik-datum', urnik.provaTeden)
router.get('/urnik-shranjen', urnik.vrniDatumUrnik)

router.get('/maili', podatki.pridobiMaile)

 

router.get('/uporabi-urnik-datum', urnik.uporabljajShranjen)


router.get('/urnik-stalen', urnik.uporabljajStalen)

// PUT

router.put('/shrani', urnik.shrani)
router.put('/potrdi', urnik.potrdi)

//router.put('/urejanje-ure', avtentikacija, noviUrnik.urediUre)
//router.put('/potrdi-prosto', avtentikacija, spremembe.potrdiProsto);
//router.put('/izbrisi', avtentikacija, spremembe.izbrisiSpremembo);
//router.put('/urnik-datum', urnik.provaDatum)

// Podatki


router.post("/novi-urnik", avtentikacija, noviUrnik.provaUrnik)
router.post('/mail-novi', avtentikacija, noviUrnik.vnesiMail)

// Urniki



// Spremembe
router.put('/prosto', avtentikacija, spremembe.prostaUra)
router.put('/sprememba-prosto', avtentikacija, spremembe.spremembaProsto);
router.put('/sprememba', avtentikacija, spremembe.novaSprememba);


router.put('/odsoten', avtentikacija, spremembe.odsoten);
router.put('/zamenjava-ure', avtentikacija, spremembe.zamenjavaDvehUr);
router.put("/profesor-odstrani", avtentikacija, spremembe.odstraniProfesorja);



router.put('/auto', avtentikacija, spremembe.auto)


// Izleti
router.put('/dejavnost-celodnevna', avtentikacija, izleti.celodnevneDejavnosti);
router.put('/dejavnost', avtentikacija, izleti.dejavnost);



// Placilo
router.get("/placilo/:mail", podatki.placilo)
router.post("/jePlacal", podatki.jePlacal)


router.get("/admin/:mail", podatki.admin)

router.post('/posljiMail/:dan/:kdo/:podatki', express.raw({limit: "50mb", type: "*/*"}), podatki.posljiMail)

router.get('/not', (req, res) => {
    Notification.requestPermission().then(perm => {
        alert(perm)
    })
})



router.get('/kdoRabi/:profesor', (req, res) => {
    var profesor = req.params.profesor;
    model.KdoRabi.findOne({profesor: profesor}).then(r => {
        if (r == null) {
            var a = new model.KdoRabi();
            a.profesor =  profesor
            a.save();
        }
        res.send({a: "OK"})
    })
})

const notifica = require('../controllers/notifica')
router.post('/notifica', notifica.notifica)
router.post('/poglej', notifica.poglej)
router.post('/poglejRazred', notifica.poglejRazred)




module.exports = router;