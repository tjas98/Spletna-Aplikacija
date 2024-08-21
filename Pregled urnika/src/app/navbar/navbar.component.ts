import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SwPush } from '@angular/service-worker';
import { WebService } from '../web.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  route: any;
  kdo: any;
  online = true;

  loading = false;

  obvestilo = false;

  constructor(
    private router: Router,
    private push: SwPush,
    private web: WebService,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit() {

    setInterval(() => {
      this.online = navigator.onLine
    }, 1000)

    
    this.kdo = localStorage.getItem("kdo")

    this.router.events.subscribe((val: any) => {
      if (val.url) this.route = val.url;
    })
  }

  nalozi() {
    window.location.reload();
  }

  soObvestila() {
    if (localStorage.getItem("Obvestila") == "JA") return true
    else return false
  }

  notifica() {
    Notification.requestPermission().then(perm => {
      if (perm == 'granted') {
        this.loading = true;
        this.push.requestSubscription({
          serverPublicKey: "BIRQYfbbT0m6gbz4mxKdAbMjRSaE0IR94vNYl8cnbTUL69AJDyxDRbmek22TtgnMLdQ61qyqdpZeNRZlqbrC5OY"
        }).then(r => {
          
          if (this.kdo) {
            this.web.post('poglej', {
              sub: r,
              profesor: this.kdo
            }).subscribe((r: any) => {
              this.loading = false;
              if (r.status == 'success') localStorage.setItem('Obvestila', "JA")
              this.odpriSporocilo(r.odgovor, r.status)
            })
          }
        }).catch((error) => {
          this.loading = false;
        })
      } else {
        this.odpriSporocilo("Ni avtorizacije. Če je to bila napaka prosim na novo naložite aplikacijo", "error")
      }
    })
    
  }

  odpriSporocilo(text: any, status: any) {
    this.snackbar.open(text, 'Zapri',{
      duration: 5000,
      panelClass: status
    })
  }

  logout() {
    localStorage.removeItem('mail')
    localStorage.removeItem('kdo')
    window.location.reload()
  }
}
