import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { WebService } from 'src/app/services/web.service';
import { Observable, forkJoin } from 'rxjs'
import { UrnikService } from 'src/app/services/urnik.service';
import { MatDialog } from '@angular/material/dialog';
import { PotrdiComponent } from '../potrdi/potrdi.component';
import { LocalService } from 'src/app/services/local.service';
import { IzletComponent } from '../izlet/izlet.component';
import { ZamenjavaComponent } from '../zamenjava/zamenjava.component';
import { OknoSpremembaComponent } from '../okno-sprememba/okno-sprememba.component';
import { MatSnackBar } from '@angular/material/snack-bar';


import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { ExcelService } from 'src/app/services/excel.service';
import * as XLSX from 'xlsx-js-style'
import { AutoService } from 'src/app/services/auto.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { Subscription } from 'rxjs'
import { ShareService } from 'src/app/services/share.service';
import { FormControl } from '@angular/forms';
import { HtmlParser } from '@angular/compiler';
import { json } from 'body-parser';



@Component({
  selector: 'app-sprememba',
  templateUrl: './sprememba.component.html',
  styleUrls: ['./sprememba.component.css']
})
export class SpremembaComponent {



  autosave = false
  urnikBefore = true

  teden = ['Pon', 'Tor', 'Sre', 'Cet', 'Pet']
  tedenDolgo = ['Ponedeljek', 'Torek', 'Sreda', 'Četrtek', 'Petek']

  response: any;

  steviloUr: any;

  uporabljenUrnik = "Izberi urnik"
  vsiRazredi = window.vsiRazredi;
  vsiProfesorji = window.vsiProfesorji;
  ure = window.ure;

  dan: any;

  excel = false;
  pdf = false;

  times: any;


  indeksi: any;

  izbraniProfesorji: any[] = [];
  izbraniRazredi: any[] = [];

  objektProfesorja: any;
  urnikProfesorja: any;
  objektRazredov: any;

  prostiNaDan: any;
  prostiRazredi: any;

  loading = false;
  loaded = false;

  zamenjava = false;

  prviIzbran = {
    profesor: " ",
    ura: -1,
    predmet: " ",
    razred: " "
  };

  drugiIzbran = {
    profesor: " ",
    ura: -1,
    predmet: " ",
    razred: " "
  };

  indexProsteUre = -1;

  izbranUrnik = ""

  urnikRazred: any;
  urnikProfesor: any;

  autoSpremembe: any;

  mobile = false;

  odprto = false;
  podatekUre = {
    ura: -1,
    razred: "",
    predmet: "",
    profesor: ""
  }

  width: any;

  datum: any = [];

  jeShranjen = false;

  shranjenUrnik: any = {};

  zacetekTeden = window.zacetekTedna;

  datumShranjen = false;
  datumPotrjen = false;

  prikazStalnegaUrnika = []
  prikaziStalenUrnik = false
  stalenProfesor = ""



  constructor(
    private web: WebService,
    private urnik: UrnikService,
    private dialog: MatDialog,
    private local: LocalService,
    private snackBar: MatSnackBar,
    private exc: ExcelService,
    private auto: AutoService,
    private clipboard: Clipboard,
    private router: Router,
    private http: HttpClient,
    private share: ShareService

  ) {

    this.share.get().subscribe(r => {
      this.onValChange(r)
    })

    this.share.pokaziSporocilo().subscribe((r: any) => {

      this.zacetekTeden = r.d;
      this.onValChange(r.dan)
      console.log(r)
      this.datumPotrjen = r.x.po;
      this.datumShranjen = r.x.sh;
      this.odpriSporocilo(r.x.odgovor, r.x.status)
    })

  }



  ngOnInit() {

    if (!window.admin) window.location.reload()

    if (!localStorage.getItem('urnik-before')) this.urnikBefore = false

    this.mobile = window.mobile

    if (!this.mobile) this.width = "40vw"
    else this.width = "100vw"

    if (window.navigator.userAgent.includes("iPhone") ||
      window.navigator.userAgent.includes("Android") ||
      window.navigator.userAgent.includes("iPad")) this.mobile = true;

    this.urnikProfesor = window.urnik.urnikZaProf
    this.urnikRazred = window.urnik.predmeti

    this.autosave = (localStorage.getItem('autosave') == 'true')

    const d = new Date();
    let day = d.getDay();
    this.dan = this.najdiDan(day)

    this.uporabljenUrnik = window.uporabljenUrnik;

    this.steviloProstihRazredov()
    this.loaded = true;
  }

