import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notifica',
  templateUrl: './notifica.component.html',
  styleUrl: './notifica.component.css'
})
export class NotificaComponent {

  naslov: any;
  urnik: any;

  urnik2: any

  profesorji: any;
  razredi: any;
  
  ngOnInit() {
    this.naslov = window.pushData.notification.title
    this.urnik = window.pushData.notification.data.urnik
    this.urnik2 = window.pushData.notification.data.urnik2
    this.profesorji = window.pushData.notification.data.profesorji;
    this.razredi = window.pushData.notification.data.razredi;
  }

  zapri() {
    localStorage.removeItem('Notifica')
    window.location.reload()
  }
}

