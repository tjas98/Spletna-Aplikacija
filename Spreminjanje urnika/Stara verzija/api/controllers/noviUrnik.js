
const model = require("../models/models");
const { vsiRazredi } = require("./podatki");
require('dotenv').config();



const Profesorji = model.Profesorji;
const UrnikPredmeti = model.UrnikPredmeti
const UrnikZaProfesorja = model.UrnikZaProfesorja;

const Podatki = model.PodatkiUrnika;

const StalenPredmeti = model.StalenPredmeti
const StalenProfesorji = model.StalenProfesorji
const StalenZaProfesorja = model.StalenZaProfesorja

const Mail = model.Mail

var provaUrnik = (req, res) => {
    
    try {

        var { urnik, urnik2, kateri, teden } = req.body;

        var ure = [], razredi = [], profesorji = [];
        

        for (var i = 1; i < urnik[1].length; i++) {
            if (urnik[1][i] == null) break
            ure.push(urnik[1][i])
        }

        var steviloUr = ure.length;

        if (kateri == 'stalen') {
            Podatki.find({}).then(r => {
                if (r) {
                    r[0].stUr = ure.length;
                    r[0].ure = ure;
                    r[0].save()
                } else {
                    var p = new Podatki();
                    p.stUr = ure.length;
                    p.ure = ure;
                    p.save()
                }
            })
        }


        function odpraviSumnike(text) {
            const chars = { 'č': 'c', 'ž': 'z', 'š': 's', 'Č': 'C', 'Š': 'S', 'Ž': 'Z' };
            text = text.replace(/[čšžČŠŽ]/g, m => chars[m])
            return text
        }

        for (var i = 2; i < urnik.length; i++) {
            var profesor = urnik[i][0]
            if (profesor != undefined) profesorji.push(odpraviSumnike(profesor))
        }

        for (var i = 0; i < urnik2.length; i++) {
            var x = urnik2[i][0];
            if (x != null && x != "RAZRED" && x != undefined && x != "RAZ") razredi.push(x.toUpperCase())
        }

        var urnikProfesorji = [];

        for (var i in profesorji) {
            var profesor = profesorji[i];
            urnikProfesorji[profesor] = {
                pon: Array(steviloUr).fill("Prosto"),
                tor: Array(steviloUr).fill("Prosto"),
                sre: Array(steviloUr).fill("Prosto"),
                cet: Array(steviloUr).fill("Prosto"),
                pet: Array(steviloUr).fill("Prosto")
            }
        }

        var urnikDijaki = []

        for (var i in razredi) {
            var razred = razredi[i];
            urnikDijaki[razred] = {
                pon: Array(steviloUr).fill(""),
                tor: Array(steviloUr).fill(""),
                sre: Array(steviloUr).fill(""),
                cet: Array(steviloUr).fill(""),
                pet: Array(steviloUr).fill("")
            }
        }

        var dnevi = ["pon", "tor", "sre", "cet", "pet"]

        // Shrani urnik razredov

        for (var i = 2; i < urnik2.length; i++) {
            var razred = urnik2[i][0]
            if (razred == undefined) break
            razred = razred.toUpperCase()

            var indexDan = 0

            for (var j = 0; j < urnik[i].length; j += (steviloUr + 2)) {
                var dan = dnevi[indexDan]
                var tabela = urnik2[i].slice(j, j + (steviloUr + 2))
                tabela.shift()

                tabela.forEach((ura, index) => {
                    if (ura != null) urnikDijaki[razred][dan][index] = ura.trim()
                })
                indexDan += 1;
            }
        }

        // Shrani urnik profesorjev

        function preglejCeProst(x) {
            if (x == "" || x == " ") return "Prosto"
            else return x
        }

        for (var i = 2; i < urnik.length; i++) {
            var a = []
            var profesor = odpraviSumnike(urnik[i][0])

            if (profesor == undefined) break
            var indexDan = 0

            for (var j = 0; j < urnik[i].length; j += (steviloUr + 2)) {
                var dan = dnevi[indexDan]
                var tab = urnik[i].slice(j, j + (steviloUr + 2))
                tab.shift()
                //tab.pop()

                tab.forEach((ura, index) => {
                    if (ura != null) urnikProfesorji[profesor][dan][index] = (ura == "" || ura == " " || ura == null) ? "Prosto" : ura.trim()
                })
                indexDan += 1;
            }
        }

        // ---------------------------------

        var urnikRazrediProfesorji = [];

        for (var i = 0; i < razredi.length; i++) {
            var razred = razredi[i].toUpperCase();

            urnikRazrediProfesorji[razred] = {
                pon: Array(steviloUr).fill(""),
                tor: Array(steviloUr).fill(""),
                sre: Array(steviloUr).fill(""),
                cet: Array(steviloUr).fill(""),
                pet: Array(steviloUr).fill("")
            }
        }

        profesorji.forEach((profesor, index) => {
            var urnik = urnikProfesorji[profesor]

            for (var j = 0; j < steviloUr; j++) {
                dnevi.forEach((dan) => {
                    var razred = urnik[dan][j].toUpperCase()
                    if (razredi.some(a => razred.includes(a))) {
                        if (razred.includes(",") || razred.includes("-")) {
                            var x = razred.split(",")

                            for (var i in x) {
                                x[i] = x[i].replace(/ /g, '')
                                urnikRazrediProfesorji[x[i]][dan][j] = profesor;
                            }

                        } else {
                            razred = razred.replace("*", "");
                            if (razredi.includes(razred)) {
                                //if (dan == "pet") console.log(profesor, razred)
                                var ura = urnikRazrediProfesorji[razred][dan][j]
                                if (ura.length > 1) urnikRazrediProfesorji[razred][dan][j] += "," + profesor
                                else urnikRazrediProfesorji[razred][dan][j] = profesor
                            }

                        }
                    }
                })
            }
        })

        model.Datum.remove({datum: teden}).then(() => {
           
            var tab1 = [], tab2 = [], tab3 = []
    
            if (kateri == 'teden' || kateri == 'potrjen') {
                profesorji.forEach((profesor) => {
                    var ob1 = {}
                    dnevi.forEach(dan => {
                        ob1[dan] = urnikProfesorji[profesor][dan]
                    })
                    ob1.profesor = profesor
                    tab1.push(ob1)
                })
        
                razredi.forEach(razred => {
                    var ob2 = {}, ob3 = {}
                    dnevi.forEach(dan => {
                        ob2[dan] = urnikRazrediProfesorji[razred][dan]
                        ob3[dan] = urnikDijaki[razred][dan]
                    })
                    ob2.razred = razred
                    ob3.razred = razred
                    tab2.push(ob2)
                    tab3.push(ob3)
                    
                })
                
                if (kateri == 'teden') var u = new model.Datum()
                if (kateri == 'potrjen') var u = new model.Potrjen()
                
                u.urnikZaProf = tab1;
                u.profesorji = tab2;
                u.predmeti = tab3
                u.datum = teden;
                u.save();
            }
        })
        
        var a1 = UrnikPredmeti.find({}).sort({razred: 1})
        var a2 = Profesorji.find({}).sort({razred: 1})
        var a3 = UrnikZaProfesorja.find({}).sort({profesor: 1})

        var st1 = StalenPredmeti.find({}).sort({razred: 1})
        var st2 = StalenProfesorji.find({}).sort({razred: 1})
        var st3 = StalenZaProfesorja.find({}).sort({profesor: 1})

        console.log(razredi)

        function shraniRazred(x, razred, urnik) {
            dnevi.forEach(dan => {x[dan] = urnik[razred][dan]})
            x.save()
        }

        function ustvariRazred(x, razred, urnik) {
            x.razred = razred;
            dnevi.forEach(dan => {x[dan] = urnik[razred][dan]})
            x.save();
        }   

        function shraniProfesorja(x, profesor, urnik) {
            dnevi.forEach(dan => {x[dan] = urnik[profesor][dan]})
            x.save()
        }

        function ustvariProfesorja(x, profesor, urnik) {
            x.profesor = profesor;
            dnevi.forEach(dan => {x[dan] = urnik[profesor][dan]})
            x.save();
        }   

        Promise.all([a1, a2, a3, st1, st2, st3]).then(r => {

            r[0].forEach(x => { if (!razredi.includes(x.razred)) x.remove() })
            r[1].forEach(x => { if (!razredi.includes(x.razred)) x.remove() })
            r[2].forEach(x => { if (!profesorji.includes(x.profesor)) x.remove() })

            if (kateri == 'stalen') {
                r[3].forEach(x => { if (!razredi.includes(x.razred)) x.remove() })
                r[4].forEach(x => { if (!razredi.includes(x.razred)) x.remove() })
                r[5].forEach(x => { if (!profesorji.includes(x.profesor)) x.remove() })
            }

            razredi.forEach(razred => {
                var i = r[0].map(e => e.razred).indexOf(razred);
                if (i > -1) shraniRazred(r[0][i], razred, urnikDijaki)
                else {
                    var novi = new UrnikPredmeti()
                    ustvariRazred(novi, razred, urnikDijaki)
                }

                var j = r[1].map(e => e.razred).indexOf(razred);
                if (j > -1) shraniRazred(r[1][j], razred, urnikRazrediProfesorji)
                else {
                    var novi = new Profesorji()
                    ustvariRazred(novi, razred, urnikRazrediProfesorji)
                }

                if (kateri == 'stalen') {
                    var i = r[3].map(e => e.razred).indexOf(razred);
                    if (i > -1) shraniRazred(r[3][i], razred, urnikDijaki)
                    else {
                        var novi = new StalenDijaki()
                        ustvariRazred(novi, razred, urnikDijaki)
                    }

                    var j = r[4].map(e => e.razred).indexOf(razred);
                    if (j > -1) shraniRazred(r[4][j], razred, urnikRazrediProfesorji)
                    else {
                        var novi = new StalenProfesorji()
                        ustvariRazred(novi, razred, urnikRazrediProfesorji)
                    }
                }
            })

            profesorji.forEach(profesor => {
                var i = r[2].map(e => e.profesor).indexOf(profesor);
                if (i > -1) shraniProfesorja(r[2][i], profesor, urnikProfesorji)
                else {
                    var novi = new UrnikZaProfesorja()
                    ustvariProfesorja(novi, profesor, urnikProfesorji)
                }

                if (kateri == 'stalen') {
                    var i = r[5].map(e => e.profesor).indexOf(profesor);
                    if (i > -1) shraniProfesorja(r[5][i], profesor, urnikProfesorji)
                    else {
                        var novi = new StalenZaProfesorja()
                        ustvariProfesorja(novi, profesor, urnikProfesorji)
                    }
                }
            })

        }).finally(() => {
            setTimeout(() => {
                res.send({odgovor: "Uspešno shranjen urnik", status: "success"})
            }, 1500)
        })
        
    } catch (error) {
        res.send({ odgovor: "Prišlo je do napake. Preglej Excel file", status: "error" })
    }


}


// Mail
var vnesiMail = (req, res) => {

    try {
        var mails = req.body.mails;

        function odpraviSumnike(text) {
            const chars = { 'č': 'c', 'ž': 'z', 'š': 's', 'Č': 'C', 'Š': 'S', 'Ž': 'Z' };
            text = text.replace(/[čšžČŠŽ]/g, m => chars[m])
            return text
        }

        maili().then(() => {
            res.send({ odgovor: "Uspešno shranjeni maili", status: 'success' })
        })

        function maili() {
            return new Promise(resolve => {
                mails.forEach((r) => {
                    if (r[0]) {

                        var profesor = odpraviSumnike(r[0])
                        var mail = r[1]
                        Mail.findOne({ profesor: profesor }).then((x) => {
                            if (x) {
                                x.mail = mail;
                                x.save()
                            } else {
                                var novi = new Mail();
                                novi.profesor = profesor;
                                novi.mail = mail;
                                novi.save();
                            }
                        })
                    }
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