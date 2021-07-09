import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageTokenService } from './storage-token.service';
import { tokenName } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class AnalisiServiceService {

  constructor(private http: HttpClient ,public t:StorageTokenService) { }
  private readonly host = "http://localhost:4000/api";

  public headers_object = new HttpHeaders().set("Authorization", "Bearer " + this.t.getToken());


  public httpOptions = {
    headers: this.headers_object
  };

  public sendData(body: any): Observable<any> {
    return this.http.post(this.host + "/analisi",body,this.httpOptions);
  }

  public getAllProd(): Observable<any> {
    return this.http.get(this.host + "/analisi/getAllName",this.httpOptions);
  }

  public getAllCat(): Observable<any> {
    return this.http.get(this.host + "/analisi/getAllCategories",this.httpOptions);
  }
  
}
