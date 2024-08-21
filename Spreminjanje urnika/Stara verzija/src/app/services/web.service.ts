import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebService {

  private url = environment.url
  
  constructor(
    private http: HttpClient
  ) { }

  

  get(niz: any) {
    const header = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      })
    };
    return this.http.get(this.url + niz, header);
  }

  post(niz: any, body: any) {
    const header = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      })
    };
    return this.http.post(this.url + niz, body, header);
  }

  put(niz: any, body: any) {
    const header = {
      headers: new HttpHeaders({
        'Authorization': `${localStorage.getItem("admin")}`
      })
    };
    return this.http.put(this.url + niz, body, header);
  }

  
}
