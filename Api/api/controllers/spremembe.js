
const model = require("../models/models");
require('dotenv').config();


const StalenProfesorji = model.StalenProfesorji;
const StalenPredmeti = model.StalenPredmeti;
const StalenZaProfesorja = model.StalenZaProfesorja;

const Profesorji = model.Profesorji;
const UrnikPredmeti = model.UrnikPredmeti
const UrnikZaProfesorja = model.UrnikZaProfesorja;

// Prosta ura

// Zamenjaj predmet

var zamenjajPredmet = (req, res) => {

    var { ura, dan, razred, profesor, predmet } = req.body;

    var a = UrnikPredmeti.findOne({ razred: razred });
    var b = UrnikZaProfesorja.findOne({ profesor: profesor });

    Promise.all([a, b]).then(r => {
        r[0][dan][ura] = predmet;
        r[1][dan][ura] = razred;

        r[0].save()
            .then(() => {
                r[1].save().
                    then(() => {
                        res.send({ odgovor: "OK" })
                    })
            })
    })
}

// Dodaj razred

var dodajRazred = (req, res) => {

    var { ura, dan, razredi, profesor, predmet } = req.body;

    var a = UrnikPredmeti.find({ razred: razredi }).then(function (r) {
        r.forEach((s) => {
            s[dan][ura] = predmet;
            //s.save();
        })
    })

    var b = Profesorji.find({ razred: razredi }).then(function (r) {
        r.forEach((s) => {
            s[dan][ura] = profesor;
            s.save();
        })
    })

    var c = UrnikZaProfesorja.findOne({ profesor: profesor }).then(function (r) {
        r[dan][ura] = razredi[0];
        for (var i = 1; i < razredi.length; i++) {
            r[dan][ura] += ',' + razredi[i];
        }

        r.save();
    })

    Promise.all([a, b, c]).then(() => {
        res.send({ a: 'OK' })
    })
}

// Zamenjava dveh ur

var zamenjavaDvehUr = async (req, res) => {

    var { prvaUra, drugaUra, dan, dodatnaSprememba, podatek } = req.body;

    if (dodatnaSprememba == 1) {

        if (podatek.p1 != undefined) {
            var razred = podatek.ura1.toUpperCase();
            var a = UrnikPredmeti.findOne({ razred: razred });
            var b = Profesorji.findOne({ razred: razred });

            Promise.all([a, b]).then(r => {
                if (r[0] && r[1]) {
                    r[0][dan][druga.ura] = 'Prosto';
                    r[1][dan][druga.ura] = 'Prosto';
                    r[0].save();
                    r[1].save();
                }

            })
        }
        if (podatek.p2 != undefined) {
            var razred = podatek.ura2.toUpperCase();
            var a = UrnikPredmeti.findOne({ razred: razred });
            var b = Profesorji.findOne({ razred: razred });

            Promise.all([a, b]).then(r => {
                if (r[0] && r[1]) {
                    r[0][dan][prva.ura] = 'Prosto';
                    r[1][dan][prva.ura] = 'Prosto';

                    r[0].save();
                    r[1].save();
                }
            })
        }
    }

    if (prvaUra.predmet == " ") prva.predmet = "Prosto";
    if (drugaUra.predmet == " ") druga.predmet = "Prosto";

    if (prvaUra.razred != drugaUra.razred) {
        return 0;
    } else {

        var razred = prvaUra.razred;

        var a = await UrnikPredmeti.findOne({ razred: razred })
        var b = await Profesorji.findOne({ razred: razred })

        var prviProfesor = prvaUra.profesor.split(',')
        var a1 = await UrnikZaProfesorja.find({ profesor: prviProfesor })

        var drugiProfesor = drugaUra.profesor.split(',')
        var b2 = await UrnikZaProfesorja.find({ profesor: drugiProfesor })

        await Promise.all([a, b, a1, b2]).then((r) => {
            r[0][dan][prvaUra.ura] = drugaUra.predmet;
            r[0][dan][drugaUra.ura] = prvaUra.predmet;
            r[0].save()

            r[1][dan][prvaUra.ura] = drugaUra.profesor;
            r[1][dan][drugaUra.ura] = prvaUra.profesor;
            r[1].save();

            r[2].forEach(x => {
                x[dan][prvaUra.ura] = "Prosto";
                x[dan][drugaUra.ura] = razred;
                x.save()
            })
            r[3].forEach(x => {
                x[dan][drugaUra.ura] = "Prosto";
                x[dan][prvaUra.ura] = razred;
                x.save()
            })

        }).then(() => {
            res.send({ odgovor: "OK" })
        })
    }
}

// Odsoten profesor

