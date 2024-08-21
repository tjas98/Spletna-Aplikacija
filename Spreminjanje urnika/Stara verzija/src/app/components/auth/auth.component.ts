import { Component } from '@angular/core';
import {FormControl} from '@angular/forms';
import { Router } from '@angular/router';


import { WebService } from 'src/app/services/web.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})

export class AuthComponent {

  constructor(
    private web: WebService,
    private router: Router
  ){}

  email = new FormControl();
  password = new FormControl()

  vrni() {
    this.router.navigate(['login'])
  }
  
  poslji() {

    this.web.post('admin', {
      mail: this.email.value,
      password: this.password.value
    }).subscribe({
      next: (r: any) => {
        this.email.reset()
        this.password.reset()
      
        alert(r.sporocilo)
      },
      error: (err) => {
        alert(err.error)
      }
    })
  
    
 }
}
