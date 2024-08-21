import { Component } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { WebService } from '../web.service';

@Component({
  selector: 'app-datum',
  templateUrl: './datum.component.html',
  styleUrl: './datum.component.css'
})
export class DatumComponent {
  myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    return day !== 0 && day !== 6;
  };

  value: any;
  danes: any;
  dan: any;
  datum: any = [];

  urnikObj: any = {}
  urnik: any;
  loaded = false;

  profesor: any;
  dnevi = ['pon', 'tor', 'sre', 'cet', 'pet']
  
  jeUrnik = false;

  constructor(
    private dateAdapter: DateAdapter<Date>,
    private web: WebService
  ) {}

  ngOnInit() {
    this.profesor = localStorage.getItem('kdo')
    this.dateAdapter.setLocale('sl');
    this.dateAdapter.getFirstDayOfWeek = () => { return 1; }
  }

  izberiDatum(e: any) {
    this.datum = []
    this.value = e.value.toString().split(' ')[2] + " " + e.value.toString().split(' ')[1]
    var a = e.value.toString();
    var celTeden = dates(a)
    
    function dates(current: any) {
      current = new Date(current)
      var week = new Array();
      var x = current.toString().split(" ")[0]
      if (x == "Sun" || x == 'Sat') current.setDate((current.getDate() - current.getDay() + 1 + 7));
      else current.setDate((current.getDate() - current.getDay() + 1));

      for (var i = 0; i < 7; i++) {
        week.push(
          new Date(current)
        );
        current.setDate(current.getDate() + 1);
      }
      return week;
    }

    for (var i in celTeden) {
      var datum = celTeden[i].toString()
      var mesec = datum.split(" ")[1]
      var dan = datum.split(" ")[2]
      this.datum.push(dan + " " + mesec)
    }
    console.log(this.datum[0], this.datum[4])
    var d = celTeden[0].toString().split(" ")[2] + "-" + celTeden[0].toString().split(" ")[1] + 
     "-" + celTeden[0].toString().split(" ")[3]

    this.web.get('vrniDatumUrnik/potrjen/'+d).subscribe((r: any) => {
      this.loaded = true;
      if (r.status == 'success') {
        var index = r.urnik.urnikZaProf.map((e: any) => e.profesor).indexOf(this.profesor);
        this.urnik = r.urnik.urnikZaProf[index]
        this.jeUrnik = true;
      } else {
        this.jeUrnik = false;
      }
    })
  } 
}
