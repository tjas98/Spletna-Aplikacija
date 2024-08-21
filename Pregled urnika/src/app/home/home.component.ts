import { Component, HostListener, provideZoneChangeDetection } from '@angular/core';
import { WebService } from '../web.service';
import { Router } from '@angular/router';
import { SwPush } from '@angular/service-worker';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  trajanjeUr: any = []
  trajanjeOdmorov: any = []

  odmor = false;

  text: any;
  ura: any;
  uraOdmora: any;

  urnik: any;
  res: any;

  kdo: any;
  kaj: any;

  ure = [1,2,3,4,5,6,7];

  vsiProfesorji: any[] = [];
  vsiRazredi: any[] = [];

  loaded = false;

  dni = ['Pon', 'Tor', 'Sre', 'Čet', 'Pet']
  dnevi = ['pon', 'tor', 'sre', 'cet', 'pet']

  ureStevilka: any = [];
  odmori: any = [];

  day: any;

  opened = false;

  prejsnjaUra = 0;

  steviloUr: any = [];
  mail: any;

  dan = window.dan;
  uraKasneje: any;

  weekend = window.weekend;

  obvestilo = false;

  naslov: any

  constructor(
    private web: WebService,
    private router: Router,
    private push: SwPush
  ) { }


  ngOnInit() {

    this.odmori = window.odmori;
    this.trajanjeOdmorov = window.trajanjeOdmorov;
    this.trajanjeUr = window.trajanjeUr;
    this.ureStevilka = window.ureStevilka;
    this.dan = window.dan;
    if (window.ure) this.ure = window.ure;
    this.steviloUr = [...Array(this.ure.length).keys()]
    

    this.preglejSporocilo()

    setInterval(() => {
      this.preglejSporocilo()
    }, 2000)
   
    
    this.kdo = localStorage.getItem('kdo')

    if (this.kdo == null) this.router.navigateByUrl('login')
    else {
      this.najdiUrnik(window.urnik)
    
      setInterval(() => {
        this.najdiUro(window.ura)
      }, 5000)
  
      setInterval(() => {
        this.najdiUrnik(window.urnik)
      }, 100000)
    }
    
  
  }

  preglejSporocilo() {
    var a = localStorage.getItem('Notifica')
    if (a) {
      var json = JSON.parse(a);
      this.obvestilo = true;
      window.pushData = json
      this.naslov = json.notification.title;
    }
  }

  najdiUrnik(ur: any) {
    let index = ur.urnikZaProf.findIndex((x: any) => x.profesor === this.kdo);
    this.urnik = ur.urnikZaProf[index]
    this.najdiUro(window.ura)
   
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
        this.uraKasneje = parseInt(this.ura) + 1
        this.odmor = false;
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
    this.loaded = true;

    console.log(this.ure)
  }

}
