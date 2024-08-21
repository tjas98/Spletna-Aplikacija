const model = require("../models/models");
require('dotenv').config();

const Profesorji = model.Profesorji;
const UrnikPredmeti = model.UrnikPredmeti
const UrnikZaProfesorja = model.UrnikZaProfesorja;

var celodnevneDejavnosti = (req, res) => {
    var { dnevi, razredi, profesorji, dejavnost } = req.body

    if (!razredi) razredi = [];
    if (!profesorji) profesorji = [];

    var a = UrnikPredmeti.find({})
    var b = Profesorji.find({})
    var c = UrnikZaProfesorja.find({});

    Promise.all([a, b, c]).then((r) => {

        for (var i in r[1]) {
            var razred = r[1][i].razred
            var ii = r[0].map(e => e.razred).indexOf(razred);

            for (var j in dnevi) {
                var dan = dnevi[j].toLowerCase();
                if (razredi.includes(razred)) {
                    r[1][i][dan].forEach((el, index) => r[1][i][dan][index] = dejavnost)
                    r[0][ii][dan].forEach((el, index) => r[0][ii][dan][index] = dejavnost)
                }
                r[1][i][dan].forEach((profesor, index) => {
                    if (profesor.includes(',')) {
                        var vecProf = profesor.split(',')
                        for (var k in vecProf) {
                            if (profesorji.includes(vecProf[k])) {
                                var a = r[1][i][dan][index].replace(vecProf[k], "")
                                a = a.replace(",", "")
                                a = a.trim()
                                r[1][i][dan][index] = a;
                            }
                        }
                    } else {
                        if (profesorji.includes(profesor) && !razredi.includes(razred)) {
                            r[1][i][dan][index] = "Prosto"
                            r[0][ii][dan][index] = "Prosto"
                        }
                    }
                })
            }
            r[1][i].save()
            r[0][ii].save()
        }

        // Profesorji
        for (var i in r[2]) {
            var profesor = r[2][i].profesor
            for (var j in dnevi) {
                var dan = dnevi[j].toLowerCase();
                r[2][i][dan].forEach((razred, index) => {
                    if (razredi.includes(razred) && !profesorji.includes(profesor)) {
                        r[2][i][dan][index] = "Prosto"
                    }
                })
            }
            r[2][i].save()
        }
    }).finally(() => { res.send({ odgovor: "Uspešno spremenjeno", status: "success" }) })
}

var dejavnost = (req, res) => {
    var dan = req.body.dan.toLowerCase();
    var razredi = req.body.razredi;
    var profesorji = req.body.profesorji;
    var dejavnost = req.body.dejavnost;
    var ure = [];
    ure = req.body.ure;

    if (!razredi) razredi = [];
    if (!profesorji) profesorji = [];


    var a = UrnikPredmeti.find({razred: razredi});
    var b = Profesorji.find({razred: razredi});
    var c = UrnikZaProfesorja.find({profesor: profesorji});

    var s1 = UrnikPredmeti.find({});
    var s2 = Profesorji.find({});
    var s3 = UrnikZaProfesorja.find({});

    Promise.all([a,b,c]).then(r => {
        r[0].forEach(function(s) {
            for (var i = 0; i < s[dan].length; i++) if (ure.includes(i+1)) s[dan][i] = dejavnost;
            s.save()
        })

        r[1].forEach(function(s) {
            for (var i = 0; i < s[dan].length; i++) if (ure.includes(i+1)) s[dan][i] = dejavnost;
            s.save()
        })

        r[2].forEach(function(s) {
            for (var i = 0; i < s[dan].length; i++) if (ure.includes(i+1)) s[dan][i] = dejavnost;
            s.save()
        })
    })

    Promise.all([s1,s2, s3]).then((r) => {
        for (var i = 0; i < r[0].length; i++) {
            for (var j = 0; j < r[0][i][dan].length; j++) {
                if (ure.includes(j+1) && profesorji.includes(r[1][i][dan][j]) && !razredi.includes(r[0][i].razred)) {
                    r[0][i][dan][j] = 'Prosto';
                    r[1][i][dan][j] = 'Prosto';
                }
            }
            r[0][i].save();
            r[1][i].save();
        }

        for (var i = 0; i < r[2].length; i++) {
            for (var j = 0; j < r[2][i][dan].length; j++) {
                if (r[2][i][dan][j] != 'Prosto') {
                    var raz = r[2][i][dan][j].split(':')[0].toUpperCase();
                    if (ure.includes(j+1) && razredi.includes(raz) && !profesorji.includes(r[2][i].profesor)) {
                        r[2][i][dan][j] = 'Prosto';
                    }
                }
            }
            r[2][i].save();
        }
        res.send({a: "OK"});
    })
}

module.exports = {
    celodnevneDejavnosti,
    dejavnost
}