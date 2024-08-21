import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class ShareService {

  private subject = new Subject<any>();
  private subject2 = new Subject<any>();
  private subject3 = new Subject<any>();
  private subject4 = new Subject<any>();


  send(x: any) {
    this.subject.next(x);
  }

  get():Observable<any> {
    return this.subject.asObservable()
  }

  posljiShranjeno(x: any) {
    this.subject3.next(x);
  }

  getShranjeno() {
    return this.subject3.asObservable()
  }

  posljiProste(x: any) {
    this.subject2.next(x);
  }

  najdiProste():Observable<any> {
    return this.subject2.asObservable()
  }

  posljiSporocilo(x: any, d: any, dan: any) {
    this.subject4.next({x, d, dan});
  }

  pokaziSporocilo() {
    return this.subject4.asObservable()
  }

  constructor() { }
}