  vrniText = (profesor: any) => {
    this.stalenProfesor = profesor;
    var i = window.stalen.urnikZaProf.findIndex((x: any) => x.profesor == profesor)
    this.prikazStalnegaUrnika = window.stalen.urnikZaProf[i][this.dan]
    this.prikaziStalenUrnik = true;

  }

  cons() {
    console.log(this.urnikProfesorja)
  }


  shraniZaDan(k: any, niz: any) {
    var dan = window.zacetekTedna.split('-')[0]
    var mesec = window.zacetekTedna.split('-')[1]

    var dan1 = window.konecTedna.split('-')[0]
    var mesec1 = window.konecTedna.split('-')[1]

    const di = this.dialog.open(PotrdiComponent, {
      width: this.width,
      data: {
        sporocilo: niz + ' urnik za teden: ' + dan + " " + mesec + "- " + dan1 + " " + mesec1
      }
    });

    di.afterClosed().subscribe((r) => {
      if (r) {
        var urnik = JSON.parse(localStorage.getItem('urnik-zacasen') || '{}')
        if (k == 0) {
          this.web.put('shrani', {
            urnik: urnik,
            datum: window.zacetekTedna
          }).subscribe((r: any) => {
            this.odpriSporocilo(r.odgovor, r.status)
          })
        } else {
          this.web.put('potrdi', {
            urnik: urnik,
            datum: window.zacetekTedna
          }).subscribe((r: any) => {
            this.odpriSporocilo(r.odgovor, r.status)
          })
        }

      }
    })
  }

  toggleAutosave() {
    this.autosave = !this.autosave
    localStorage.setItem('autosave', this.autosave.toString())
  }



  uporabljajShranjen(x: any) {
    this.loading = true;
    this.web.get(`uporabi-urnik-datum?datum=${window.zacetekTedna}&urnik=${x}`).subscribe((r: any) => {
      this.odpriSporocilo(r.odgovor, r.status)
      if (r.status == 'success') {

        this.uporabljenUrnik = r.urnik + " urnik za " + this.zacetekTeden;
        this.updateUrnik();
      }
    })
  }

  shranjenTeden() {
    this.web.get('urnik-datum?datum=' + window.zacetekTedna).subscribe((r: any) => {
      this.odpriSporocilo(r.odgovor, r.status)
      if (r.status == 'success') {


        this.urediProfesorje()
        this.urediRazrede()
        this.steviloProstihRazredov()
      }
    })
  }


  logout() {
    localStorage.removeItem("admin")
    window.location.reload()
  }

  updatePodatki() {
    this.urediProfesorje()
    this.urediRazrede()
    this.steviloProstihRazredov()
    this.loading = false;
  }

  updateUrnik() {
    return new Promise<void>((resolve, reject) => {
      this.web.get("urnik-vseh").subscribe((r: any) => {
        window.urnik = r;

        this.urnikRazred = r.predmeti;
        this.urnikProfesor = r.urnikZaProf;

        console.log(this.urnikProfesor)


      }).add(() => {
        this.updatePodatki();
        resolve()
      })
    })


  }

  najdiDan(d: any) {
    if (d == 1) return "Pon"
    if (d == 2) return "Tor"
    if (d == 3) return "Sre"
    if (d == 4) return "Cet"
    if (d == 5) return "Pet"

    return "Pon"
  }

  mail(x: any) {
    if (x == 0) var maili = this.local.kopirajMaile({ k: 0, razredi: this.izbraniRazredi })
    else var maili = this.local.kopirajMaile({ k: 1, profesorji: this.izbraniProfesorji })

    this.clipboard.copy(maili)
    this.odpriSporocilo("Seznam mailov je kopiran", "success")




  }

  pojdiNaUrejanje() {
    this.router.navigateByUrl('urejanje')
  }

  pokaziImeProfesorja(profesor: any) {
    this.snackBar.open(profesor.toUpperCase(), 'Zapri', {

      duration: 3000
    })
  }

  sprememba(razred: any, profesor: any, predmet: any, ura: any) {


    const mod = this.dialog.open(OknoSpremembaComponent, {
      maxWidth: this.width,
      maxHeight: '95vh',
      minWidth: this.width,
      data: {
        ura: ura + 1,
        dan: this.dan.toLowerCase(),
        profesor: profesor,
        razred: razred,
        predmet: predmet,
        vsiProfesorji: this.vsiProfesorji
      }
    })


    mod.afterClosed().subscribe(r => {
      if (r) {
        var urnik = this.local.sprememba(r.podatki, r.event)
        this.localUpdate(urnik)
      }
    })

  }

