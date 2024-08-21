import { Component } from '@angular/core';
import { firstValueFrom, forkJoin, lastValueFrom } from 'rxjs';
import { WebService } from './services/web.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Sprememba';

  visina = window.innerHeight-65;

  loading = true;
  dan: any;

  admin = false;
  zacetekTedna = ""


  constructor(
    private web: WebService,
    private router: Router
  ){}

  ngOnInit() {
    //this.router.navigate([''])/*

    var token = localStorage.getItem("token")

    if (window.navigator.userAgent.includes("iPhone") || 
    window.navigator.userAgent.includes("Android") ||
    window.navigator.userAgent.includes("iPad")) window.mobile = true;
    else window.mobile = false;

    if (!token) {
      this.router.navigate(['login'])
      this.loading = false;
      window.admin = false;
    } else {

      this.web.get('avtentikacija').subscribe((r: any) => {
        if (r.sporocilo) {
          this.pridobiPodatke().then(() => {
            window.admin = true;
            this.router.navigate(['sprememba'])
            this.loading = false; 
          })
        } else {
          localStorage.removeItem("token")
          this.router.navigate(['login'])
          this.loading = false; 
        }
      })
    }
    

  }

  

  pridobiPodatke() {

    //``
    var celTeden = this.dates()
    this.zacetekTedna = celTeden[0].toString().split(" ")[2] + "-" + celTeden[0].toString().split(" ")[1] +
      "-" + celTeden[0].toString().split(" ")[3]
      
   return new Promise<void>(resolve => {
      var k1 = firstValueFrom(this.web.get('profesorji'))
      var k2 = firstValueFrom(this.web.get('razredi'));
      var k3 =  firstValueFrom(this.web.get('urnik?urnik=2'));
      var k4 = firstValueFrom(this.web.get(`urnik?urnik=0&teden=${this.zacetekTedna}`));
      var k5 = firstValueFrom(this.web.get("ure"));
      
      Promise.all([k1, k2, k3, k4, k5]).then((r: any) => {
       
        var vsiProf = r[0]
        var vsiRazredi = r[1]
        var stalen = r[2]
        var urnik = r[3]
        var ure = r[4]
        
        if (stalen.status == 'error') {
          this.router.navigate(['urejanje'])
        }

        var tabela: any[] = []
        for (var i in vsiProf.podatki) tabela.push(vsiProf.podatki[i].ime)
        window.vsiProfesorji = tabela.sort((a, b) => a.localeCompare(b));
        
        var tabela: any[] = []
        for (var i in vsiRazredi.podatki) tabela.push(vsiRazredi.podatki[i].razred)
        window.vsiRazredi = tabela.sort();
        

        if (localStorage.getItem('urnik-zacasen') && localStorage.getItem('urnik-zacasen') != 'undefined') {
          window.urnik = JSON.parse(localStorage.getItem('urnik-zacasen') || '{}')

          var st = localStorage.getItem('urnik-stalen');
          var za = localStorage.getItem('urnik-zacasen');
          
          window.uporabljenUrnik = (st == za) ?  "Stalen urnik" : "Lokalni urnik";


          
        } else {
          if (urnik.status == 'success') window.urnik = urnik.urnik;
          else window.urnik = stalen.urnik

          if (window.urnik) localStorage.setItem('urnik-zacasen', JSON.stringify(window.urnik))
        }

        
        
        window.stalen = stalen.urnik;
        localStorage.setItem('urnik-stalen', JSON.stringify(stalen.urnik))

        localStorage.setItem('maili', JSON.stringify(vsiProf))

        if (ure.ure.length > 0)  window.ure = ure.ure
        else window.ure = [1,2,3,4,5,6,7]

        

        resolve()
      })
   })
      
  }

  dates() {
   
    var current = new Date()
    var week = new Array();
    var x = current.toString().split(" ")[0]
     
    if (x == 'Sat') current.setDate((current.getDate() - current.getDay() + 1 + 7));
    else current.setDate((current.getDate() - current.getDay() + 1));
      
    for (var i = 0; i < 1; i++) {
      week.push(
        new Date(current)
      );
      current.setDate(current.getDate() + 1);
    }
    return week;
    
  }
}
