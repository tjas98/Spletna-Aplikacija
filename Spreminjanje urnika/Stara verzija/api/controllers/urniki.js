const { default: mongoose } = require("mongoose");
const model = require("../models/models");
const { strict } = require("assert");
require('dotenv').config();

const TedenProfesorji = model.TedenProfesorji;
const TedenPredmeti = model.TedenPredmeti;
const TedenZaProfesorja = model.TedenZaProfesorja;

const Profesorji = model.Profesorji;
const UrnikPredmeti = model.UrnikPredmeti
const UrnikZaProfesorja = model.UrnikZaProfesorja;



const StalenPredmeti = model.StalenPredmeti
const StalenProfesorji = model.StalenProfesorji
const StalenZaProfesorja = model.StalenZaProfesorja

const Mail = model.Mail;
/*
var shraniUrnik = async (req, res) => {

    var a = UrnikPredmeti.find({})
    var b = Profesorji.find({})
    var c = UrnikZaProfesorja.find({})

    var allPromise = Promise.all([a,b,c])

    try {
        const r = await allPromise;
        
        r[0].forEach(urnik => {

            ShranjenDijaki.findOne({razred: urnik.razred}).then(rezultat => {
                if (rezultat) {
                    rezultat.pon = urnik.pon;
                    rezultat.tor = urnik.tor;
                    rezultat.sre = urnik.sre;
                    rezultat.cet = urnik.cet;
                    rezultat.pet = urnik.pet;
                    rezultat.save()
                } else {
                    var novi = new ShranjenDijaki()
                    novi.razred = urnik.razred;
                    novi.pon = urnik.pon;
                    novi.tor = urnik.tor;
                    novi.sre = urnik.sre;
                    novi.cet = urnik.cet;
                    novi.pet = urnik.pet;
                    novi.save()
                }
            })
        })

        r[1].forEach(urnik => {

            ShranjenProf.findOne({razred: urnik.razred}).then(rezultat => {
                if (rezultat) {
                    rezultat.pon = urnik.pon;
                    rezultat.tor = urnik.tor;
                    rezultat.sre = urnik.sre;
                    rezultat.cet = urnik.cet;
                    rezultat.pet = urnik.pet;
                    rezultat.save()
                } else {
                    var novi = new ShranjenProf()
                    novi.razred = urnik.razred;
                    novi.pon = urnik.pon;
                    novi.tor = urnik.tor;
                    novi.sre = urnik.sre;
                    novi.cet = urnik.cet;
                    novi.pet = urnik.pet;
                    novi.save()
                }
            })
        })

        r[2].forEach(urnik => {

            ShranjenZaProfesorja.findOne({profesor: urnik.profesor}).then(rezultat => {
                if (rezultat) {
                    rezultat.pon = urnik.pon;
                    rezultat.tor = urnik.tor;
                    rezultat.sre = urnik.sre;
                    rezultat.cet = urnik.cet;
                    rezultat.pet = urnik.pet;
                    rezultat.save()
                } else {
                    var novi = new ShranjenZaProfesorja()
                    novi.profesor = urnik.profesor;
                    novi.pon = urnik.pon;
                    novi.tor = urnik.tor;
                    novi.sre = urnik.sre;
                    novi.cet = urnik.cet;
                    novi.pet = urnik.pet;
                    novi.save()
                }
            })
        })
        res.send({odgovor: "Uspešno shranjen urnik", status: "success"})

    } catch (error) {
        res.send({odgovor: "Prišlo je do napake", status: "error"})
    }
    
}

var potrdiUrnik = async (req, res) => {

    var a = UrnikPredmeti.find({})
    var b = Profesorji.find({})
    var c = UrnikZaProfesorja.find({})

    var allPromise = Promise.all([a,b,c])

    try {
        const r = await allPromise;
        
        r[0].forEach(urnik => {

            PotrjenDijaki.findOne({razred: urnik.razred}).then(rezultat => {
                if (rezultat) {
                    rezultat.pon = urnik.pon;
                    rezultat.tor = urnik.tor;
                    rezultat.sre = urnik.sre;
                    rezultat.cet = urnik.cet;
                    rezultat.pet = urnik.pet;
                    rezultat.save()
                } else {
                    var novi = new PotrjenDijaki()
                    novi.razred = urnik.razred;
                    novi.pon = urnik.pon;
                    novi.tor = urnik.tor;
                    novi.sre = urnik.sre;
                    novi.cet = urnik.cet;
                    novi.pet = urnik.pet;
                    novi.save()
                }
            })
        })

        r[1].forEach(urnik => {

            PotrjenProf.findOne({razred: urnik.razred}).then(rezultat => {
                if (rezultat) {
                    rezultat.pon = urnik.pon;
                    rezultat.tor = urnik.tor;
                    rezultat.sre = urnik.sre;
                    rezultat.cet = urnik.cet;
                    rezultat.pet = urnik.pet;
                    rezultat.save()
                } else {
                    var novi = new PotrjenProf()
                    novi.razred = urnik.razred;
                    novi.pon = urnik.pon;
                    novi.tor = urnik.tor;
                    novi.sre = urnik.sre;
                    novi.cet = urnik.cet;
                    novi.pet = urnik.pet;
                    novi.save()
                }
            })
        })

        r[2].forEach(urnik => {

            PotrjenZaProfesorja.findOne({profesor: urnik.profesor}).then(rezultat => {
                if (rezultat) {
                    rezultat.pon = urnik.pon;
                    rezultat.tor = urnik.tor;
                    rezultat.sre = urnik.sre;
                    rezultat.cet = urnik.cet;
                    rezultat.pet = urnik.pet;
                    rezultat.save()
                } else {
                    var novi = new PotrjenZaProfesorja()
                    novi.profesor = urnik.profesor;
                    novi.pon = urnik.pon;
                    novi.tor = urnik.tor;
                    novi.sre = urnik.sre;
                    novi.cet = urnik.cet;
                    novi.pet = urnik.pet;
                    novi.save()
                }
            })
        })
        res.send({odgovor: "Uspešno potrjen urnik", status: "success"})

    } catch (error) {
        res.send({odgovor: "Prišlo je do napake", status: "error"})
    }
    
}

var zamenjajUrnik = (req, res) => {

    var urnik = req.params.urnik;

    var a = UrnikPredmeti.remove({}).then(function(err, r) {
        console.log("Removed")
    })

    var b = Profesorji.remove({}).then(function(err, r) {
        console.log("Removed")
    })

    var c = UrnikZaProfesorja.remove({}).then(function(err, r) {
        console.log("Removed")
    })

    Promise.all([a,b,c]).then(() => {
        if (urnik == 'potrjen') uporabljajPotrjenUrnik().then(() => {
            res.send({odgovor: "Uspešno zamenjan urnik", status: "success"})
        }).catch(() => {
            res.send({odgovor: "Prišlo je do napake", status: "error"})
        })
        if (urnik == 'shranjen') uporabljajShranjenUrnik().then(() => {
            res.send({odgovor: "Uspešno zamenjan urnik", status: "success"})
        }).catch(() => {
            res.send({odgovor: "Prišlo je do napake", status: "error"})
        })
        if (urnik == 'stalen') uporabljajStalenUrnik().then(() => {
            res.send({odgovor: "Uspešno zamenjan urnik", status: "success"})
        }).catch(() => {
            res.send({odgovor: "Prišlo je do napake", status: "error"})
        })
        if (urnik == 'teden') uporabljajTedenskiUrnik().then(() => {
            res.send({odgovor: "Uspešno zamenjan urnik", status: "success"})
        }).catch(() => {
            res.send({odgovor: "Prišlo je do napake", status: "error"})
        })
    })

}
*/
/*
function uporabljajShranjenUrnik() {

    
    return new Promise((resolve, reject) => {
        
        ShranjenDijaki.find({}).then(function(rez) {
            ShranjenProf.find({}).then(function(rez2) {
                for (var i = 0; i < rez.length; i++) {
    
                    var r = rez[i];
                    var razred = r.razred
    
                    var index = rez2.map(e => e.razred).indexOf(razred);
                    var r2 = rez2[index];
                        
                    var a = new UrnikPredmeti();
                    a.razred = razred;
                    a.pon = r.pon;
                    a.tor = r.tor;
                    a.sre = r.sre;
                    a.cet = r.cet;
                    a.pet = r.pet;
                    a.save()
    
                    var b = new Profesorji();
                    
                    b.razred = r2.razred;
                    b.pon = r2.pon;
                    b.tor = r2.tor;
                    b.sre = r2.sre;
                    b.cet = r2.cet;
                    b.pet = r2.pet;
                        
                    b.save()
                }
            })
        }) 
    
        ShranjenZaProfesorja.find({}).then(function(rez) {
    
            rez.forEach(function(r) {
                var a = new UrnikZaProfesorja();
                    
                a.profesor = r.profesor;
                a.pon = r.pon;
                a.tor = r.tor;
                a.sre = r.sre;
                a.cet = r.cet;
                a.pet = r.pet;
                    
                a.save()
            }) 
            resolve()
        }) 
        
    })
    
}

function uporabljajTedenskiUrnik() {
    return new Promise((resolve, reject) => {
        TedenPredmeti.find({}).then(function(rez) {
           TedenProfesorji.find({}).then(function(rez2) {
                    
                for (var i = 0; i < rez.length; i++) {
    
                    var r = rez[i];
                    var razred = r.razred
    
                    var index = rez2.map(e => e.razred).indexOf(razred);
                    var r2 = rez2[index];
                        
    
                    var a = new UrnikPredmeti();
                    a.razred = razred;
                    a.pon = r.pon;
                    a.tor = r.tor;
                    a.sre = r.sre;
                    a.cet = r.cet;
                    a.pet = r.pet;
                    a.save()
    
                    var b = new Profesorji();
                    
                    b.razred = r2.razred;
                    b.pon = r2.pon;
                    b.tor = r2.tor;
                    b.sre = r2.sre;
                    b.cet = r2.cet;
                    b.pet = r2.pet;
                        
                    b.save()
                }
            })
        }) 
        TedenZaProfesorja.find({}).then(function(rez) {
    
            rez.forEach(function(r) {
                var a = new UrnikZaProfesorja();
                    
                a.profesor = r.profesor;
                a.pon = r.pon;
                a.tor = r.tor;
                a.sre = r.sre;
                a.cet = r.cet;
                a.pet = r.pet;
                    
                a.save()
            }) 
        }) 
        resolve()
    })
}

function uporabljajStalenUrnik(){
    return new Promise((resolve, reject) => {
        
        StalenPredmeti.find({}).then(function(rez) {
            StalenProfesorji.find({}).then(function(rez2) {
                    
                for (var i = 0; i < rez.length; i++) {
    
                    var r = rez[i];
                    var razred = r.razred
    
                    var index = rez2.map(e => e.razred).indexOf(razred);
                    var r2 = rez2[index];
                        
    
                    var a = new UrnikPredmeti();
                    a.razred = razred;
                    a.pon = r.pon;
                    a.tor = r.tor;
                    a.sre = r.sre;
                    a.cet = r.cet;
                    a.pet = r.pet;
                    a.save()
    
                    var b = new Profesorji();
                    
                    b.razred = r2.razred;
                    b.pon = r2.pon;
                    b.tor = r2.tor;
                    b.sre = r2.sre;
                    b.cet = r2.cet;
                    b.pet = r2.pet;
                        
                    b.save()
                }
            })
        }) 
        StalenZaProfesorja.find({}).then(function(rez) {
    
            rez.forEach(function(r) {
                var a = new UrnikZaProfesorja();
                    
                a.profesor = r.profesor;
                a.pon = r.pon;
                a.tor = r.tor;
                a.sre = r.sre;
                a.cet = r.cet;
                a.pet = r.pet;
                    
                a.save()
            }) 
        })
        resolve()
    })    
}

function uporabljajPotrjenUrnik(){
    return new Promise((resolve, reject) => {
        PotrjenDijaki.find({}).then(function(rez) {
            PotrjenProf.find({}).then(function(rez2) {
                        
                for (var i = 0; i < rez.length; i++) {
        
                    var r = rez[i];
                    var razred = r.razred
                            
                    var index = rez2.map(e => e.razred).indexOf(razred);
                    var r2 = rez2[index];
                            
                    var a = new UrnikPredmeti();
                    a.razred = razred;
                    a.pon = r.pon;
                    a.tor = r.tor;
                    a.sre = r.sre;
                    a.cet = r.cet;
                    a.pet = r.pet;
                    a.save()
        
                    var b = new Profesorji();
                            
                    b.razred = r2.razred;
                    b.pon = r2.pon;
                    b.tor = r2.tor;
                    b.sre = r2.sre;
                    b.cet = r2.cet;
                    b.pet = r2.pet;
                    b.save()
                            
                }
            })
        }) 
    PotrjenZaProfesorja.find({}).then(function(rez) {
        
        rez.forEach(function(r) {
            var a = new UrnikZaProfesorja();
                        
            a.profesor = r.profesor;
            a.pon = r.pon;
            a.tor = r.tor;
            a.sre = r.sre;
            a.cet = r.cet;
            a.pet = r.pet;
                        
            a.save()
        }) 
    })
    resolve()
    })          
}
*/
var pridobiMaile = (req, res) => {
    var profesorji = req.query.profesorji;
    var razredi = req.query.razredi;
    var mails = "";

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
   
}


