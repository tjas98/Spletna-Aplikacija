import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AutoService {

  urnikProf: any;
  spremembe: any[] = [];
  dan: any

  constructor() { }


  naredi(razredi: any, urnik: any, dan: any) {
    this.spremembe = []
    this.dan = dan.toLowerCase()
    this.urnikProf = window.urnik.urnikZaProf

    for (var razred of razredi) {
      
      var tabela = urnik[razred]
      var tabelaPredmeti = urnik[razred+"predmet"]
      
     
      var koliko = tabela.filter((x: any) => x=="Prosto").length
      
      
      // Prve ure
      for (var i = 0; i < koliko; i++) {
        var ura = tabela.indexOf("Prosto")
        // Prve ure
        if (tabela[ura-1] == undefined && ura > -1) {
          tabela[ura] = ""
          tabelaPredmeti[ura] = ""
          this.shraniSpremembo(ura, razred, this.dan)
        }
        else {
          if (tabela[ura-1] == ""  && ura > -1) {
            tabela[ura] = ""
            tabelaPredmeti[ura] = ""
            this.shraniSpremembo(ura, razred, this.dan)
          }
        }
      }

      // Zadnje ure
      for (var i = 0; i < koliko; i++ ) {
        var ura = tabela.lastIndexOf("Prosto")
        console.log(ura)
        
        if (tabela[ura+1] == undefined  && ura > -1) {
          tabela[ura] = ""
          tabelaPredmeti[ura] = ""
          this.shraniSpremembo(ura, razred, this.dan)
        }
        else {
          
          if (tabela[ura+1] == ""  && ura > -1) {
            tabela[ura] = ""
            tabelaPredmeti[ura] = ""
            this.shraniSpremembo(ura, razred, this.dan)
          }
        }

      }
    }

    return this.spremembe
    
  }



  najdi(prof: any, ura: any, razred: any, predmeti: any) {
    var prvi = prof[0]
    var zadnji = prof[prof.length-1]

    console.log(predmeti)

    var i = this.urnikProf.findIndex((x: any) => x.profesor === prvi)
    console.log()
    if (this.urnikProf[i][this.dan][ura] == "Prosto") {
      console.log("Je Prost, ZAMENJAVA")

      var s = {
        tip: 1,
        ura1: 0,
        ura2: ura,
        razred: razred,
        predmet1: "prosto",
        predmet2: predmeti[0],
        profesor1: "prosto",
        profesor2: prvi

      }
      

    }
  }

  
  shraniSpremembo(ura: any, razred: any, dan: any) {
    dan = this.dan

    var s = {
      ura: ura,
      razred: razred,
      dan: dan
    }

    this.spremembe.push(s)
  }

}
