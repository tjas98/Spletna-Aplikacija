import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { WebService } from 'src/app/services/web.service';

@Component({
  selector: 'app-zamenjava',
  templateUrl: './zamenjava.component.html',
  styleUrls: ['./zamenjava.component.css']
})
export class ZamenjavaComponent {
  prvo = "";
  drugo = "";

  prviRazred: any;
  drugiRazred: any;

  constructor(
    private web: WebService,
    private dialog: MatDialogRef<ZamenjavaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){}

  ngOnInit() {
    this.prviRazred = this.data.podatek.ura1
    this.drugiRazred = this.data.podatek.ura2

    if (this.data.podatek.p1 != undefined && this.data.podatek.ura1 != 'Prosto') {
      this.prvo = "Profesor/ica " + this.data.podatek.p1 + " je " + (this.data.drugaUra.ura+1) + ". uro zaseden, ima " + this.data.podatek.ura1
    }
    if (this.data.podatek.p2 != undefined && this.data.podatek.ura2 != 'Prosto') {
      this.drugo = "Profesor/ica " + this.data.podatek.p2 + " je " + (this.data.prvaUra.ura+1) + ". uro zaseden, ima " + this.data.podatek.ura2
    }
  }

  sprosti() {
    this.dialog.close({data: {
      dan: this.data.dan,
      prvaUra: this.data.prvaUra,
      drugaUra: this.data.drugaUra,
      podatek: this.data.podatek,
      dodatnaSprememba: 1
    }})
  }
}
