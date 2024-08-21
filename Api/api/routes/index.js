const express = require('express');
const router = express.Router();

const model = require("../models/models");

const podatki = require('../controllers/podatki')
const urnik = require('../controllers/urnik')

const noviUrnik = require('../controllers/noviUrnik');
const notifica = require('../controllers/sporocila')

const auth = require('../controllers/avtentikacija')


require('../controllers/db')

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client();

const setRateLimit = require("express-rate-limit");

// Rate limit middleware
const rateLimitMiddleware = setRateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: "Poskusite znova čec eno minuto",
  headers: true,
});


router.get("/avtentikacija",  auth.auth, (req, res) => {
  res.send({sporocilo: true})
})



// GET
router.get('/profesorji', podatki.vsiProfesorji);
router.get('/razredi', podatki.vsiRazredi);
router.get('/ure', podatki.ure)
router.get('/user', podatki.user)
router.get('/urnik', urnik.vrniDatumUrnik)
router.get('/shranjen-urnik', urnik.provaTeden)
router.get('/zadnja-sprememba', urnik.zadnjaSprememba)

// PUT

router.put('/shrani', urnik.shrani)
router.put('/potrdi', urnik.potrdi)

// POST

router.post('/notifica', auth.auth, notifica.notifica)
router.post('/poglej', auth.auth, notifica.poglej)
router.post('/poglejRazred', auth.auth, notifica.poglejRazred)
router.post('/admin', rateLimitMiddleware, auth.dodajAdmina)
router.post("/urnik", auth.auth, noviUrnik.provaUrnik)
router.post('/mail', auth.auth, noviUrnik.vnesiMail)
router.post('/mail-poslji/:dan/:kdo/:podatki', express.raw({limit: "50mb", type: "*/*"}), auth.auth, podatki.posljiMail)





module.exports = router;