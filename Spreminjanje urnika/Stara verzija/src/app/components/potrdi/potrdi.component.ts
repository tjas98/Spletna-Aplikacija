import { Dialog } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-potrdi',
  templateUrl: './potrdi.component.html',
  styleUrls: ['./potrdi.component.css']
})
export class PotrdiComponent {
  sporocilo: any;
  urediUre = false;
  odsoten = false;
  mail = true;

  zacetekUre: any;
  konecUre: any;

  vsiProfesorji = window.vsiProfesorji;
  izbraniProfesorji: any = [];
 
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialogRef<PotrdiComponent>
  ){}

  ngOnInit() {
    this.odsoten = this.data.odsoten;
    this.urediUre = this.data.urediUre;
    this.sporocilo = this.data.sporocilo;
    this.zacetekUre = this.data.zacetekUre;
    this.konecUre = this.data.konecUre;
    this.mail = this.data.mail;


  }

  izbrisiProfesorje() {
    this.dialog.close({profesor: this.izbraniProfesorji}) 
  }
}
