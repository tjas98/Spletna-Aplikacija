import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VnosUrnikaService {

  constructor() { }

  vnesiUrnik(urnik: any, urnik2: any) {
   
    var ure: any = [], razredi: any = [], profesorji: any = [];

    for (var i = 1; i < urnik[1].length; i++) {
      if (urnik[1][i] == null) break
      ure.push(urnik[1][i])
    }

    for (var i = 2; i < urnik.length; i++) {
      var profesor = urnik[i][0]
      if (profesor != undefined) profesorji.push(profesor)
    }

    for (var i = 0; i < urnik2.length; i++) {
      var x = urnik2[i][0];
      if (x != null && x != "RAZRED" && x != undefined && x != "RAZ") razredi.push(x.toUpperCase())
    }

    const steviloUr = ure.length;

    var urnikProfesorji: any = [];
    var urnikDijaki: any = [];

    profesorji.forEach((profesor: any) => {
      urnikProfesorji[profesor] = {
        pon: Array(steviloUr).fill("Prosto"),
        tor: Array(steviloUr).fill("Prosto"),
        sre: Array(steviloUr).fill("Prosto"),
        cet: Array(steviloUr).fill("Prosto"),
        pet: Array(steviloUr).fill("Prosto")
      }
    })

    razredi.forEach((razred: any) => {
      urnikDijaki[razred] = {
        pon: Array(steviloUr).fill(""),
        tor: Array(steviloUr).fill(""),
        sre: Array(steviloUr).fill(""),
        cet: Array(steviloUr).fill(""),
        pet: Array(steviloUr).fill("")
      }
    })

    const dni = ["pon", "tor", "sre", "cet", "pet"]

    for (var i = 2; i < urnik.length; i++) {
      var profesor = urnik[i][0]

      if (profesor == undefined) break

      var indexDan = 0;

      for (var j = 0; j < urnik[i].length; j += (steviloUr + 2)) {
        var dan = dni[indexDan];

        var urnikDneva = urnik[i].slice(j, j + (steviloUr + 2));
        urnikDneva.shift()

        urnikDneva.forEach((ura: any, index: any) => {

          (ura != "" || ura != " " || ura != null) ? urnikProfesorji[profesor][dan][index] = ura.trim() : urnikProfesorji[profesor][dan][index];

        })
        indexDan += 1;
      }
    }

    for (var i = 2; i < urnik2.length; i++) {
      var razred = urnik2[i][0].toUpperCase();

      if (razred == undefined) break

      var indexDan = 0

      for (var j = 0; j < urnik[i].length; j += (steviloUr + 2)) {
        var dan = dni[indexDan]
        var urnikDneva = urnik2[i].slice(j, j + (steviloUr + 2))
        urnikDneva.shift()

        urnikDneva.forEach((ura: any, index: any) => {
          (ura != null) ? urnikDijaki[razred][dan][index] = ura.trim() : urnikDijaki[razred][dan][index]
        })
        indexDan += 1;
      }
    }

    var urnikRazrediProfesorji: any = [];

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

    profesorji.forEach((profesor: any) => {
      var urnik = urnikProfesorji[profesor]

      for (var i = 0; i < steviloUr; i++) {
        dni.forEach(dan => {
          var solskaUra = urnik[dan][i].toUpperCase()
          solskaUra = solskaUra.replace("*", "");
          if (razredi.some((a: any) => solskaUra.includes(a))) {
            if (solskaUra.includes(',')) {
              var vecRazredov = solskaUra.split(',')
              vecRazredov.forEach((razred: any) => {
                razred = razred.replace(/ /g, '');
                urnikRazrediProfesorji[razred][dan][i] = profesor;
              })

            }
            else {

              if (razredi.includes(solskaUra)) {
                var ura = urnikRazrediProfesorji[solskaUra][dan][i];
                (ura.length > 1) ? urnikRazrediProfesorji[solskaUra][dan][i] += "," + profesor : urnikRazrediProfesorji[solskaUra][dan][i] = profesor;
              }
            }
          }
        })
      }

    })

    var tab1: any = [], tab2: any = [], tab3: any = []

    profesorji.forEach((profesor: any) => {
      var ob1: any = {}
      dni.forEach((dan: any) => {
        ob1[dan] = urnikProfesorji[profesor][dan]
      })
      ob1.profesor = profesor
      tab1.push(ob1)
    })



    razredi.forEach((razred: any) => {
      var ob2: any = {}, ob3: any = {}
      dni.forEach((dan: any) => {
        ob2[dan] = urnikRazrediProfesorji[razred][dan]
        ob3[dan] = urnikDijaki[razred][dan]
      })
      ob2.razred = razred
      ob3.razred = razred
      tab2.push(ob2)
      tab3.push(ob3)
    })

    return {
      urnikRazredaPredmeti: tab3,
      urnikRazredaProfesorji: tab2,
      urnikProfesorja: tab1
    }

  }

  preglejUrnik(urnik: any, tipUrnika: any) {

    const dni = ["pon", "tor", "sre", "cet", "pet"]
    
    var urnikRazreda = urnik.urnikRazredaPredmeti;
    var urnikRazredaProfesorji = urnik.urnikRazredaProfesorji;

    var tabelaNapak: any = []

    var urnikProfesorja = urnik.urnikProfesorja

    if (tipUrnika != 'stalen') {
      var vsiProfesorji: any = []
      urnikProfesorja.forEach((r: any) => {
        vsiProfesorji.push(r.profesor)
      })

      const razlike = vsiProfesorji.filter((element: any) => !window.vsiProfesorji.includes(element));
      if (razlike.length > 0) return {
        napaka: "noProf",
        razlike: razlike
      }
    }

    urnikRazreda.forEach((ur: any) => {
      dni.forEach(dan => {
        for (var i = 0; i < ur[dan].length; i++) {
          if (ur[dan][i] != "") {
            var razred = ur.razred;
            var index = urnikRazredaProfesorji.findIndex((x: any) => x.razred == razred)
            if (urnikRazredaProfesorji[index][dan][i].length < 1) tabelaNapak.push({
              razred: razred,
              dan: dan, 
              ura: i+1
            })
          }
        }
      })
    })

   

    if (tabelaNapak.length > 0) return {
      napaka: "prazneUre",
      prazneUre: tabelaNapak
    };

   return false;

  }


  
}
