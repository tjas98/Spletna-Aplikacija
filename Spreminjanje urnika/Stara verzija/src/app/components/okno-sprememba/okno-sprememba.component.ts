import { provideCloudflareLoader } from '@angular/common';
import { PrefixNot } from '@angular/compiler';
import { Component, Inject } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UrnikService } from 'src/app/services/urnik.service';

@Component({
  selector: 'app-okno-sprememba',
  templateUrl: './okno-sprememba.component.html',
  styleUrls: ['./okno-sprememba.component.css']
})
export class OknoSpremembaComponent {


  ure = [1,2,3,4,5,6,7]

  prostiProfesorji: any;
  profesorjiNaRazpolago: any;
  urnikVsehProfesorjev: any;
  urnikRazreda: any;

  izbraniProfesor: any = "";

  prviProfesor: any;

  prostDan = false;
  prosto = false;
  
  toggleOdstrani = false;

  profesor: any;

  urnik1: any;
  
  zamenjanRazred: any = "";

  izbrani: any;
  predmet = new UntypedFormControl;

  vecProfesorjev: any = [];

  jeVecProfesorjev = false;

  izbrisanProfesor = ""

  sam: any;
  

  constructor(
    private dialog: MatDialogRef<OknoSpremembaComponent>,
    private urnik: UrnikService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){}

  ngOnInit() {
    
    this.prviProfesor = this.data.profesor;

    console.log(this.data)

    this.prostiProfesorji = this.urnik.najdiProsteProfesorje(this.data)
    this.profesorjiNaRazpolago = this.urnik.profesorjiNaRazpolago(this.data)
    this.urnikVsehProfesorjev = this.urnik.urnikProfesorjevZaRazred(this.data)
    this.urnikRazreda = this.urnik.urnikRazreda(this.data)

    if (this.data.profesor.includes(',')) {
      this.jeVecProfesorjev = true;
      this.vecProfesorjev = this.data.profesor.split(',')
    }

    if (this.data.profesor != 'Prosto' && this.data.profesor != "") {
      this.izbraniProfesor = this.data.profesor
      this.izberiProfesorja()
    }
  }

  dolociProfesorja(a: any) {
    this.izbraniProfesor = a;
    this.izberiProfesorja()
  }

  izberiProfesorja() {
    this.prostDan = false;
    this.profesor = this.izbraniProfesor;
    
    if (this.izbraniProfesor != null) {
      this.najdiUrnik();
    }
  }

  prostaUra() {
    var podatki = {
      razred: this.data.razred,
      profesor: this.profesor,
      ura: this.data.ura-1,
      dan: this.data.dan
    } 
    this.dialog.close({event: "prostaUra", podatki}) 
  }

  najdiUrnik() {
    var index = window.urnik.urnikZaProf.findIndex((x: any) => x.profesor == this.profesor)
    this.urnik1 = window.urnik.urnikZaProf[index][this.data.dan]

    var ura = this.data.ura-1;
    var a = this.urnik1[ura];

    if (a == 'Prosto') {
      this.prosto = true;
      this.zamenjanRazred = 'Prosto';
    } else {
      var razred = a.split(':')[0].toUpperCase();
      this.zamenjanRazred = razred;
      this.prosto = false;
    }
    this.izbrani = true;

  }

  

  spremeni() {
    var podatki = {
      profesor1: this.prviProfesor,
      profesor2: this.profesor,
      razred: this.data.razred,
      razred2: this.zamenjanRazred,
      ura: this.data.ura-1,
      dan: this.data.dan,
      predmet: this.predmet.value
    }
    this.dialog.close({event: "Sprememba", podatki});
  }

  potrdiProstoUro() {
    var podatki = {
      dan: this.data.dan,
      razred: this.data.razred,
      ura: this.data.ura-1
    }
    this.dialog.close({event: 'potrdiProsto', podatki});
  }

  toggleOdstraniEnega() {
    this.toggleOdstrani = !this.toggleOdstrani;
  } 

  odstraniProfesorja(profesor: any) {
    this.izbrisanProfesor = profesor
    this.vecProfesorjev = this.vecProfesorjev.filter((x: any) => {return x !== profesor});
    if (this.vecProfesorjev.length == 1) {
      this.toggleOdstraniEnega()
      this.izbraniProfesor = this.vecProfesorjev[0].toString()
      this.sam = this.izbraniProfesor;
      this.prviProfesor = this.izbrisanProfesor;
      this.izberiProfesorja()
    }
  }

}