var vrniIzbranUrnik = (req, res) => {
    var urnik = req.query.urnik

    
    if (urnik == "stalen") {
        var a = StalenPredmeti.find({}).select({'_id': 0}).sort({razred: 1});
        var b = StalenProfesorji.find({}).select({'_id': 0}).sort({razred: 1});
        var c = StalenZaProfesorja.find({}).select({'_id': 0}).sort({profesor: 1});
    }
    

    var obj = {
        predmeti: Array,
        profesorji: Array,
        urnikZaProf: Array
    } 

    

    Promise.all([a,b,c]).then((r) => {
        obj.predmeti = r[0];
        obj.profesorji = r[1];
        obj.urnikZaProf = r[2];
        res.send(obj)
    })

}

var provaDatum = (req, res) => {

    var datum = req.query.datum;
    var k = req.query.k;

    try {
        var a = UrnikPredmeti.find({})
        var b = Profesorji.find({})
        var c = UrnikZaProfesorja.find({})

        Promise.all([a, b, c]).then(x => {
            model.Datum.findOne({ datum: datum }).then(r => {
                if (!r) {
                    var d = new model.Datum();
                    d.predmeti = x[0];
                    d.profesorji = x[1];
                    d.urnikZaProf = x[2];
                    d.datum = datum;
                    d.save()
                } else {
                    r.predmeti = x[0];
                    r.profesorji = x[1];
                    r.urnikZaProf = x[2];
                    r.save()
                }

            })

            if (k == 1) {
                model.Potrjen.findOne({ datum: datum }).then(r => {
                    if (!r) {
                        var d = new model.Potrjen();
                        d.predmeti = x[0];
                        d.profesorji = x[1];
                        d.urnikZaProf = x[2];
                        d.datum = datum;
                        d.save()
                    } else {
                        r.predmeti = x[0];
                        r.profesorji = x[1];
                        r.urnikZaProf = x[2];
                        r.save()
                    }
                }).finally(() => {
                    res.send({odgovor: "Uspešno potrjen urnik", status: "success"})
                })
            }
        }).finally(() => {
            if (k != 1) res.send({odgovor: "Uspešno shranjen urnik", status: "success"})
        })
    } catch {
        res.send({ odgovor: "NAPAKA", status: "error" })
    }

    
}