var odsoten = (req, res) => {
    console.log(req.body)
    var { profesor, dan, razredi } = req.body;

    var a = UrnikPredmeti.find({ razred: razredi });
    var b = Profesorji.find({ razred: razredi });
    var c = UrnikZaProfesorja.findOne({ profesor: profesor });

    naredi().then(() => { res.send({ a: "Profesor odsoten" }); })

    function naredi() {
        return new Promise((resolve, reject) => {
            Promise.all([a, b, c]).then((r) => {
                for (var i = 0; i < razredi.length; i++) {
                    if (r[0][i]) {
                        var razred = r[0][i].razred

                        var i1 = r[0].map(e => e.razred).indexOf(razred);
                        var i2 = r[1].map(e => e.razred).indexOf(razred);

                        if (r[1][i]) {
                            for (var j = 0; j < r[0][i][dan].length; j++) {
                                if (r[1][i2][dan][j] == profesor) {

                                    r[0][i1][dan][j] = 'Prosto';
                                    r[1][i2][dan][j] = 'Prosto';
                                }
                                if (r[1][i2][dan][j].includes(',') && r[1][i2][dan][j].includes(profesor)) {
                                    var rp = r[1][i2][dan][j].replace(profesor, '');
                                    r[1][i2][dan][j] = rp.replace(',', '');
                                }
                            }
                            r[0][i].save();
                            r[1][i].save();
                        }
                    }
                }
                for (var i = 0; i < r[2][dan].length; i++) {
                    r[2][dan][i] = 'Prosto';
                }
                r[2].save().then(() => {
                    resolve()
                });

            })
        })
    }


}

// Izbrisi spremembo

var izbrisiSpremembo = (req, res) => {
    
    try {
        var dan = req.query.dan;

        var a1 =  UrnikZaProfesorja.find({}).sort({profesor: 1})
        var a2 = StalenZaProfesorja.find({}).sort({profesor: 1})
    
        var b1 = UrnikPredmeti.find({}).sort({razred: 1})
        var b2 = StalenPredmeti.find({}).sort({razred: 1})
    
        var c1 = Profesorji.find({}).sort({razred: 1})
        var c2 = StalenProfesorji.find({}).sort({razred: 1})
    
        Promise.all([a1,a2,b1,b2,c1,c2]).then((r) => {
            
            r[0].forEach((x, i) => {
                r[0][i][dan] = r[1][i][dan]
                r[0][i].save()
            })
    
            r[2].forEach((x, i) => {
                r[2][i][dan] = r[3][i][dan]
                r[2][i].save()
            })
    
            r[4].forEach((x, i) => {
                r[4][i][dan] = r[5][i][dan]
                r[4][i].save()
            })
        }).finally(() => {
            setTimeout(() => {
                res.send({odgovor: "Uspešno zbrisane spremembe", status: "success"})
            }, 1500)
        })
    } catch {
        res.send({odgovor: "Prišlo je do napake", status: "error"})
    }

}

// Potrdi prosto uro

var potrdiProsto = (req, res) => {

    var { razred, dan, ura } = req.body
    console.log(req.body)

    var a = UrnikPredmeti.findOne({ razred: razred })
    var b = Profesorji.findOne({ razred: razred })

    Promise.all([a, b]).then(r => {
        try {
            r.forEach(x => {
                x[dan][ura] = '';
                x.save()
            })
        } catch (error) {
            res.send({ odgovor: "Prišlo je do napake", status: "error" })
        }

    }).then(() => {
        setTimeout(() => {
            res.send({ odgovor: "Uspešno potrjena prosta ura", status: "success" })
        }, 500)
    })
}

// Sprememba na prosto

var spremembaProsto = (req, res) => {

    var { profesor, razred, razred2, ura, dan, predmet } = req.body;

    if (profesor == undefined) profesor = ""

    var s1 = UrnikPredmeti.findOne({ razred: razred }).then(function (r) {
        r[dan][ura] = predmet;
        r.save()
    })

    var s2 = Profesorji.findOne({ razred: razred }).then(function (r) {
        r[dan][ura] = profesor;
        r.save()
    })

    var s3 = UrnikZaProfesorja.findOne({ profesor: profesor }).then(function (r) {
        if (r) {
            r[dan][ura] = razred;
            r.save()
        }
    })

    var s4 = UrnikPredmeti.findOne({ razred: razred2 }).then(function (r) {
        if (r) {
            r[dan][ura] = 'Prosto';
            r.save();
        }
    })

    var s5 = Profesorji.findOne({ razred: razred2 }).then(function (r) {
        if (r) {
            r[dan][ura] = 'Prosto';
            r.save();
        }
    })

    Promise.all([s1, s2, s3, s4, s5]).then(() => {
        res.send({ odgovor: "OK" });
    })

}