  shraniPotrdiUrnik(storitev: any, niz: any, niz2: any) {
    const di = this.dialog.open(PotrdiComponent, {
      width: this.width,
      data: {
        sporocilo: "Hočete " + niz + " urnik?"
      }
    });

    di.afterClosed().subscribe((result) => {
      if (result) {
        this.loading = true;
        this.web.get(storitev).subscribe((r: any) => {
          setTimeout(() => {
            this.loading = false;
            this.odpriSporocilo(r.odgovor, r.status)
          }, 1500)
        })
      }
    })
  }

  zamenjajUrnik(urnik: any) {

    this.loading = true;
    if (urnik == 2) {
      var uporabljenUrnik = JSON.parse(localStorage.getItem('urnik-stalen') || '{}')
      this.localUpdate(uporabljenUrnik)
      this.uporabljenUrnik = "Stalen urnik"

    } else {

      this.web.get(`urnik?teden=${window.zacetekTedna}&urnik=${urnik}`).subscribe((r: any) => {
        this.odpriSporocilo(r.odgovor, r.status)
        if (r.status == 'success') {
          console.log(r)
          this.uporabljenUrnik = r.tip + " urnik za " + this.zacetekTeden;
          this.localUpdate(r.urnik)
        }
      })
    }





  }

  izberiVse() {
    this.loading = true;
    this.izbraniProfesorji = new Array(this.vsiProfesorji.length);
    for (var j = 0; j < this.izbraniProfesorji.length; j++) this.izbraniProfesorji[j] = this.vsiProfesorji[j];

    this.izbraniRazredi = new Array(this.vsiRazredi.length);
    for (var j = 0; j < this.izbraniRazredi.length; j++) this.izbraniRazredi[j] = this.vsiRazredi[j];

    //this.updateUrnik().then(()=>{this.loading = false})
    this.localUpdate(window.urnik)
  }

  izlet() {



    const izlet = this.dialog.open(IzletComponent, {
      width: this.width,
      panelClass: "custom-modalbox"
    })

    izlet.afterClosed().subscribe(r => {
      if (r) {
        var urnik = this.local.celodnevniIzlet(r.podatki)
        this.localUpdate(urnik)
      }
    })


  }