var provaTeden = (req, res) => {
    var datum = req.query.datum;
    
    var a = model.Datum.findOne({datum: datum})
    var b = model.Potrjen.findOne({datum: datum})

    Promise.all([a,b]).then(r => {
        var sh = true;
        var po = true;

        if (!r[0]) sh = false;
        if (!r[1]) po = false;

        if (!sh) res.send({odgovor: "Za teden " + datum + " ni shranjenega urnika", status: "warn"})
        else res.send({odgovor: "Urnik za teden " + datum + " je že shranjen", status: "success", sh: sh, po: po})
    })

    
}

var uporabljajShranjen = async (req, res) => {
    var datum = req.query.datum;
    var k = req.query.urnik;

    var dni = ['pon', 'tor', 'sre', 'cet', 'pet']

    var data = {}

    try {

        if (k == 0) var a = model.Datum.findOne({datum: datum})
        else var a = model.Potrjen.findOne({datum: datum})

        await a.then((r) => {
           
            if (r == null) data = { odgovor: "Napaka. Prosim spet shrani urnik", status: "error" }
            else {
                UrnikPredmeti.find({}).then(urnik => {
                    r.predmeti.forEach(x => {
                        var i = urnik.map(e => e.razred).indexOf(x.razred);
                        dni.forEach(dan => {
                            urnik[i][dan] = x[dan]
                        })
                        urnik[i].save()
                    })
                })
                Profesorji.find().then(urnik => {
                    r.profesorji.forEach(x => {
                        var i = urnik.map(e => e.razred).indexOf(x.razred);
                        dni.forEach(dan => {
                            urnik[i][dan] = x[dan]
                        })
                        urnik[i].save()
                    })
                })
                UrnikZaProfesorja.find({}).then(urnik => {
                    r.urnikZaProf.forEach(x => {
                        var i = urnik.map(e => e.profesor).indexOf(x.profesor);
                        dni.forEach(dan => {
                            urnik[i][dan] = x[dan]
                        })
                        urnik[i].save()
                    })
                })
                if (k == 0) data = { odgovor: "Uspešno uporabljaš shranjen urnik " + datum, status: "success", urnik: "Shranjen" }
                else data = { odgovor: "Uspešno uporabljaš potrjen urnik " + datum, status: "success", urnik: "Potrjen" }
            }
        }).finally(() => {
            setTimeout(() => {
                res.send(data)
            }, 1500)
        })
    } catch {
        res.send({ odgovor: "Napaka " + datum, status: "error" })
    }
    
}

