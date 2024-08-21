import { Dialog } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { WebService } from 'src/app/services/web.service';
import * as XLSX from 'xlsx-js-style'
import { PotrdiComponent } from '../potrdi/potrdi.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VnosUrnikaService } from 'src/app/services/vnos-urnika.service';

@Component({
  selector: 'app-uredi-urnik',
  templateUrl: './uredi-urnik.component.html',
  styleUrls: ['./uredi-urnik.component.css']
})
export class UrediUrnikComponent {

  file: any = null
  fileMail: any = null

  urnik: any;
  urnikPredmeti2: any;

  response: any;

  spinner = false;
  urnikPredmeti: any;
  urnikProf: any;
  razredi: any;
  vsiProfesorji: any;
  urnikZaProf: any;

  izbranUrnik = "";

  vnosMail = false;

  mails: any;

  mobile = false;

  uredbaUre = false;
  uredbaOdmori = false;
  vnosUr = false;

  izberiUredbo = false;

  stevilo: any;

  steviloUr: any;
  steviloUrOdmora: any;

  index = 0

  zacetekUre: any = []
  konecUre: any = []

  zacetekOdmora: any = []
  konecOdmora: any = []

  neUrejeneUre = false
  neUrejeniOdmori = false;

  zacetekTedna: any;

  jeNapaka = false;
  napaka: any;
  pregledan = false;

  jeOpozorilo = false;
  tipUrnika: any;


  constructor(
    private router: Router,
    private web: WebService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private vnosUrnika: VnosUrnikaService
  ) { }

  ngOnInit() {
    if (window.navigator.userAgent.includes("iPhone") ||
      window.navigator.userAgent.includes("Android") ||
      window.navigator.userAgent.includes("iPad")) this.mobile = true;

    var admin = localStorage.getItem("admin")
    this.web.get('admin/' + admin).subscribe(r => {
      if (!r) this.router.navigateByUrl('login')
    })

    this.web.get('/ure').subscribe(r => {
      this.response = r;

      if (this.response.konecUre.length < 1) this.neUrejeneUre = true;
      else {
        this.konecUre = this.response.konecUre;
        this.zacetekUre = this.response.zacetekUre;
      }
      if (this.response.konecOdmor.length < 1) this.neUrejeniOdmori = true;
      else {
        this.zacetekOdmora = this.response.zacetekOdmor;
        this.konecOdmora = this.response.konecOdmor;
      }
      this.steviloUr = Array(this.response.ure.length).fill(0).map((x, i) => i);
    })
  }

  pojdiNaSpremembo() {
    this.router.navigate(['sprememba'])
  }

  urediUre() {
    const di = this.dialog.open(PotrdiComponent, {
      width: "30vw",
      data: {
        urediUre: true,
        zacetekUre: this.zacetekUre,
        konecUre: this.konecUre,
        sporocilo: "Trajanje učnih ur"
      }
    })

    di.afterClosed().subscribe((r) => {
      if (r) {
        this.web.put('/urejanje-ure', {
          odmor: false,
          zacetek: this.zacetekUre,
          konec: this.konecUre,
          steviloUr: this.stevilo
        }).subscribe((r) => {
          window.location.reload()
        })
      }
    })
  }

  urediOdmore() {
    const di = this.dialog.open(PotrdiComponent, {
      width: "30vw",
      data: {
        urediUre: true,
        zacetekUre: this.zacetekOdmora,
        konecUre: this.konecOdmora,
        sporocilo: "Trajanje odmorov"
      }
    })

    di.afterClosed().subscribe((r) => {
      if (r) {
        this.web.put('/urejanje-ure', {
          odmor: true,
          zacetek: this.zacetekOdmora,
          konec: this.konecOdmora,
          steviloUr: this.stevilo
        }).subscribe(() => {
          window.location.reload()
        })
      }
    })
  }

  naslednjaUra() {
    this.index += 1;
  }


  prova() {
    this.steviloUrOdmora = Array(this.stevilo).fill(0).map((x, i) => i);
    this.vnosUr = true;
  }

  onFileSelected(event: any) {
    this.file = event.target.files[0] ?? null;

    const target: DataTransfer = <DataTransfer>(event.target);
    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(target.files[0]);
    reader.onload = (e: any) => {

      const binarystr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });

      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      this.urnik = data;

      const wsname2: string = wb.SheetNames[1];
      const ws2: XLSX.WorkSheet = wb.Sheets[wsname2];
      const data2 = XLSX.utils.sheet_to_json(ws2, { header: 1 });

      this.urnikPredmeti2 = data2;

    }
  }

  shraniUrnik(tipUrnika: any) {
    
    this.tipUrnika = tipUrnika;

    const urnik = this.vnosUrnika.vnesiUrnik(this.urnik, this.urnikPredmeti2)
    this.urnik = urnik;
    
    const napaka = this.vnosUrnika.preglejUrnik(urnik, tipUrnika)

    this.pregledan = true;
    if (napaka) {
      this.napaka = napaka;
      (napaka.napaka == 'noProf') ? this.jeNapaka = true : this.jeOpozorilo = true;
    }

  }

  naloziVZbirko() {
    this.spinner = true;
    this.web.post('urnik', {
      urnik: this.urnik,
      tip: this.tipUrnika,
      teden: window.zacetekTedna
    }).subscribe((r: any) => {
      this.odpriSporocilo(r.odgovor, r.status);
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    })
  }

  nalozi(x: any) {
    if (x != 'stalen') {
      const di = this.dialog.open(PotrdiComponent, {
        width: "30vw",
        data: {
          sporocilo: "Vnesi urnik za teden " + window.zacetekTedna
        }
      })

      di.afterClosed().subscribe(r => {
        if (r) {
          this.shraniUrnik(x)
        }
      })
    } else {
      this.shraniUrnik(x)
    }
  }


  izberiUrnik(x: any) {
    this.vnosMail = false;
    this.izbranUrnik = x
  }

  izberiMail() {
    this.vnosMail = true;
    this.izbranUrnik = ""
  }

  mailFile(event: any) {
    this.fileMail = event.target.files[0] ?? null;
    const target: DataTransfer = <DataTransfer>(event.target);
    if (target.files.length !== 1) {
      throw new Error('Cannot use multiple files');
    }
    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(target.files[0]);
    reader.onload = (e: any) => {

      const binarystr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });

      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      this.mails = data
      console.log(this.mails)
    }
  }

  naloziMaile() {
    this.web.post('mail', {
      mails: this.mails
    }).subscribe((r: any) => {
      this.odpriSporocilo(r.odgovor, r.status)
    })
  }

  odpriSporocilo(text: any, status: any) {
    this.snackBar.open(text, 'Zapri', {
      duration: 5000,
      panelClass: status
    })
  }
}