  shraniExcel() {
    this.excel = true;
    const di = this.dialog.open(PotrdiComponent, {
      width: this.width,
      data: {
        sporocilo: "Shrani urnik v excel"
      }
    });

    di.afterClosed().subscribe(r => {
      if (r) {
        let element = document.getElementById('excel-table');
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element, { raw: true });

        let element2 = document.getElementById('excel-table2');
        const ws2: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element2, { raw: true });

        console.log(ws)

        var new_ws = this.exc.styleExcel(ws)
        var new_ws2 = this.exc.styleExcelRazredi(ws2)


        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, new_ws, 'PROFESORJI');
        XLSX.utils.book_append_sheet(wb, new_ws2, 'RAZREDI');
        XLSX.writeFile(wb, "Urnik.xlsx", { cellStyles: true });
        this.excel = false;
      }
    })



  }

  openSnackBar(predmet: any, profesor: any, ura: any, razred: any) {

    if (!this.zamenjava) {
      if (predmet == "Prosto") {
        this.indexProsteUre = ura - 1;
        var odg = this.urnik.urnikProfesorjevProsto(razred, this.dan.toLowerCase())
        this.urnikProfesorja = odg.objekt;
        this.izbraniProfesorji = odg.prof;
      }

      this.podatekUre.razred = razred
      this.podatekUre.predmet = predmet.toUpperCase()
      this.podatekUre.profesor = profesor
      this.podatekUre.ura = ura
      this.odprto = true;
    } else {
      this.preglejIzbraneProfesorje(predmet, profesor, razred, ura - 1)
    }
  }

  posljiNotifico(x: any) {


    if (x == 1) {
      this.web.post('notifica', {
        profesorji: this.izbraniProfesorji,
        razredi: this.izbraniRazredi,
        urnik: this.urnikProfesorja,
        urnik2: this.objektRazredov,
        naslov: "Sprememba urnika za " + window.izbranDan,
        k: 1
      }).subscribe((r: any) => {
        this.odpriSporocilo(r.odgovor, r.status)
      })

    }
    if (x == 0) {
      this.web.post('notifica', {
        razredi: this.izbraniRazredi,
        urnik2: this.objektRazredov,
        naslov: "Sprememba urnika za " + window.izbranDan,
        k: 0
      }).subscribe((r: any) => {
        this.odpriSporocilo(r.odgovor, r.status)
      })
    }
  }

  posljiMail(x: any) {
    this.pdf = true;
    const di = this.dialog.open(PotrdiComponent, {
      width: this.width,
      data: {
        sporocilo: "Pošlji spremembe po mailu"
      }
    })

    di.afterClosed().subscribe(r => {
      if (r) {
        const doc = new jsPDF();
        autoTable(doc, {
          theme: 'grid',
          styles: { cellWidth: 'auto', halign: 'center', minCellWidth: 10 },
          startY: 5,
          html: "#p1"
        })

        var podatek = this.izbraniRazredi

        if (x == 1) {
          let finalY = (doc as any).lastAutoTable.finalY;
          autoTable(doc, {
            theme: 'grid',
            styles: { cellWidth: 'auto', halign: 'center', minCellWidth: 10 },
            startY: finalY + 5,
            html: "#p"
          })

          podatek = this.izbraniProfesorji;
        }

        var formData = new FormData();
        formData.append('pdf', doc.output("blob"));
        this.loading = true;
        this.web.post('mail-poslji/' + this.dan + "/" + x + "/" + podatek, { data: formData }).subscribe((rezultat: any) => {
          this.loading = false;
          this.odpriSporocilo(rezultat.odgovor, rezultat.status)
        })
      }
    })
  }

  odpriSporocilo(text: any, status: any) {
    this.loading = false;
    this.snackBar.open(text, 'Zapri', {
      duration: 5000,
      panelClass: status
    })
  }

  shraniPDF() {
    this.pdf = true;

    const di = this.dialog.open(PotrdiComponent, {
      width: this.width,
      data: {
        sporocilo: "Shrani urnik v pdf"
      }
    });

    di.afterClosed().subscribe((r) => {
      if (r) {
        const doc = new jsPDF();
        autoTable(doc, {
          theme: 'grid',
          styles: { cellWidth: 'auto', halign: 'center', minCellWidth: 10 },
          startY: 5,
          html: "#p"
        })
        doc.save('Urnik profesorji za ' + this.dan.toLowerCase());

        const doc2 = new jsPDF();
        autoTable(doc2, {
          theme: 'grid',
          styles: { cellWidth: 'auto', halign: 'center', minCellWidth: 10 },
          startY: 5,
          html: "#p1"
        })
        doc2.save('Urnik dijaki za ' + this.dan.toLowerCase());
        this.pdf = false;
      }
    })


  }


  izbrisiSpremembe() {


    const di = this.dialog.open(PotrdiComponent, {
      width: this.width,
      data: {
        sporocilo: "Izbriši vse spremembe za " + this.dan.toLowerCase()
      }
    });

    di.afterClosed().subscribe((r) => {
      if (r) {
        var urnik = this.local.izbrisiSpremembe(this.dan.toLowerCase())
        this.localUpdate(urnik)

      }
    })
  }

  najdiBarvo(prof: any, razred: any, j: any) {
    //var i = this.higlightProfesor.indexOf(prof)
    var dan = this.dan.toLowerCase();

    var index = window.urnik.predmeti.findIndex((x: any) => x.razred == razred);
    var zamenjan = window.urnik.predmeti[index][dan][j];
    index = window.stalen.predmeti.findIndex((x: any) => x.razred == razred);
    var stalen = window.stalen.predmeti[index][dan][j]

    index = window.urnik.profesorji.findIndex((x: any) => x.razred == razred);
    var zamenjan2 = window.urnik.profesorji[index][dan][j];
    index = window.stalen.profesorji.findIndex((x: any) => x.razred == razred);
    var stalen2 = window.stalen.profesorji[index][dan][j]

    if (zamenjan != stalen || zamenjan2 != stalen2) if (zamenjan != 'Prosto') return '#cfd7e3'

    if (prof == 'Prosto') return '#F44336'
    else return '#f0f2f5'
  }

  prikaziProsteUre() {
    var odg = this.urnik.najdiProste(this.dan.toLowerCase())
    this.izbraniRazredi = odg.razredi;
    this.prostiRazredi = odg.stevec;
    this.objektRazredov = this.urnik.urnikIzbranihRazredov(this.izbraniRazredi, this.dan.toLowerCase());
  }

  izbrisiProfesorja() {

    const di = this.dialog.open(PotrdiComponent, {
      width: this.width,
      data: {
        sporocilo: "Izberi profesorja, ki bo v " + this.dan + " " + window.izbranDan + " odsoten",
        odsoten: true
      }
    })

    di.afterClosed().subscribe(r => {
      if (r) {
        var urnik = this.local.odsoten(r.profesor, this.dan.toLowerCase())
        this.localUpdate(urnik)
      }
    })
  }

  nazaj() {
    localStorage.setItem('urnik-zacasen', localStorage.getItem('urnik-before') || '{}')
    var obj = JSON.parse(localStorage.getItem('urnik-before') || '{}')
    this.localUpdate(obj)
  }



  localUpdate(urnik: any) {

    //localStorage.setItem('urnik-before', localStorage.getItem('urnik-zacasen') || '{}')

    var urnikString = JSON.stringify(urnik)
    localStorage.setItem('urnik-zacasen', urnikString)

    this.urnikRazred = urnik.predmeti
    this.urnikProfesor = urnik.urnikZaProf

    window.urnik = urnik

    if (this.autosave) {
      this.web.put('shrani', {
        urnik: urnik,
        datum: window.zacetekTedna
      }).subscribe((r: any) => {
        this.odpriSporocilo(r.odgovor, r.status)
      })
    }

    this.updatePodatki()

  }

  steviloProstihRazredov() {
    var odg = this.urnik.najdiProste(this.dan.toLowerCase())
    this.prostiNaDan = odg.naDan;
    this.prostiRazredi = odg.stevec;
    this.share.posljiProste(this.prostiNaDan)

  }

  toggleZamenjava() {
    this.zamenjava = !this.zamenjava;
    this.odprto = false;
    this.izbrisiIzbranega(1)
    this.izbrisiIzbranega(2)
  }

  barvaUrnikProfesorja(profesor: any, i: any) {
    if (profesor != 'prosto' && profesor.length > 1) {
      var dan = this.dan.toLowerCase();
      var index = window.urnik.urnikZaProf.findIndex((x: any) => x.profesor == profesor);
      var z = window.urnik.urnikZaProf[index][dan][i].toUpperCase();
      index = window.stalen.urnikZaProf.findIndex((x: any) => x.profesor == profesor);
      var s = window.stalen.urnikZaProf[index][dan][i].toUpperCase();

      if (z == '' || z == ' ' && s == 'PROSTO') return '#f0f2f5'

      if (z != s) return '#cfd7e3'

    }
    if (i == this.indexProsteUre) return '#b4b4b4'
    return '#f0f2f5'
  }

  clickNaUro(predmet: any, profesor: string, razred: any, i: any) {
    if (!this.zamenjava) {
      if (predmet == "Prosto") {
        this.indexProsteUre = i;
        var odg = this.urnik.urnikProfesorjevProsto(razred, this.dan.toLowerCase())
        this.urnikProfesorja = odg.objekt;
        this.izbraniProfesorji = odg.prof;
      } else {
        if (!this.izbraniProfesorji.includes(profesor) && profesor.length > 0) {
          if (profesor.includes(',')) {
            var x = profesor.split(',')
            for (var j = 0; j < x.length; j++) {
              if (!this.izbraniProfesorji.includes(x[j])) this.izbraniProfesorji.push(x[j]);
            }
          } else this.izbraniProfesorji.push(profesor);

          var arr = this.izbraniProfesorji
          this.izbraniProfesorji = new Array(arr.length);
          for (var j = 0; j < this.izbraniProfesorji.length; j++) this.izbraniProfesorji[j] = arr[j];
          this.urnikProfesorja = this.urnik.urnikProfesorja(this.izbraniProfesorji, this.dan.toLowerCase())
          this.objektProfesorja = this.urnik.vecIzbranihProfesorjev(this.izbraniProfesorji, this.dan.toLowerCase())
        }
      }
    }
    else {
      this.preglejIzbraneProfesorje(predmet, profesor, razred, i)
    }
  }

  clickNaUroProfesorja(razred: any) {
    razred = razred.toUpperCase();
    if (razred.includes(",")) {
      razred = razred.split(",")
      for (var i = 0; i < razred.length; i++) {
        razred[i] = razred[i].replace(/ /g, '')
        if (!this.izbraniRazredi.includes(razred[i]) && this.vsiRazredi.includes(razred[i])) {
          this.izbraniRazredi.push(razred[i])
        }
      }
    } else {

      if (!this.izbraniRazredi.includes(razred) && this.vsiRazredi.includes(razred)) {
        if (razred.includes(" ")) {
          razred = razred.split(" ")[0]
          razred.replace(/ /g, '')
        }
        this.izbraniRazredi.push(razred)
      }
    }
    var arr = this.izbraniRazredi
    this.izbraniRazredi = new Array(arr.length);
    for (var i = 0; i < this.izbraniRazredi.length; i++) this.izbraniRazredi[i] = arr[i];
    this.objektRazredov = this.urnik.urnikIzbranihRazredov(this.izbraniRazredi, this.dan.toLowerCase());
  }

  preglejIzbraneProfesorje(predmet: any, profesor: string, razred: any, i: any) {
    if (this.prviIzbran.profesor != profesor && this.drugiIzbran.profesor != " ") {
      this.prviIzbran.profesor = profesor;
      this.prviIzbran.ura = i;
      this.prviIzbran.predmet = predmet;
      this.prviIzbran.razred = razred;
    }
    else if (this.drugiIzbran.profesor != profesor) {
      this.drugiIzbran.profesor = profesor;
      this.drugiIzbran.ura = i;
      this.drugiIzbran.predmet = predmet;
      this.drugiIzbran.razred = razred;
    } else {
      if (this.prviIzbran.profesor == profesor) {
        this.izbrisiIzbranega(1);
      }
      if (this.drugiIzbran.profesor == profesor) {
        this.izbrisiIzbranega(2);
      }
    }
  }

  izbrisiIzbranega(x: any) {
    if (x == 1 || x == 0) {
      this.prviIzbran.profesor = " ";
      this.prviIzbran.ura = -1;
      this.prviIzbran.predmet = " ";
      this.prviIzbran.razred = " ";
    }
    if (x == 2 || x == 0) {
      this.drugiIzbran.profesor = " ";
      this.drugiIzbran.ura = -1;
      this.drugiIzbran.predmet = " ";
      this.drugiIzbran.razred = " ";
    }
  }

  getBorderIzbran(razred: any, prof: any, i: any) {

    if (prof == this.prviIzbran.profesor && i == this.prviIzbran.ura && razred == this.prviIzbran.razred) {
      return '3px solid #0D6EFD'
    } else if (prof == this.drugiIzbran.profesor && i == this.drugiIzbran.ura && razred == this.drugiIzbran.razred) {
      return '3px solid #0D6EFD'
    }
    else return '1px solid #424242'

  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key == 'x') this.toggleZamenjava();
  }



  najdiVseSpremembe() {
    this.loading = true;

    var odg = this.urnik.najdiVseSpremembe(this.dan, window.stalen, window.urnik);
    this.prikaziSpremembe(odg.prof, odg.razredi).then(() => { this.loading = false; })

  }


  prikaziSpremembe(arrProf: any, arrRazredi: any) {
    return new Promise<void>((resolve, reject) => {
      this.izbraniProfesorji = new Array(arrProf.length);
      for (var j = 0; j < this.izbraniProfesorji.length; j++) this.izbraniProfesorji[j] = arrProf[j];

      this.izbraniRazredi = new Array(arrRazredi.length);
      for (var j = 0; j < this.izbraniRazredi.length; j++) this.izbraniRazredi[j] = arrRazredi[j];

      this.localUpdate(window.urnik)
      resolve()
    })

  }


  automatic() {

    var di = this.dialog.open(PotrdiComponent, {
      width: this.width,
      data: {
        sporocilo: "Samodejno potrdi proste prve in zadnje ure"
      }
    })

    di.afterClosed().subscribe(() => {

      var odg = this.urnik.najdiProste(this.dan.toLowerCase())
      var obj = this.urnik.urnikIzbranihRazredov(odg.vsi, this.dan.toLowerCase());

      console.log(odg)
      console.log(obj)

      var autoSpremembe = this.auto.naredi(odg.vsi, obj, this.dan)

      var urnik = this.local.autoSprememba(autoSpremembe)
      this.localUpdate(urnik)

      //this.loading = true;
      /*
      this.web.put('auto', {spremembe: this.autoSpremembe}).subscribe((r: any) => {
        this.odpriSporocilo(r.odgovor, r.status)
        this.loading = false;
        if (r.status == 'success') {
          this.updateUrnik()
        }
        
      }) 
      */


      /*
      for (var i = 0; i < this.autoSpremembe.length; i++) {
        var razred = this.autoSpremembe[i].razred
        var ura = this.autoSpremembe[i].ura
        calls.push(this.web.get(`potrdiProsto/${razred}/${this.dan.toLowerCase()}/${ura}`))
      }
      forkJoin(calls).subscribe((r) => {
        
        this.updateUrnik().then(()=>{
          this.loading = false;
          this.najdiVseSpremembe();
        });
        
      })
      */
    })


  }

  pridobiPodatke() {

    return new Promise<void>((resolve, reject) => {

      forkJoin([
        this.web.get('vsi-profesorji'),
        this.web.get('vsi-razredi'),
        this.web.get('vrni-urnik?urnik=teden'),
        this.web.get("ure")
      ]).subscribe(([vsiProf, vsiRazredi, stalen, ure]) => {
        console.log("TUKAJ----------------------------", vsiProf)
        // Profesorji
        this.response = vsiProf;
        var tabela: any[] = []
        for (var i in this.response) tabela.push(this.response[i].profesor)
        window.vsiProfesorji = tabela.sort();
        this.vsiProfesorji = window.vsiProfesorji;

        // Ure
        console.log("URE-------", ure)
        this.response = ure;
        if (!this.response.ure) this.ure = [1, 2, 3, 4, 5, 6, 7]
        else {
          this.ure = this.response.ure;
        }
        //window.ure = ure;
        //this.ure = ure;

        this.steviloUr = this.ure.length;

        //  Razredi
        this.response = vsiRazredi;
        var tabela: any[] = []
        for (var i in this.response) tabela.push(this.response[i].razred)
        window.vsiRazredi = tabela.sort();
        this.vsiRazredi = window.vsiRazredi;

        // Urniki
        this.response = stalen;
        window.stalenPredmeti = this.response.predmeti;
        window.stalenProfesorji = this.response.profesorji;
        window.stalenUrnikProfesorja = this.response.urnikZaProf;

        resolve();
      })


    })
  }

  onValChange(val: string) {
    this.dan = val
    //var a = this.urediUrnik.steviloUrProfesorja(this.dan.toLowerCase());
    if (this.izbraniProfesorji.length > 0) this.urediProfesorje();
    if (this.izbraniRazredi.length > 0) this.urediRazrede();

  }

  urediProfesorje() {

    this.objektProfesorja = this.urnik.vecIzbranihProfesorjev(this.izbraniProfesorji, this.dan.toLowerCase())
    this.urnikProfesorja = this.urnik.urnikProfesorja(this.izbraniProfesorji, this.dan.toLowerCase())


  }

  urediRazrede() {
    this.objektRazredov = this.urnik.urnikIzbranihRazredov(this.izbraniRazredi, this.dan.toLowerCase());
    console.log(this.objektRazredov)
  }

  zamenjajDveUri() {
    var podatek = this.urnik.preglejCeProst(this.prviIzbran, this.drugiIzbran, this.dan.toLowerCase())
    var s = 0
    if (this.vsiRazredi.includes(podatek.ura1)) s++;
    if (this.vsiRazredi.includes(podatek.ura2)) s++;

    if (s > 0) {
      const mod = this.dialog.open(ZamenjavaComponent, {
        data: {
          podatek: podatek,
          prvaUra: this.prviIzbran,
          drugaUra: this.drugiIzbran,
          dan: this.dan.toLowerCase()
        }
      })
      mod.afterClosed().subscribe((r) => {
        if (r) {
          var urnik = this.local.zamenjava(r.data)
          this.localUpdate(urnik)

          this.izbrisiIzbranega(1)
          this.izbrisiIzbranega(2)
          this.toggleZamenjava()


        }
      })
    } else {
      this.loading = true;
      var urnik = this.local.zamenjava({
        dan: this.dan.toLowerCase(),
        prvaUra: this.prviIzbran,
        drugaUra: this.drugiIzbran,
        dodatnaSprememba: 0
      })
      this.izbrisiIzbranega(1)
      this.izbrisiIzbranega(2)
      this.toggleZamenjava()
      this.localUpdate(urnik)

    }
  }

}
