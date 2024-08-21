const webpush = require('web-push')
const model = require('../models/models')

const publicKey = "BIRQYfbbT0m6gbz4mxKdAbMjRSaE0IR94vNYl8cnbTUL69AJDyxDRbmek22TtgnMLdQ61qyqdpZeNRZlqbrC5OY"
const privateKey = process.env.PRIVATE_KEY

webpush.setVapidDetails("mailto:a@b.com", publicKey, privateKey)

var notifica = (req, res) => {
    
    var {urnik, naslov, k, profesorji, razredi, urnik2} = req.body;

   
    var a = {}
    for (var i in razredi) {
        var r = razredi[i]
        a[r] = urnik2[r+'predmet']
    }

    try {
        if (k == 1) {
           
            var payload = {
                notification: {
                    data: {
                        urnik: urnik,
                        urnik2: a,
                        profesorji: profesorji,
                        razredi: razredi         
                    },
                    title: naslov,
                    vibrate: [100, 50, 100]
                }
            }
           
            model.NotificaProfesor.find({profesor: profesorji}).then(r => {
                r.forEach(x => {
                    webpush.sendNotification(x.sub, JSON.stringify(payload))
                })
                
            })
        } else {

            var payload = {
                notification: {
                    data: {
                        urnik: a,
                        razredi: razredi
                    },
                    title: naslov,
                    vibrate: [100, 50, 100]
                }
            }

            model.NotificaRazred.find({razred: razredi}).then(r => {
                r.forEach(x => {
                    webpush.sendNotification(x.sub, JSON.stringify(payload))
                })
                
            })
        }
        res.send({odgovor: "Uspešno poslano", status: "success"})
    } catch {
        res.send({odgovor: "Prišlo je do napake", status: "error"})
    }

    
    
} 

var poglej = (req, res) => {
    var {profesor, sub} = req.body;

    console.log(profesor)
    try {
        model.NotificaProfesor.findOne({profesor: profesor}).then(r => {
            if (!r) {
                var a = new model.NotificaProfesor();
                a.sub = sub
                a.profesor = profesor
                a.save()
            } else {
                r.sub = sub;
                r.save()
            }
        }).finally(() => {
            res.send({odgovor: "Uspešno", status: "success"})
        })
    } catch {
        res.send({odgovor: "Prislo je do napake", status: "error"})
    }
    
}

var poglejRazred = (req, res) => {
    var {razred, sub} = req.body;
    var endpoint = sub.endpoint;

    try {
        model.NotificaRazred.findOne({endpoint: endpoint}).then(r => {
            if (!r) {
                var a = new model.NotificaRazred();
                a.sub = sub
                a.endpoint = endpoint;
                a.razred = razred
                a.save()
            } else {
                r.sub = sub;
                r.razred = razred;
                r.save()
            }
        }).finally(() => {
            res.send({odgovor: "Uspešno", status: "success"})
        })
    } catch {
        res.send({odgovor: "Prislo je do napake", status: "error"})
    }
}


module.exports = {
    notifica,
    poglej,
    poglejRazred
}