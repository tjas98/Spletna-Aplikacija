import { GoogleLoginProvider, SocialAuthService } from '@abacritt/angularx-social-login';
import { Component } from '@angular/core';
import { WebService } from '../web.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-google',
  templateUrl: './google.component.html',
  styleUrls: ['./google.component.css']
})
export class GoogleComponent {

  opened = false;
  user: any;
  loggedIn: any;

  napaka = false;

  constructor(
    private authService: SocialAuthService,
    private web: WebService,
    private router: Router
    ){}

  ngOnInit()  {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      
      this.loggedIn = (user != null);
      if (this.loggedIn) {
        
        var mail = this.user.email;
        if (mail.includes('@preseren.edu.it')) {
          localStorage.setItem('mail', mail)
          window.location.reload()
        } else {
          this.napaka = true;
        }
       
      }
    });
  }


}
 