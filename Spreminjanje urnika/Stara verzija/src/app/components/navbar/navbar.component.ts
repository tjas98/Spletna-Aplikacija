import { Component, ElementRef, ViewChild } from '@angular/core';
import { SpremembaComponent } from '../sprememba/sprememba.component';
import { ShareService } from 'src/app/services/share.service';
import { UrnikService } from 'src/app/services/urnik.service';
import { Router } from '@angular/router';
import { WebService } from 'src/app/services/web.service';
import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  teden = ['pon', 'tor', 'sre', 'cet', 'pet']
  tedenDolgo = ['Ponedeljek', 'Torek', 'Sreda', 'Četrtek', 'Petek']

  prostiNaDan: any = [];
  dan: any;

  loaded = false;
  route: any;

  mobile = window.mobile;

  danLepo: any;

  datum: any = [];

  danes: any;

  sh: any;

  gumbShranjen = false;
  zacetekTeden: any;
 

  shranjen = false;
  potrjen = false;
  
  value: any;
  taTeden: any;

  

  myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    return day !== 0 && day !== 6;
  };

  constructor(
    private shared: ShareService,
    private web: WebService,
    private router: Router,
    private dateAdapter: DateAdapter<Date>
  ){

    this.shared.najdiProste().subscribe(r => {
      this.prostiNaDan = r;
      this.loaded = true;
    })
  }

  ngOnInit() {

    this.dateAdapter.setLocale('sl');
    this.dateAdapter.getFirstDayOfWeek = () => { return 1; }
    this.router.events.subscribe((val: any) => {
      if (val.routerEvent) {
        this.route = val.routerEvent.url;
        console.log(this.route)
      }
      
    })

    const date = new Date();
    this.danes = date.toString().split(' ')[2] + " " + date.toString().split(' ')[1]
    this.value = date.toString().split(' ')[2] + " " + date.toString().split(' ')[1]
    this.dan = this.najdiDan(date.getDay())

    this.izberiDatum(date)

    if (date.getDay() > 1 && date.getDay() < 6) this.danLepo = this.tedenDolgo[date.getDay()-1]
    else this.danLepo = this.tedenDolgo[0]
    
  }

  vrniseNaDanes() {
    this.value = this.danes
    const date = new Date();
    this.izberiDatum(date)
    this.dan = this.najdiDan(date.getDay())
  }

  izberiDatum(e: any) {
    this.datum = []
    if (e.value) {
      this.value = e.value.toString().split(' ')[2] + " " + e.value.toString().split(' ')[1]
      var a = e.value.toString();
      var celTeden = dates(a)
      this.dan = this.najdiDan(e.value.getDay())
    } else {
      this.danes = e.toString().split(' ')[2] + " " + e.toString().split(' ')[1]
      var celTeden = dates(e)
    }
   
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

    for (var i in celTeden) {
      var datum = celTeden[i].toString()
      var mesec = datum.split(" ")[1]
      var dan = datum.split(" ")[2]
      this.datum.push(dan + " " + mesec)
    }
    
    var d = celTeden[0].toString().split(" ")[2] + "-" + celTeden[0].toString().split(" ")[1] + 
     "-" + celTeden[0].toString().split(" ")[3]

    var d2 = celTeden[4].toString().split(" ")[2] + "-" + celTeden[4].toString().split(" ")[1] +
      "-" + celTeden[4].toString().split(" ")[3]

    window.zacetekTedna = d;
    window.konecTedna = d2;
    this.zacetekTeden = d;
    window.izbranDan = this.value

    this.web.get('shranjen-urnik?teden=' + window.zacetekTedna).subscribe((r: any) => {
      this.shranjen = r.sh;
      this.potrjen = r.po;
      if (r.status == 'success') this.gumbShranjen = true;
      else this.gumbShranjen = false;
      
      this.shared.posljiSporocilo(r, d, this.dan)
    })
    
  }

  najdiDan(d: any) {
    if (d == 1) return "pon"
    if (d == 2) return "tor"
    if (d == 3) return "sre" 
    if (d == 4) return "cet"
    if (d == 5) return "pet"
    return "pon"
  }

  uporabljajShranjen(x: any) {
    this.web.get('rabiShranjen/' + window.zacetekTedna + "/"+x).subscribe((r: any) => {
      if (r.status == 'success') this.gumbShranjen = false;
      this.shared.posljiShranjeno(r)
    })
  }
 
  onValChange(x: any, i: any) {
   
    this.danLepo = this.tedenDolgo[i]
    this.value = this.datum[i]
    window.izbranDan = this.value
    this.shared.send(x.toLowerCase())
  }

  logout() {
    localStorage.removeItem("admin")
    this.reload()
  }

  reload() {
    window.location.reload();
  }

}
