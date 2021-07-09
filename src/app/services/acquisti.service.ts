import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { FornitoriDto } from "../interfaces/fornitoriDto";
import { ArticoliAcquistatiDto } from "./articoliAcquistati.service";

export interface AcquistiDto {
    acquistoId: number;
    fornitoreId: number;
    dataFattura: any;
    numeroFattura: number;
    caricoEffettuato: boolean;
    fornitore: FornitoriDto;
    articoliAcquistati: Array<ArticoliAcquistatiDto>;
}

@Injectable({
    providedIn: 'root'
})
export class AcquistiService {

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
      

    constructor(
        private http: HttpClient,
    ){}

    getAll(
        page: number = 1,
        resultsPerPage: number = null,
        sort: string = null
    ): Observable<any> {

        const url = this.environment.host + this.environment.endpoint.acquisti +
        '?page=' + (Number.isNaN(page) ? 0 : page - 1) +
        (resultsPerPage !== null ? '&resultsPerPage=' + resultsPerPage : '') +
        (sort ? '&order=' + sort : '');

        return this.http.get(url);
    }

    caricoMagazzino(acquisto: AcquistiDto): Observable<any> {
        const url = this.environment.host + this.environment.endpoint.acquisti + this.environment.endpoint.carico;
        return this.http.patch(url, acquisto);
    }

    searchByField(
        field: any,
        page: number = 1,
        resultsPerPage: number = null,
        sort: string = null
    ): Observable<any> {

        const url = this.environment.host + this.environment.endpoint.acquisti +
        '?field=' + field +
        '&page=' + (Number.isNaN(page) ? 0 : page - 1) +
        (resultsPerPage !== null ? '&resultsPerPage=' + resultsPerPage : '') +
        (sort ? '&order=' + sort : '');

        return this.http.get(url);
    }

    saveOrUpdate(acquisto: any): Observable<any> {
        return this.http.post(this.environment.host + this.environment.endpoint.acquisti, acquisto);
    }

    delete(id: number): Observable<any> {
        return this.http.delete(this.environment.host + this.environment.endpoint.acquisti + "delete/" + id);
    }

}