
const model = require("../models/models");
const { vsiRazredi } = require("./podatki");
require('dotenv').config();





const Podatki = model.PodatkiUrnika;
const Razred = model.Razred
const Profesor = model.Profesor


function shraniProfesorje(urnik) {

    const urnikProfesorja = urnik.urnikProfesorja;

    console.log(urnikProfesorja)

    Profesor.deleteMany({}).then(() => {
        urnikProfesorja.forEach(ur => {
            var profesor = new Profesor()
            profesor.ime = ur.profesor
            profesor.save()
        })
    })

}

function shraniRazrede(urnik) {

    const urnikRazreda = urnik.urnikRazredaPredmeti;

    Razred.deleteMany({}).then(() => {
        urnikRazreda.forEach(ur => {
            var razred = new Razred()
            razred.razred = ur.razred;
            razred.save()
        })
    })
}

var provaUrnik = (req, res) => {


    const { urnik, tip, teden } = req.body;

    if (!urnik || !tip) return res.status(500).send({ sporocilo: "Prišlo je do napake" })

    const vrni = () => res.status(201).send({ odgovor: "Uspešno shranjen urnik", status: "success" });

    try {
        if (tip == 'stalen') {
            model.Stalen.deleteMany().then(() => shraniVZbirko(tip, urnik, "").then(() => vrni()))
            shraniProfesorje(urnik)
            shraniRazrede(urnik)
        } else {
            if (tip == 'teden') model.Datum.deleteOne({ datum: teden }).then(() => shraniVZbirko(tip, urnik, teden)).then(() => vrni())
            if (tip == 'potrjen') model.Potrjen.deleteOne({ datum: teden }).then(() => shraniVZbirko(tip, urnik, teden)).then(() => vrni())
        }


    } catch (error) {
        console.log(error)
        res.send({ odgovor: "Prišlo je do napake. Preglej Excel file", status: "error" })
    }

    async function shraniVZbirko(tip, urnik, teden) {
        if (tip == 'teden') var u = new model.Datum()
        if (tip == 'potrjen') var u = new model.Potrjen()
        if (tip == 'stalen') var u = new model.Stalen()

        const urnikRazreda = urnik.urnikRazredaPredmeti;
        const urnikRazredaProfesorji = urnik.urnikRazredaProfesorji;
        const urnikProfesorja = urnik.urnikProfesorja;

        u.urnikZaProf = urnikProfesorja;
        u.profesorji = urnikRazredaProfesorji;
        u.predmeti = urnikRazreda;
        if (tip == 'potrjen') {
            var now = new Date()
            u.zadnjaSprememba = now.toString()
        }
        if (tip != 'stalen') u.datum = teden;
        u.save();


    }




}

var vnesiMail = (req, res) => {

    try {
        var mails = req.body.mails;
        maili().then(() => {
            res.send({ odgovor: "Uspešno shranjeni maili", status: 'success' })
        })

        function maili() {
            return new Promise(resolve => {
                mails.forEach(r => {
                    var ime = r[0]
                    var mail = r[1]
                    Profesor.findOne({ ime: ime }).then(profesor => {
                        if (profesor) {
                            profesor.mail = mail
                            profesor.save()
                        } else {
                            var prof = new Profesor()
                            prof.ime = ime
                            prof.mail = mail
                            prof.save()

                        }
                    })
                })

                resolve();
            })
        }
    } catch {
        res.send({ odgovor: "Prišlo je do napake", status: 'error' })
    }




}

var urediUre = (req, res) => {

    var odmor = req.body.odmor;
    var zacetek = req.body.zacetek;
    var konec = req.body.konec;
    var steviloUr = req.body.steviloUr;

    const podatek = new Podatki();

    Podatki.find({}).then((r) => {
        if (r) {
            if (odmor) {
                r[0].zacetekOdmor = zacetek;
                r[0].konecOdmor = konec;
                r[0].steviloOdmorov = steviloUr;
                r[0].save()
            } else {
                r[0].zacetekUre = zacetek;
                r[0].konecUre = konec;
                r[0].stUr = steviloUr;
                r[0].save()
            }
        } else {
            if (odmor) {
                podatek.zacetekOdmor = zacetek;
                podatek.konecOdmor = konec;
                podatek.steviloOdmorov = steviloUr;
                podatek.save()
            } else {
                podatek.zacetekUra = zacetek;
                podatek.konecUra = konec;
                podatek.stUr = steviloUr;
                podatek.save()
            }
        }
    })

    res.send({ odgovor: "Shranjeno" })


}

module.exports = {
    vnesiMail,
    provaUrnik,
    urediUre
}