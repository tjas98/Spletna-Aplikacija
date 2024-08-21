import { Injectable } from '@angular/core';
import { UrnikService } from './urnik.service';

@Injectable({
  providedIn: 'root'
})
export class LocalService {

  constructor(
    private urnik: UrnikService
  ) { }

  odsoten(profesor: any, dan: any) {


    var razredi = this.urnik.razrediProfesorja(profesor, dan);

    var urnik = localStorage.getItem('urnik-zacasen')
    var obj_urnik = JSON.parse(urnik || '{}')

    for (var i in razredi) {

      var razred = razredi[i][1]
      if (!window.vsiRazredi.includes(razred)) continue

      var index = obj_urnik.predmeti.findIndex((x: any) => x.razred == razredi[i][1])
      var indexProf = obj_urnik.profesorji.findIndex((x: any) => x.razred == razredi[i][1])

      var ura = obj_urnik.profesorji[indexProf][dan][razredi[i][0]]

      if (ura.includes(',')) {
        ura = ura.replace(profesor, '')
        ura = ura.replace(',', '')
        obj_urnik.profesorji[indexProf][dan][razredi[i][0]] = ura
      } else {
        obj_urnik.predmeti[index][dan][razredi[i][0]] = 'Prosto';
        obj_urnik.profesorji[indexProf][dan][razredi[i][0]] = 'Prosto';
      }
    }

    var index = obj_urnik.urnikZaProf.findIndex((x: any) => x.profesor == profesor)
    for (var j = 0; j < 7; j++) obj_urnik.urnikZaProf[index][dan][j] = "Prosto"

    return obj_urnik

  }

  sprememba(data: any, event: any) {

    console.log(event, data)


    var urnik = window.urnik
    var dan = data.dan

   
    if (event == 'prostaUra') prostaUra()
    if (event == 'Sprememba') spremeni()
    if (event == 'potrdiProsto') potrdiProsto()

    function prostaUra() {
      var profesor = data.profesor
      var razred = data.razred
      var ura = data.ura
      
      var i = urnik.predmeti.findIndex((x: any) => x.razred == razred)
      if (i >= 0) urnik.predmeti[i][dan][ura] = "Prosto"
      var i = urnik.profesorji.findIndex((x: any) => x.razred == razred)
      if (i >= 0) urnik.profesorji[i][dan][ura] = "Prosto"
      var i = urnik.urnikZaProf.findIndex((x: any) => x.profesor == profesor)
      if (i >= 0) urnik.urnikZaProf[i][dan][ura] = "Prosto"
    }

    function spremeni() {
     
      if (data.profesor1 == data.profesor2) {
        var i = urnik.predmeti.findIndex((x: any) => x.razred == data.razred)
        if (i >= 0) urnik.predmeti[i][data.dan][data.ura] = data.predmet 
      }

      else {
        var i = urnik.urnikZaProf.findIndex((x: any) => x.profesor == data.profesor1)
        if (i >= 0) urnik.urnikZaProf[i][data.dan][data.ura] = 'Prosto'

        var i = urnik.urnikZaProf.findIndex((x: any) => x.profesor == data.profesor2)
        if (i >= 0) urnik.urnikZaProf[i][data.dan][data.ura] = data.razred

        var i = urnik.predmeti.findIndex((x: any) => x.razred == data.razred)
        if (i >= 0) urnik.predmeti[i][data.dan][data.ura] = data.predmet

        var i = urnik.profesorji.findIndex((x: any) => x.razred == data.razred)
        if (i >= 0) urnik.profesorji[i][data.dan][data.ura] = data.profesor2

        if (data.razred2.length != "Prosto" && data.razred2 != 'R' && data.razred != data.razred2) {
          var i = urnik.predmeti.findIndex((x: any) => x.razred == data.razred2)
          if (i >= 0) urnik.predmeti[i][data.dan][data.ura] = "Prosto"

          var i = urnik.profesorji.findIndex((x: any) => x.razred == data.razred2)
          if (i >= 0) urnik.profesorji[i][data.dan][data.ura] = "Prosto"
        }
      }
    }

    function potrdiProsto() {
      var i = urnik.predmeti.findIndex((x: any) => x.razred == data.razred)
      if (i >= 0) urnik.predmeti[i][data.dan][data.ura] = ''

      var i = urnik.profesorji.findIndex((x: any) => x.razred == data.razred)
      if (i >= 0) urnik.profesorji[i][data.dan][data.ura] = ''
    }
    
    return urnik
  }

