
import { Component, ElementRef, ViewChild } from '@angular/core';
import { WebService } from '../web.service';
import { Route, Router } from '@angular/router';
import { DialogComponent } from '../dialog/dialog.component';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';

@Component({
  selector: 'app-placilo',
  templateUrl: './placilo.component.html',
  styleUrls: ['./placilo.component.css']
})
export class PlaciloComponent {
  
  paidFor: any;
  napaka: any;

  mail: any;
  id: any;
  name: any;
  loading: any;

  constructor(
    private web: WebService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  @ViewChild('paymentRef', {static: true}) paymentRef!: ElementRef

  ngOnInit() {


    this.id = localStorage.getItem("id")
    this.name = localStorage.getItem("name")
    this.mail = localStorage.getItem("mail")
    

    window.paypal.Buttons({
      createOrder: (data: any, actions: any) => {
        return actions.order.create({

        
        purchase_units: [
          {
            description: "Aplikacija za urnik",
            amount: {
              currency_code: "EUR",
              value: 1.99
            }
          }
        ]
      })
      },
      onApprove: async (data: any, actions: any) => {
        const order = await actions.order.capture()
        this.paidFor = true;

        this.web.post("jePLacal", {
          id: this.id,
          name: this.name,
          mail: this.mail
        }).subscribe(res => {
          this.placano()
        })
        console.log(order)
        this.placano()
      },
      onError: (err: any) => {
        console.log(err)
        this.napaka = true
        
        
      }
    }).render(this.paymentRef.nativeElement)
  }

  placano() {
    window.placal = true;
    const d = this.dialog.open(DialogComponent, {
      width: "90%"
    })
  }
}
