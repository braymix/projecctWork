import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

export interface FornitoriDto {
    fornitoreId: number;
    nome: string;
}

@Injectable({
    providedIn: 'root'
})
export class FornitoriService {

    constructor(
        private http: HttpClient
    ){}
    environment = {
        production: false,
        host: "https://polo-nord-backend.azurewebsites.net/api/",
        endpoint: {
          'articoli': 'articoli/',
          'ordini': 'ordini/',
          'acquisti': 'acquisti/',
          'fornitori': 'fornitori/',
          'carico': 'carico/',
          'asin': 'asin/',
          'titolo': 'titolo/',
          'categoria' : 'categoria/',
          'addLastOrders': 'addLastOrders/',
          'prezzo': 'prezzo',
          'allCategorie' : 'allCategorie',
          'globalFilter': 'globalFilter',
          'articoliAcquistati': 'articoliAcquistati/'
        }
      }

    getAll(
        page: number = 1,
        resultsPerPage: number = null,
        sort: string = null
    ): Observable<any> {

        const url = this.environment.host + this.environment.endpoint.fornitori +
        '?page=' + (Number.isNaN(page) ? 0 : page - 1) +
        (resultsPerPage !== null ? '&resultsPerPage=' + resultsPerPage : '') +
        (sort ? '&order=' + sort : '');

        return this.http.get(url);
    }

}