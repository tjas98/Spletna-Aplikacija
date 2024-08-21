
import { Component, ElementRef, ViewChild } from '@angular/core';
import { WebService } from '../web.service';
import { Router } from '@angular/router';
import { Globals } from 'src/globals';
import { SocialAuthService } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(
    private web: WebService,
    private router: Router,
    private authService: SocialAuthService
  ) {}

  user: any;
  loggedIn: any;

  b = [1,2,3,4,5,6,67,7]

  text = "Ste profesor ali dijak?"

  izbran = ""
  vsiProfesorji: any[] = []
  vsiRazredi: any[] = []
  res: any
  token: any;
  mail: any;

  ok = false;

  izbira = ""

  ngOnInit() {

    this.vsiProfesorji = window.vsiProfesorji;

    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.token = this.user.idToken
      this.mail = this.user.email

      localStorage.setItem("token", this.token)

      this.loggedIn = (user != null);
     
      if (this.loggedIn) {
        this.web.get('user?mail='+this.mail).subscribe((r: any) => {
          if (r.ime) {
            this.izbran = r.ime
            localStorage.setItem('kdo', this.izbran)
            this.router.navigateByUrl('home').then(() => {
              if (localStorage.getItem("Obvestila")) alert("Prosim spet potrdi prejemanje obvestil")
              localStorage.removeItem('Obvestila')
              this.reload()
            })
          } else {
            alert("Profesorja ni v podatkovni zbirki")
          }
        })
        
        
      }
    });

    
  }


  izberi(a: any) {
    this.izbira = a;
    if (this.izbira == 'prof') {
      this.text = "Izberite kdo ste"
    } else {
      this.text = "Izberite vaš razred"
    }
    this.ok = true;
  }

  shrani() {
   
    localStorage.setItem('kaj', "prof");
    localStorage.setItem('kdo', this.izbran)
    this.web.get('kdoRabi/'+this.izbran).subscribe()
    this.router.navigateByUrl('home').then(() => {
      if (localStorage.getItem("Obvestila")) alert("Prosim spet potrdi prejemanje obvestil")
      localStorage.removeItem('Obvestila')
      this.reload()
    })
  }

  reload() {
    window.location.reload()
  }


}