  izbrisiSpremembe(dan: any) {
    var urnikStalen = JSON.parse(localStorage.getItem('urnik-stalen') || '{}')
    var urnik = window.urnik

    console.log(urnik)
    console.log(urnikStalen)

    for (var i in window.vsiRazredi) {
      var razred = window.vsiRazredi[i]
      var i1 = urnik.predmeti.findIndex((x: any) => x.razred == razred)
      var i2 = urnikStalen.predmeti.findIndex((x: any) => x.razred == razred)
      urnik.predmeti[i1][dan] = urnikStalen.predmeti[i2][dan]

      var i1 = urnik.profesorji.findIndex((x: any) => x.razred == razred)
      var i2 = urnikStalen.profesorji.findIndex((x: any) => x.razred == razred)
      urnik.profesorji[i1][dan] = urnikStalen.profesorji[i2][dan]
    }

    for (var i in window.vsiProfesorji) {
      var profesor = window.vsiProfesorji[i]
      var i1 = urnik.urnikZaProf.findIndex((x: any) => x.profesor == profesor)
      var i2 = urnikStalen.urnikZaProf.findIndex((x: any) => x.profesor == profesor)
      urnik.urnikZaProf[i1][dan] = urnikStalen.urnikZaProf[i2][dan]
    }
    return urnik
  }

  celodnevniIzlet(data: any) {
    
    var {razredi, profesorji, dnevi, dejavnost} = data
    var vsiRazredi = window.vsiRazredi

    var urnik = window.urnik
    
    for (var i in vsiRazredi) {
      
      var razred = vsiRazredi[i]

      for (var j in dnevi) {
        var dan = dnevi[j].toLowerCase()

        if (razredi.includes(razred)) {
          var index = urnik.predmeti.findIndex((x: any) => x.razred == razred)
          urnik.predmeti[index][dan].forEach((value: any, k: any) =>  urnik.predmeti[index][dan][k] = dejavnost) 
  
          var index = urnik.profesorji.findIndex((x: any) => x.razred == razred)
          urnik.profesorji[index][dan].forEach((value: any, k: any) =>  urnik.profesorji[index][dan][k] = dejavnost) 
        }

        var index = urnik.profesorji.findIndex((x: any) => x.razred == razred)

        urnik.profesorji[index][dan].forEach((profesor: any, k: any) => {
          if (profesor.includes(',')) {
            
            var vecProfesorjev = profesor.split(',')
            for (var p in vecProfesorjev) {
              if (profesorji.includes(vecProfesorjev[p])) {
                var index = urnik.profesorji.findIndex((x: any) => x.razred == razred)
                var novaUra = urnik.profesorji[index][dan][k].replace(vecProfesorjev[p], '')
                novaUra = novaUra.replace(',', '')
                novaUra = novaUra.trim()
                urnik.profesorji[index][dan][k] = novaUra
              }
            }
          } else if (profesorji.includes(profesor) && !razredi.includes(razred)) {
              var index = urnik.predmeti.findIndex((x: any) => x.razred == razred)
              urnik.predmeti[index][dan][k] = 'Prosto'

              var index = urnik.profesorji.findIndex((x: any) => x.razred == razred)
              urnik.profesorji[index][dan][k] = 'Prosto'
          }
        })
        
        
      }
    }
    for (i in vsiProfesorji) {
      var profesor = vsiProfesorji[i]
      for (var j in dnevi) {
        var dan = dnevi[j].toLowerCase();
        var index = urnik.urnikZaProf.findIndex((x: any) => x.profesor == profesor)
        urnik.urnikZaProf[index][dan].forEach((razred: any, k: any) => {
          if (razredi.includes(razred) && !profesorji.includes(profesor)) {
            urnik.urnikZaProf[index][dan][k] = 'Prosto'
          }
          else if (profesorji.includes(profesor)) {
            urnik.urnikZaProf[index][dan].forEach((razred: any, k: any) => urnik.urnikZaProf[index][dan][k] = dejavnost)
          }
        })
      }
    }

    return urnik
  }