var uporabljajStalen = async (req, res) => {
    var a = StalenPredmeti.find({})
    var b = StalenProfesorji.find({})
    var c = StalenZaProfesorja.find({})

    var dni = ['pon', 'tor', 'sre', 'cet', 'pet']
    try {
        await a.then(r => {
            UrnikPredmeti.find({}).then(urnik => {
                r.forEach(x => {
                    var i = urnik.map(e => e.razred).indexOf(x.razred);
                    if (i < 0) return res.send({ odgovor: "Prosim vnesi spet urnik", status: "error" })
                    dni.forEach(dan => { urnik[i][dan] = x[dan] })
                    urnik[i].save()
                })
            })
        })

        await b.then(r => {
            Profesorji.find().then(urnik => {
                r.forEach(x => {
                    var i = urnik.map(e => e.razred).indexOf(x.razred);
                    if (i < 0) return res.send({ odgovor: "Prosim vnesi spet urnik", status: "error" })
                    dni.forEach(dan => { urnik[i][dan] = x[dan] })
                    urnik[i].save()
                })
            })
        })

        await c.then(r => {
            UrnikZaProfesorja.find({}).then(urnik => {
                r.forEach(x => {
                    var i = urnik.map(e => e.profesor).indexOf(x.profesor);
                    if (i < 0) return res.send({ odgovor: "Prosim vnesi spet urnik", status: "error" })
                    dni.forEach(dan => { urnik[i][dan] = x[dan] })
                    urnik[i].save()
                })
            })
        }).finally(() => {
            setTimeout(() => {
                res.send({ odgovor: "Uspešno uporabljaš stalen urnik", status: "success" })
            }, 1500)

        })
    } catch {
        res.send({ odgovor: "Prišlo je do napake", status: "error" })
    }
    
}

