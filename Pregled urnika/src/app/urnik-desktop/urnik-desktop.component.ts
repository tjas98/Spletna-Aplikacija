import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebService } from '../web.service';
import { DateAdapter } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgModel } from '@angular/forms';


@Component({
  selector: 'app-urnik-desktop',
  templateUrl: './urnik-desktop.component.html',
  styleUrl: './urnik-desktop.component.css'
})
export class UrnikDesktopComponent {

  vsiRazredi = window.vsiRazredi;
  vsiProfesorji = window.vsiProfesorji;
  urnik = window.urnik;

  izbraniProfesor: any;

  prostDan: any;
  dan: any;

  urnikProfesorja = window.urnik.urnikZaProf
  urnikPredmeti = window.urnik.predmeti;
  urnikProfesorji = window.urnik.profesorji;
  dnevniUrnik: any;

  dni = ["pon", "tor", "sre", "cet", "pet"]
  odmori: any;
  trajanjeOdmorov: any;
  trajanjeUr: any;
  ureStevilka: any;
  ure: any;
  steviloUr: any;
  odmor = false;
  ura: any;
  uraOdmora: any;
  text: any;
  loaded = false;

  izbraniRazred: any;
  urnikRazreda: any;
  urnikProfesorjev: any;

  uraKasneje: any;

  izbranUrnik = "Posodobljen urnik"

  danes: any;
  value: any;
  datum: any = [];

  autoPos = true;

  weekend = window.weekend;

  myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    return day !== 0 && day !== 6;
  };

  constructor(
    private web: WebService,
    private dateAdapter: DateAdapter<Date>,
    private snackBar: MatSnackBar
  ){}

  ngOnInit() {
    this.dan = window.dan;
    this.dateAdapter.setLocale('sl');
    this.dateAdapter.getFirstDayOfWeek = () => { return 1; }
    this.odmori = window.odmori;
    this.trajanjeOdmorov = window.trajanjeOdmorov;
    this.trajanjeUr = window.trajanjeUr;
    this.ureStevilka = window.ureStevilka;
    this.dan = window.dan;
    this.ure = window.ure;
    this.steviloUr = window.steviloUr;
    this.ura = window.uraVTeku
    this.uraKasneje = parseInt(this.ura) + 1
    this.loaded = true;

    this.danes = window.danes;
    this.value = window.danes;
    
    this.najdiUro(window.ura)

    setInterval(() => {
      this.najdiUro(window.ura)
    }, 5000)
    
    setInterval(() => {
      if (this.autoPos) {
        this.posodobiUrnik();
        if (this.izbraniRazred) this.najdiUrnikRazreda()
        if (this.izbraniProfesor) this.najdiUrnikProfesorja()
      }

    }, 30000)
  }

  click(x: any) {
    if (x != "X" && x != "R") {
      this.izbraniRazred = x.toUpperCase()
      this.najdiUrnikRazreda()
    }
    
  }

  click2(x: any) {
    if (!x.includes(",") && x.length > 0) {
      this.izbraniProfesor = x
      this.najdiUrnikProfesorja()
    }
  }

  vrniseNaDanes() {
    this.value = this.danes
    const date = new Date();
    this.izberiDatum(date)
  }

  posodobiUrnik() {
    this.urnikProfesorja = window.urnik.urnikZaProf
    this.urnikPredmeti = window.urnik.predmeti;
    this.urnikProfesorji = window.urnik.profesorji;
  }

  zamenjajUrnik(x: any) {
    this.izbranUrnik = x
    this.izbraniProfesor = "";
    this.izbraniRazred = "";
    
    if (x == 'Stalen urnik') {
      this.urnikProfesorja = window.stalen.urnikZaProf
      this.urnikPredmeti = window.stalen.predmeti;
      this.urnikProfesorji = window.stalen.profesorji;
    } else {
      this.urnikProfesorja = window.urnik.urnikZaProf
      this.urnikPredmeti = window.urnik.predmeti;
      this.urnikProfesorji = window.urnik.profesorji;
    }
  }

  najdiUrnikProfesorja() {
    
    let index = this.urnikProfesorja.findIndex((x: any) => x.profesor === this.izbraniProfesor);
    this.urnik = this.urnikProfesorja[index]
    for (var i in this.urnik[this.dan]) {
      if (this.urnik[this.dan][i] != "Prosto") {
        this.prostDan = false
        break;
      }
      this.prostDan = true;
    }
    this.dnevniUrnik = this.urnikProfesorja[index][this.dan]
   
  }

  najdiUrnikRazreda() {
    
    let index = this.urnikPredmeti.findIndex((x: any) => x.razred === this.izbraniRazred);
    this.urnikRazreda = this.urnikPredmeti[index]
    let index2 = this.urnikProfesorji.findIndex((x: any) => x.razred === this.izbraniRazred);
    this.urnikProfesorjev = this.urnikProfesorji[index2]
  }

  najdiUro(d: any) {
    this.weekend = window.weekend;
    this.ura = -5;
    for (var i in this.ureStevilka) {
      if (d >= this.ureStevilka[i][0] && d <= this.ureStevilka[i][1]) {
        var u = parseInt(i) + 1
        window.uraVTeku = i;
        this.text = "V teku je " + u + ". ura"
        this.ura = i;
        this.odmor = false;
        this.uraKasneje = parseInt(this.ura) + 1
      }
    }
    for (var i in this.odmori) {
      if (d >= this.odmori[i][0] && d < this.odmori[i][1]) {
        var u = parseInt(i) + 1
        this.text = "V teku je " + u + ". odmor"
        this.uraOdmora = i;
        this.odmor = true;
      }
    }
  }

  nalozi() {
    window.location.reload();
  }

  izberiDatum(e: any) {
    this.datum = []
    this.value = e.value.toString().split(' ')[2] + " " + e.value.toString().split(' ')[1]
    var a = e.value.toString();
    var celTeden = dates(a)

    function dates(current: any) {
      current = new Date(current)
      var week = new Array();
      var x = current.toString().split(" ")[0]
      if (x == "Sun" || x == 'Sat') current.setDate((current.getDate() - current.getDay() + 1 + 7));
      else current.setDate((current.getDate() - current.getDay() + 1));
      for (var i = 0; i < 7; i++) {
        week.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
      return week;
    }

    for (var i in celTeden) {
      var datum = celTeden[i].toString()
      var mesec = datum.split(" ")[1]
      var dan = datum.split(" ")[2]
      this.datum.push(dan + " " + mesec)
    }

    var d = celTeden[0].toString().split(" ")[2] + "-" + celTeden[0].toString().split(" ")[1] + 
     "-" + celTeden[0].toString().split(" ")[3]

     this.web.get('vrniDatumUrnik/potrjen/'+d).subscribe((r: any) => {
      this.loaded = true;
      if (r.status == 'success') {
        
        this.urnikProfesorja = r.urnik.urnikZaProf
        this.urnikPredmeti = r.urnik.predmeti,
        this.urnikProfesorji = r.urnik.profesorji;
        this.izbraniProfesor = "";
        this.izbraniRazred = "";
        this.odpriSporocilo(r.odgovor, r.status)
        
      } else {
        this.odpriSporocilo(r.odgovor, r.status)
      }
    })

  }

 
  odpriSporocilo(text: any, status: any) {
    
    this.snackBar.open(text, 'x',{
      duration: 5000,
      panelClass: status
    })
  }
    
}
