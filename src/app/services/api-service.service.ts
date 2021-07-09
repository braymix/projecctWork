import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  private readonly host = "http://localhost:4000/api"
  constructor(private http: HttpClient) {}

  public login(body: any): Observable<any> {
    return this.http.post(this.host + "/auth/signin",body);
  }

}
