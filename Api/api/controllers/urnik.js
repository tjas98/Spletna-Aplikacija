const { default: mongoose } = require("mongoose");
const model = require("../models/models");
const { strict } = require("assert");
require('dotenv').config();

const provaTeden = (req, res) => {
    var datum = req.query.teden;

    var a = model.Datum.findOne({ datum: datum })
    var b = model.Potrjen.findOne({ datum: datum })

    Promise.all([a, b]).then(r => {

        console.log(r[0])
        var sh = true;
        var po = true;

        if (!r[0]) sh = false;
        if (!r[1]) po = false;

        if (!sh) res.send({ odgovor: "Za teden " + datum + " ni shranjenega urnika", status: "warn" })
        else res.send({ odgovor: "Urnik za teden " + datum + " je že shranjen", status: "success", shranjen: r[0], potrjen: r[1], sh: sh, po: po })
    })


}


const vrniDatumUrnik = (req, res) => {
    var urnik = req.query.urnik;
    var teden = req.query.teden;

    console.log(urnik, teden)

    if (urnik == 0) {
        model.Datum.findOne({ datum: teden }).then(r => {

            if (r == null) res.send({ odgovor: "Urnik za ta teden ni še objavljen", status: "error" })
            else res.send({ odgovor: "Uspešno vrnjen urnik", urnik: r, status: "success", tip: "Shranjen" })

        })
    }
    else if (urnik == 1) {
        model.Potrjen.findOne({ datum: teden }).then(r => {

            if (r == null) res.send({ odgovor: "Urnik za ta teden ni še objavljen", status: "error" })
            else res.send({ odgovor: "Uspešno vrnjen urnik", urnik: r, status: "success", tip: "Potrjen" })

        })
    } else {
        model.Stalen.find({}).then(r => {

            if (r.length < 1) res.send({ odgovor: "Urnik ne obstaja", status: "error" })
            else res.send({ odgovor: "Uspešno vrnjen urnik", urnik: r[0], status: "success", tip: "Stalen" })

        })
    }
}

const shrani = (req, res) => {

    var urnik = req.body.urnik
    var datum = req.body.datum

    try {
        model.Datum.findOne({ datum: datum }).then(r => {
            if (r) {
                r.predmeti = urnik.predmeti
                r.profesorji = urnik.profesorji
                r.urnikZaProf = urnik.urnikZaProf

                r.save()
            } else {
                var d = new model.Datum()
                d.predmeti = urnik.predmeti
                d.profesorji = urnik.profesorji
                d.urnikZaProf = urnik.urnikZaProf
                d.datum = datum
                d.save()
            }
        })


        res.send({ odgovor: "Uspešno shranjen urnik v podatkovno zbirko", status: "success" })
    } catch {
        res.send({ odgovor: "Prišlo je do napake", status: "error" })
    }


}

const potrdi = (req, res) => {

    var urnik = req.body.urnik
    var datum = req.body.datum

    var now = new Date()
    console.log(now.toString())

    try {
        model.Potrjen.findOne({ datum: datum }).then(r => {
            if (r) {
                r.predmeti = urnik.predmeti
                r.profesorji = urnik.profesorji
                r.urnikZaProf = urnik.urnikZaProf
                r.zadnjaSprememba = now.toString()
                r.save()
            } else {
                var d = new model.Potrjen()
                d.predmeti = urnik.predmeti
                d.profesorji = urnik.profesorji
                d.urnikZaProf = urnik.urnikZaProf
                d.zadnjaSprememba = now.toString()
                d.datum = datum
                d.save()
            }
        })


        res.send({ odgovor: "Uspešno potrjen ter shranjen urnik", status: "success" })
    } catch {
        res.send({ odgovor: "Prišlo je do napake", status: "error" })
    }


}

const zadnjaSprememba = (req, res) => {
    var teden = req.query.teden
    model.Potrjen.findOne({ datum: teden }).then(r => {

        if (r) res.send({ status: true, zadnja: r.zadnjaSprememba })
        else res.send({ status: false })
    })
}

module.exports = {
    provaTeden,
    vrniDatumUrnik,
    shrani,
    potrdi,
    zadnjaSprememba
}