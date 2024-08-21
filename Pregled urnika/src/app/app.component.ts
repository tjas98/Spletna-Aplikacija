
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { WebService } from './web.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Urnik';
  p: any;
  opened = false;
  user: any;
  loggedIn: any;
  slika: any;
  paidFor: any;
  id: any;
  mail: any;
  name: any;
  kdo: any;
  jePlacal: any;
  accessToken = "";

  trajanjeUr: any = []
  trajanjeOdmorov: any = []
  ure: any;

  ureStevilka: any = [];
  odmori: any = [];

  steviloUr: any = [];

  day: any;

  dnevi = ['pon', 'tor', 'sre', 'cet', 'pet']
  desktop = false;

  danes: any;

  datum: any;
  loading = false;

  @ViewChild('paymentRef', { static: true }) paymentRef!: ElementRef

  constructor(
    private router: Router,
    private web: WebService,
    private snackbar: MatSnackBar,
    private update: SwUpdate,
    private push: SwPush
  ) { 
    this.push.messages.subscribe(msg => {
      var m = JSON.stringify(msg)
      localStorage.setItem('Notifica', m)
    })
  }

  

  ngOnInit() {
  
    this.router.navigate([''])

    console.log(window.navigator.userAgent)
    
    if (window.navigator.userAgent.includes("iPhone") || 
    window.navigator.userAgent.includes("Android") ||
    window.navigator.userAgent.includes("iPad")) window.desktop = false;
    else {
      window.desktop = true;
      this.desktop = true;
    }

    
    this.vrniUro();
    this.vrniDatum();
    this.preglejCeNovaSprememba()
    

    this.kdo = localStorage.getItem("kdo")

    
    

    
    if (this.preglejPodatke()) {
      if (!window.desktop) this.router.navigate(['home']);
      else this.router.navigateByUrl('desk');
    } else {
      this.pridobiPodatke()
    }
   
    
    
    
    setInterval(() => {
      this.vrniUro()
    }, 5000)

    
    setInterval(() => {
      this.preglejCeNovaSprememba()
    }, 300000)
    
  }

  

  preglejCeNovaSprememba() {
    var zadnjaSprememba = localStorage.getItem('mobile-zadnja-sprememba')
    if (zadnjaSprememba) {
      this.web.get("zadnja-sprememba?teden="+this.datum).subscribe((r: any) => {
        if (r.status) {
          if (zadnjaSprememba != r.zadnja) this.pridobiUrnik()
        } 
      })
    } else {
      this.pridobiUrnik();
    }
  }

  pridobiUrnik() {
    this.web.get("urnik?urnik=1&teden="+this.datum).subscribe((r: any) => {
     
        if (r.status != 'error') {
          window.urnik = r.urnik
          localStorage.setItem('mobile-urnik', JSON.stringify(window.urnik))
          localStorage.setItem('mobile-zadnja-sprememba', window.urnik.zadnjaSprememba)
        } 
        
    })
  }

  preglejPodatke() {

    if (!localStorage.getItem("mobile-profesorji") || 
        !localStorage.getItem("mobile-razredi") || 
        !localStorage.getItem("mobile-urnik-stalen")) return false
    else {
      
      window.vsiRazredi = JSON.parse(localStorage.getItem("mobile-razredi") || "{}")
      window.vsiProfesorji = JSON.parse(localStorage.getItem("mobile-profesorji") || "{}")
      
      window.stalen = JSON.parse(localStorage.getItem("mobile-urnik-stalen") || "{}")
      if (localStorage.getItem("mobile-urnik")) window.urnik = JSON.parse(localStorage.getItem("mobile-urnik") || "{}")
        else {
          window.urnik = JSON.parse(localStorage.getItem("mobile-urnik-stalen") || "{}")
          localStorage.setItem("mobile-urnik", JSON.stringify(window.stalen))
        }
      window.ure = (localStorage.getItem("mobile-ure") || "1,2,3,4,5,6,7").split(',')
      return true
    }
  }

  preglejNovoVerzijo () {
    setInterval(() => {
      var a = this.update.checkForUpdate()
      a.then(r => {
        if (r) {
          var res = this.update.activateUpdate()
          res.then(r => {
            if (r) {
              if (localStorage.getItem("Obvestila")) alert("Nova verzija aplikacije. Prosim spet potrdi prejemanje obvestil")
              window.location.reload()
              localStorage.removeItem("Obvestila")
            }
          })
        }
      })
    }, 1000)
  }

  pridobiPodatke() {
    
    

    Promise.all([
      firstValueFrom(this.web.get('profesorji')),
      firstValueFrom(this.web.get('razredi')),
      firstValueFrom(this.web.get('urnik?urnik=2'))

    ]).then((r: any) => {
      var profesorji = r[0]
      var razredi = r[1]
      var stalen = r[2]

      
      var tabela: any[] = []
      for (var i in profesorji.podatki) tabela.push(profesorji.podatki[i].ime)
      window.vsiProfesorji = tabela.sort((a, b) => a.localeCompare(b));
      localStorage.setItem('mobile-profesorji', JSON.stringify(window.vsiProfesorji))

      var tabela: any[] = []
      for (var i in razredi.podatki) tabela.push(razredi.podatki[i].razred)
      window.vsiRazredi = tabela.sort()
      localStorage.setItem('mobile-razredi', JSON.stringify(window.vsiRazredi))

      
      window.stalen = stalen.urnik;
      localStorage.setItem('mobile-urnik-stalen', JSON.stringify(window.stalen))

      
      this.loading = false;

      this.urediUre()

      if (!window.desktop) this.router.navigateByUrl('home');
      else this.router.navigateByUrl('desk');
      
    })
  }


  vrniDatum() {
    const date = new Date();
    this.danes = date.toString().split(' ')[2] + " " + date.toString().split(' ')[1]
    var celTeden = dates(date)

    this.datum = celTeden[0].toString().split(" ")[2] + "-" + celTeden[0].toString().split(" ")[1] +
      "-" + celTeden[0].toString().split(" ")[3]

    function dates(current: any) {
      current = new Date(current)
      var week = new Array();
      var x = current.toString().split(" ")[0]

      if (x == 'Sat') current.setDate((current.getDate() - current.getDay() + 1 + 7));
      else current.setDate((current.getDate() - current.getDay() + 1));

      for (var i = 0; i < 7; i++) {
        week.push(
          new Date(current)
        );
        current.setDate(current.getDate() + 1);
      }
      return week;
    }
  }

  vrniUro() {
    const date = new Date();
    this.day = date.getDay();
    if (this.day == 0 || this.day == 6) window.weekend = true;
    else window.weekend = false;
    var now = date.getHours() * 60 + date.getMinutes();
    window.danes = date.toString().split(' ')[2] + " " + date.toString().split(' ')[1]
    if (this.day > 0 && this.day < 7) window.dan = this.dnevi[this.day - 1]
    else window.dan = ''
    window.ura = now;
  }

  updateUrnik() {
    return new Promise<void>(resolve => {
      this.web.get('vrniDatumUrnik/potrjen/' + this.datum).subscribe((r: any) => {
        if (r.status == 'error') {
            this.odpriSporocilo(r.odgovor+ ".\nPrikazan bo stalen urnik", r.status)
            window.urnik = window.stalen
            resolve()
        } else {
          window.urnik = {
            predmeti: r.urnik.predmeti,
            profesorji: r.urnik.profesorji,
            urnikZaProf: r.urnik.urnikZaProf
          }
          
          setTimeout(() => {
            resolve()
            this.loading = false;
          }, 1000)
        }
      })
    })
  }

  odpriSporocilo(text: any, status: any) {
    this.loading = false;
    this.snackbar.open(text, 'Zapri',{
      duration: 5000,
      panelClass: status
    })
  }

  urediUre() {
    this.web.get('ure').subscribe((r: any) => {

      var podatki = r;
      this.ure = r.ure
      window.ure = this.ure;
      localStorage.setItem("mobile-ure", window.ure)

      this.steviloUr = Array(this.ure.length).fill(0).map((x, i) => i);
      window.steviloUr = this.steviloUr;

      var zacetki = podatki.zacetekUre;
      var konci = podatki.konecUre;
      var zacetkiOdmora = podatki.zacetekOdmor;
      var konciOdmora = podatki.konecOdmor;

      for (var i in zacetki) {
        var uraZ = zacetki[i].split(":")[0]
        var minutaZ = zacetki[i].split(":")[1]
        var uraK = konci[i].split(":")[0]
        var minutaK = konci[i].split(":")[1]

        var prva = parseInt(uraZ) * 60 + parseInt(minutaZ)
        var druga = parseInt(uraK) * 60 + parseInt(minutaK)

        this.ureStevilka[i] = [prva, druga]
        this.trajanjeUr[i] = [zacetki[i], konci[i]]
      }

      for (var i in zacetkiOdmora) {
        var uraZ = zacetkiOdmora[i].split(":")[0]
        var minutaZ = zacetkiOdmora[i].split(":")[1]
        var uraK = konciOdmora[i].split(":")[0]
        var minutaK = konciOdmora[i].split(":")[1]

        var prva = parseInt(uraZ) * 60 + parseInt(minutaZ)
        var druga = parseInt(uraK) * 60 + parseInt(minutaK)

        this.trajanjeOdmorov[i] = [zacetkiOdmora[i], konciOdmora[i]]
        this.odmori[i] = [prva, druga]
      }
      var date = new Date();
      var now = date.getHours() * 60 + date.getMinutes();

      window.trajanjeOdmorov = this.trajanjeOdmorov;
      window.ureStevilka = this.ureStevilka;
      window.odmori = this.odmori;
      window.trajanjeUr = this.trajanjeUr;

      
    })
  }


}
