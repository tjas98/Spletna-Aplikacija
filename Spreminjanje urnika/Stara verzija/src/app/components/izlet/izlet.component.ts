import { Component } from '@angular/core';
import { FormControl, UntypedFormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { LocalService } from 'src/app/services/local.service';
import { WebService } from 'src/app/services/web.service';

@Component({
  selector: 'app-izlet',
  templateUrl: './izlet.component.html',
  styleUrls: ['./izlet.component.css']
})
export class IzletComponent {
  izbraniDnevi: any = [];
  izbranDan: any;
  dejavnost = new FormControl;
  izbraniProfesorji: any = [];
  izbraniRazredi: any = [];
  vsiRazredi: any;
  vsiProfesorji: any;
  dni = ['Pon', 'Tor', 'Sre', 'Cet', 'Pet', 'Sob'];
  selectedVal: any;

  ure = [1, 2, 3, 4, 5, 6, 7];
  izbraneUre: any;

  constructor(

    private web: WebService,
    private local: LocalService,
    private dialog: MatDialogRef<IzletComponent>
  ) { }

  ngOnInit(): void {
    this.vsiRazredi = window.vsiRazredi;
    this.vsiProfesorji = window.vsiProfesorji;
    this.selectedVal = '1';
  }

  onValChange(val: any) {
    this.selectedVal = val;
  }

  preglejCeVse() {
    if (this.izbraniDnevi.length < 1) return true;
    if (this.izbraniProfesorji.length < 1 || this.izbraniRazredi.length < 1) return true
    if (!this.dejavnost.value) return true

    return false;
  }



  poslji() {

    this.dialog.close({
      event: "Anton", podatki: {
        razredi: this.izbraniRazredi,
        dnevi: this.izbraniDnevi,
        profesorji: this.izbraniProfesorji,
        dejavnost: this.dejavnost.value
      }
    })
  }

  /*
  this.web.put('dejavnost-celodnevna', {
    razredi: this.izbraniRazredi,
    dnevi: this.izbraniDnevi,
    profesorji: this.izbraniProfesorji,
    dejavnost: this.dejavnost.value
  }).subscribe();
  */
  /*else {

   this.web.put('dejavnost', {
     razredi: this.izbraniRazredi,
     dan: this.izbranDan,
     ure: this.izbraneUre,
     profesorji: this.izbraniProfesorji,
     dejavnost: this.dejavnost.value
   }).subscribe();
 }
 */



}