  autoSprememba(data: any) {
    var urnik = window.urnik
    for (var i in data) {
      var razred = data[i].razred
      var dan = data[i].dan
      var ura = data[i].ura

      var index = urnik.predmeti.findIndex((x: any) => x.razred == razred)
      urnik.predmeti[index][dan][ura] = ''
      var index = urnik.profesorji.findIndex((x: any) => x.razred == razred)
      urnik.profesorji[index][dan][ura] = ''
    }
    return urnik
  }

  zamenjava(data: any) {
    console.log(data)
    var urnik = window.urnik
    var razred = data.prvaUra.razred

    // Zamenjava urnika profesorja
    var i = urnik.urnikZaProf.findIndex((x: any) => x.profesor == data.prvaUra.profesor)
    if (i >= 0) {
      urnik.urnikZaProf[i][data.dan][data.drugaUra.ura] = razred
      urnik.urnikZaProf[i][data.dan][data.prvaUra.ura] = ""
    }
    var i = urnik.urnikZaProf.findIndex((x: any) => x.profesor == data.drugaUra.profesor)
    if (i >= 0) {
      urnik.urnikZaProf[i][data.dan][data.prvaUra.ura] = razred
      urnik.urnikZaProf[i][data.dan][data.drugaUra.ura] = ""
    }

    var i = urnik.predmeti.findIndex((x: any) => x.razred == razred)
    if (i >= 0) {
      urnik.predmeti[i][data.dan][data.prvaUra.ura] = data.drugaUra.predmet
      urnik.predmeti[i][data.dan][data.drugaUra.ura] = data.prvaUra.predmet
    }

    var i = urnik.profesorji.findIndex((x: any) => x.razred == razred)
    if (i >= 0) {
      urnik.profesorji[i][data.dan][data.prvaUra.ura] = data.drugaUra.profesor
      urnik.profesorji[i][data.dan][data.drugaUra.ura] = data.prvaUra.profesor
    }

    if (data.dodatnaSprememba) {
      var i = urnik.predmeti.findIndex((x: any) => x.razred == data.podatek.ura1)
      if (i >= 0) urnik.predmeti[i][data.dan][data.drugaUra.ura] = 'Prosto'

      var i = urnik.profesorji.findIndex((x: any) => x.razred == data.podatek.ura1)
      if (i >= 0) urnik.profesorji[i][data.dan][data.drugaUra.ura] = 'Prosto'

      var i = urnik.predmeti.findIndex((x: any) => x.razred == data.podatek.ura2)
      if (i >= 0) urnik.predmeti[i][data.dan][data.prvaUra.ura] = 'Prosto'

      var i = urnik.profesorji.findIndex((x: any) => x.razred == data.podatek.ura2)
      if (i >= 0) urnik.profesorji[i][data.dan][data.prvaUra.ura] = 'Prosto'

    }

    return urnik
  }

  kopirajMaile(data: any) {
    var mails = ""
    if (!data.k) {
      var razredi = data.razredi
      for (var i = 0; i < razredi.length; i++) {
        var text = razredi[i].toLowerCase() + "@preseren.edu.it"
        mails += text + ','
    }
    } else {
      var mailiProfesorjev = JSON.parse(localStorage.getItem('maili')||'{}')
      var profesorji = data.profesorji
      for (var i = 0; i < profesorji.length; i++) {
        var index = mailiProfesorjev.findIndex((x: any) => x.profesor == profesorji[i])
        var text2 = mailiProfesorjev[index].mail
        mails += text2 + ','
      }
    }
    mails = mails.slice(0,-1) 
    return mails
  }
}