// Sprosti enega profesorja

var sprostiEnegaProfesorja = (req, res) => {
    var ura = req.body.ura;
    var dan = req.body.dan;
    var razred = req.body.razred;
    var profesor = req.body.profPouk;
    var neProfesor = req.body.drugiProf;
    var predmet = req.body.predmet;
    console.log(req.body)

    var a = UrnikPredmeti.findOne({ razred: razred }).then(function (r) {
        r[dan][ura] = predmet;
        r.save();
    })

    var b = Profesorji.findOne({ razred: razred }).then(function (r) {
        r[dan][ura] = profesor;
        r.save();
    })

    var c = UrnikZaProfesorja.findOne({ profesor: neProfesor }).then(function (r) {
        r[dan][ura] = 'Prosto';
        r.save();
    })


    Promise.all([a, b, c]).then(() => {
        res.send({ a: "OK" });
    })
}

// Nova sprememba
var novaSprememba = (req, res) => {

    var { profesor1, profesor2, razred, razred2, ura, dan, predmet } = req.body;

    if (profesor1 == profesor2) {
        try {
            UrnikPredmeti.findOne({ razred: razred }).then(r => {

                if (!r) res.send({ odgovor: "Prišlo je do napake v bazi podatkov", status: "error" })
                else {
                    r[dan][ura] = predmet;
                    r.save().then(() => {
                        res.send({ odgovor: "Uspešna sprememba", status: "success" })
                    })
                }
            })
        } catch {
            res.send({ odgovor: "Prišlo je do napake", status: "error" })
        }

    } else {

        var a = UrnikZaProfesorja.findOne({ profesor: profesor1 })
        var b = UrnikPredmeti.findOne({ razred: razred })
        var c = Profesorji.findOne({ razred: razred })
        var d = UrnikZaProfesorja.findOne({ profesor: profesor2 })

        Promise.all([a, b, c, d]).then(r => {
            try {
                if (r[0]) {
                    r[0][dan][ura] = "Prosto"
                    r[0].save()
                }

                r[1][dan][ura] = predmet;
                r[1].save()

                r[2][dan][ura] = profesor2;
                r[2].save();

                r[3][dan][ura] = razred;
                r[3].save();

                if (razred != razred2) {
                    Promise.all([UrnikPredmeti.findOne({ razred: razred2 }), Profesorji.findOne({ razred: razred2 })]).then(r => {
                        r.forEach(x => {
                            if (x != null) {
                                x[dan][ura] = "Prosto"
                                x.save()
                            }
                        })
                        res.send({ odgovor: "Uspešno spremenjeno", status: "success" })
                    })
                } else res.send({ odgovor: "Uspešno spremenjeno", status: "success" })
                
            } catch (error) {
                res.send({ odgovor: "Prišlo je do napake", status: "error" })
            }
        })
    }

}

// Dodan ne sprosti
var dodanNeSprosti = (req, res) => {
    var dan = req.body.dan;
    var ura = req.body.ura;
    var predmet = req.body.predmet;
    var razred = req.body.razred;
    var profesorji = req.body.profesorji;

    var stringProfesorji = "";

    var dolzina = profesorji.length;

    for (var i = 0; i < profesorji.length; i++) {
        stringProfesorji += profesorji[i];
        if (i != profesorji.length - 1) stringProfesorji += ',';
    }

    var a = Profesorji.findOne({ razred: razred }).then(function (r) {
        r[dan][ura] = stringProfesorji;
        r.save();
    })

    var b = UrnikPredmeti.findOne({ razred: razred }).then(function (r) {
        r[dan][ura] = predmet;
        r.save();
    })

    Promise.all([a, b]).then(() => {
        res.send({ a: "OK" });
    })


}

var odstraniProfesorja = (req, res) => {

    var { ura, dan, razred, predmet, izbrisan, izbran } = req.body;

    var a = UrnikPredmeti.findOne({ razred: razred })

    var b = Profesorji.findOne({ razred: razred })

    var c = UrnikZaProfesorja.findOne({ profesor: izbrisan })


    Promise.all([a, b, c]).then((r) => {
        r[0][dan][ura] = predmet;
        r[1][dan][ura] = izbran;
        r[2][dan][ura] = "Prosto"

        r.forEach(x => x.save())

    }).then(res.send({ odgovor: "OK" }))
}

