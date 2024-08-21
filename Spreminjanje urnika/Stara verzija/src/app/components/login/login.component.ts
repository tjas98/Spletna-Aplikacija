import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';
import { WebService } from 'src/app/services/web.service';
import { GoogleLoginProvider } from "@abacritt/angularx-social-login";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(
    private authService: SocialAuthService,
    private web: WebService,
    private router: Router
  ){}

  user: any;
  loggedIn: any;
  response: any;
  token: any;

  private accessToken = '';
  noAdmin = false;

 

  ngOnInit() {

    

    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.token = this.user.idToken

     
      localStorage.setItem("token", this.token)

      this.loggedIn = (user != null);
     
      if (this.loggedIn) {
      
        this.web.get("avtentikacija").subscribe((r: any) => {
         
          if (r.sporocilo) {
            localStorage.setItem("admin", this.user.email)
            localStorage.setItem("token", this.token)
            window.location.reload()
          } else {
            this.noAdmin = true;
          }
        }) 
        
      }
    });
  }

  
  dodaj() {
    this.router.navigate(['auth'])
  }
  
}
