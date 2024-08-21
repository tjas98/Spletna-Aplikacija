import { Component } from '@angular/core';
import { WebService } from '../web.service';
import { Globals } from 'src/globals';

@Component({
  selector: 'app-urnik-drugih',
  templateUrl: './urnik-drugih.component.html',
  styleUrls: ['./urnik-drugih.component.css']
})
export class UrnikDrugihComponent {

  constructor(
    private web: WebService
  ){}

  selected = '';

  text: any;
  ura: any;

  res: any;
  dan: any;

  kdo: any;
  kaj: any;

  vsiProfesorji = window.vsiProfesorji
  vsiRazredi = window.vsiRazredi
  urnik = window.urnik

  loaded = false;

  dni = ['Pon', 'Tor', 'Sre', 'Čet', 'Pet']
  dnevi = ['pon', 'tor', 'sre', 'cet', 'pet']

  day: any;

  opened = false;

  ngOnInit() {

    this.vsiProfesorji = window.vsiProfesorji
    this.vsiRazredi = window.vsiRazredi
    this.urnik = window.urnik
    
    this.ura =  window.uraVTeku;
    
    this.dan = window.dan;

    if (this.day == 1) this.dan = 'pon'
    if (this.day == 2) this.dan = 'tor'
    if (this.day == 3) this.dan = 'sre'
    if (this.day == 4) this.dan = 'cet'
    if (this.day == 5) this.dan = 'pet'

  }
              
  najdi() {
    if (this.vsiProfesorji.includes(this.selected)) this.najdiZaProfesorja(window.urnik)
    if (this.vsiRazredi.includes(this.selected)) this.najdiZaRazred(window.urnik)
  }


  najdiZaProfesorja(ur: any) {
    console.log(ur)
    let index = ur.urnikZaProf.findIndex((x: any) => x.profesor === this.selected);
    this.urnik = ur.urnikZaProf[index]
    this.loaded = true;
    console.log(this.urnik)
 }
              
  najdiZaRazred(ur: any) {
    let index = ur.predmeti.findIndex((x: any) => x.razred === this.selected);
    this.urnik = ur.predmeti[index]
    this.loaded = true;
  }
}