var prostaUra = (req, res) => {
    var { razred, profesor, ura, dan } = req.body;

    try {
        var a = UrnikPredmeti.findOne({ razred: razred })
        var b = Profesorji.findOne({ razred: razred })

        Promise.all([a, b]).then(r => {
            r.forEach((x) => {
                x[dan][ura] = "Prosto"
                x.save()
            })
        }).then(() => {
            if (profesor) {
                if (!profesor.includes(',')) {
                    UrnikZaProfesorja.findOne({ profesor: profesor }).then((r) => {
                        r[dan][ura] = "Prosto"
                        r.save()
                    }).finally(() => {
                        res.send({ odgovor: "Uspešna sprememba", status: "success" })
                    })
                } else {
                    var profesorji = profesor.split(',')
                    UrnikZaProfesorja.find({ profesor: profesorji }).then((r) => {
                        r.forEach((x) => {
                            x[dan][ura] = "Prosto"
                            x.save()
                        })
                    }).finally(() => {
                        res.send({ odgovor: "Uspešna sprememba", status: "success" })
                    })
                }
            } else res.send({ odgovor: "Uspešna sprememba", status: "success" })
        })
    } catch {
        res.send({ odgovor: "Prišlo je do napake", status: "error" })
    }
}

var auto = async (req, res) => {
    var { spremembe } = req.body;

    var razredi = []
    for (var i in spremembe) {
        razredi.push(spremembe[i].razred)
    }

    console.log(razredi)

    if (spremembe.length < 1) res.send({ odgovor: "Ure so že potrjene", status: "warn" })
    else {
        try {

            var a = UrnikPredmeti.find({razred: razredi})
            var b = Profesorji.find({razred: razredi})

            Promise.all([a,b]).then(r => {
                for (var i in spremembe) {
                    var razred = spremembe[i].razred;
                    var dan = spremembe[i].dan
                    var ura = spremembe[i].ura

                    var index1 = r[0].map(e => e.razred).indexOf(razred);
                    var index2 = r[1].map(e => e.razred).indexOf(razred);
                    
                    r[0][index1][dan][ura] = '';
                    r[1][index2][dan][ura] = '';
                }

                r[0].forEach(x => {
                    x.save()
                })
                r[1].forEach(x => {
                    x.save()
                })
                
            }).finally(() => {
                setTimeout(() => {
                    res.send({ odgovor: "Uspešno potrjene proste ure", status: "success" })
                }, 1500)
            })
            /*
            for (var i in spremembe) {
               
                console.log(i)
                UrnikPredmeti.findOne({ razred: spremembe[i].razred }).then(r => {
                    console.log(i)
                    var dan = spremembe[i].dan
                    var ura = spremembe[i].ura
                    console.log(dan, ura)
                    r[dan][ura] = "";
                    r.save();
                })
                Profesorji.findOne({ razred: spremembe[i].razred }).then(r => {
                    var dan = spremembe[i].dan
                    var ura = spremembe[i].ura
                    console.log(dan, ura)
                    r[dan][ura] = "";
                    r.save()
                })
            }
            setTimeout(() => {
                res.send({ odgovor: "Uspešno potrjene proste ure", status: "success" })
            }, 1500)
            */
        } catch {
            res.send({ odgovor: "Prišlo je do napake", status: "error" })
        }
    }
    
  
   

}

// --------------------------NE UPORABLJENI------------------------------------------

/*

var dodajProfesorja = (req, res) => {
    var noviProfesor = req.body.noviProfesor;
    var zamenjanProfesor = req.body.zamenjanProfesor;

    console.log(req.body)

    const sup = new Suplenti();
    sup.profesor = noviProfesor;
    sup.zamenjanProfesor = zamenjanProfesor;
    sup.save();

    var b = StalenZaProfesorja.findOne({profesor: zamenjanProfesor}).then(function(r) {
        const novi = new UrnikZaProfesorja();
        novi.profesor = noviProfesor;
        novi.pon = r.pon;
        novi.tor = r.tor;
        novi.sre = r.sre;
        novi.cet = r.cet;
        novi.pet = r.pet;
        novi.sob = r.sob;
        novi.save();

        const novi2 = new StalenZaProfesorja();
        novi2.profesor = noviProfesor;
        novi2.pon = r.pon;
        novi2.tor = r.tor;
        novi2.sre = r.sre;
        novi2.cet = r.cet;
        novi2.pet = r.pet;
        novi2.sob = r.sob;
        novi2.save();
    });

   Promise.all([b]).then(() => {
       res.send({a: "DODAN"});
   })
}


*/


module.exports = {
    izbrisiSpremembo,
    zamenjavaDvehUr,
    odsoten,
    potrdiProsto,
    spremembaProsto,
    novaSprememba,
    dodanNeSprosti,
    prostaUra,
    zamenjajPredmet,
    dodajRazred,
    sprostiEnegaProfesorja,
    odstraniProfesorja,
    prostaUra,
    auto
}
