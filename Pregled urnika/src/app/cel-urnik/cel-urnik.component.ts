import { Component } from '@angular/core';
import { Globals } from 'src/globals';
import { WebService } from '../web.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cel-urnik',
  templateUrl: './cel-urnik.component.html',
  styleUrls: ['./cel-urnik.component.css']
})
export class CelUrnikComponent {
  router: any;
  constructor(
    private web: WebService,
    private snackbar: MatSnackBar
  ){}

  dni = ['Pon', 'Tor', 'Sre', 'Čet', 'Pet']
  urnik: any = [];
  urnikProf: any;
  dnevi = ['pon', 'tor', 'sre', 'cet', 'pet']
  day: any;
  dan: any;

  kdo: any;

  response: any;

  ngOnInit() {
    this.dan = window.dan;
    if (!this.dan) this.dan = 'pon'
    var ur = window.urnik.urnikZaProf;
    
    var profesorji = window.vsiProfesorji.sort()
    for (var i in profesorji) {
      var profesor = profesorji[i]
      var index = ur.findIndex((x: any) => x.profesor == profesor);
      this.urnik.push(ur[index])
    }

  }

  prikazi(text: any) {
    this.snackbar.open(text, 'Zapri',{
      duration: 5000,
      verticalPosition: 'top'
    })
  }

  
  zamenjajDan(i: any) {
    this.day = i;
    console.log(this.day)
    this.najdiDan(i+1)
  }

  najdiDan(i: any) {
    if (i == 1) this.dan = 'pon'
    if (i == 2) this.dan = 'tor'
    if (i == 3) this.dan = 'sre'
    if (i == 4) this.dan = 'cet'
    if (i == 5) this.dan = 'pet'
  }
}
