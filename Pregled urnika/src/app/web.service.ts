import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WebService {

  private url = "http://localhost:3000/api/";
  //private url = "https://sprememba.urnik-preseren.com/api/"

  constructor(
    private http: HttpClient
  ) { }


  get(niz: any) {
    return this.http.get(this.url + niz);
  }

  post(niz: any, body: any) {
    return this.http.post(this.url + niz, body);
  }
}