var vrniDatumUrnik = (req, res) => {
    var urnik = req.query.urnik;
    var datum = req.query.datum;
    console.log("Anton")
    console.log(urnik, datum)

    if (urnik == 0) {
        model.Datum.findOne({datum: datum}).then(r => {
            
            if (r == null) res.send({odgovor: "Urnik za ta teden ni še objavljen", status: "error"})
            else res.send({odgovor: "Uspešno vrnjen urnik", urnik: r, status: "success", tip: "Shranjen"})
            
        })
    } else {
        model.Potrjen.findOne({datum: datum}).then(r => {
            
            if (r == null) res.send({odgovor: "Urnik za ta teden ni še objavljen", status: "error"})
            else res.send({odgovor: "Uspešno vrnjen urnik", urnik: r, status: "success", tip: "ShraPotrjennjen"})
            
        })
    }
}


var shrani = (req, res) => {
    
    var urnik = req.body.urnik
    var datum = req.body.datum

    try {
        model.Datum.findOne({datum: datum}).then(r => {
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
       
        
        res.send({odgovor: "Uspešno shranjen urnik v podatkovno zbirko", status: "success"})
    } catch {
        res.send({odgovor: "Prišlo je do napake", status: "error"})
    }

    
}

var potrdi = (req, res) => {
    
    var urnik = req.body.urnik
    var datum = req.body.datum

    try {
        model.Potrjen.findOne({datum: datum}).then(r => {
            if (r) {
                r.predmeti = urnik.predmeti
                r.profesorji = urnik.profesorji
                r.urnikZaProf = urnik.urnikZaProf
    
                r.save()
            } else {
                var d = new model.Potrjen()
                d.predmeti = urnik.predmeti
                d.profesorji = urnik.profesorji
                d.urnikZaProf = urnik.urnikZaProf
                d.datum = datum
                d.save()
            }
        })
       
        
        res.send({odgovor: "Uspešno potrjen ter shranjen urnik", status: "success"})
    } catch {
        res.send({odgovor: "Prišlo je do napake", status: "error"})
    }

    
}

module.exports = {
    //shraniUrnik,
    //potrdiUrnik,
    pridobiMaile,
    //zamenjajUrnik,
    vrniIzbranUrnik,
    provaDatum,
    provaTeden,
    uporabljajShranjen,
    vrniDatumUrnik,
    uporabljajStalen,
    shrani,
    potrdi
}