import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

import { EntityRequestFilter } from '../interfaces/entityRequestFilter';

export interface ArticoliDto {
  articoloId: number;
  asin: string;
  titolo: string;
  categoria: string;
  prezzo: number;
  giacenza: number;
  brand: string;
  sogliaDisponibilitaBassa: number;
  pathImmagine: string;
}

@Injectable({
  providedIn: 'root'
})

export class ArticoliService {

  constructor(
    private http: HttpClient
  ) {
  }
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

  getAll(page: number = 1, resultsPerPage: number = null, sort: string = null): Observable<any> { // parametri

    // costruisco la paginazione
    const url = this.environment.host + this.environment.endpoint.articoli +
      '?page=' + (Number.isNaN(page) ? 0 : page - 1) +
      (resultsPerPage !== null ? '&resultsPerPage=' + resultsPerPage : '') +
      (sort ? '&order=' + sort : '');

    return this.http.get(url);
  }

  getByAsin(asin: string): Observable<any> {
    const url = this.environment.host + this.environment.endpoint.articoli + this.environment.endpoint.asin + asin;
    return this.http.get(url);
  }

  getByTitle(titolo: string): Observable<any> {
    const url = this.environment.host + this.environment.endpoint.articoli + this.environment.endpoint.titolo + titolo;
    return this.http.get(url);
  }

  getByCategoria(categoria: string, page: number = 1, resultsPerPage: number = null, sort: string = null): Observable<any> {
    const url = this.environment.host + this.environment.endpoint.articoli + this.environment.endpoint.categoria + categoria +
      '?page=' + (Number.isNaN(page) ? 0 : page - 1) +
      (resultsPerPage !== null ? '&resultsPerPage=' + resultsPerPage : '') +
      (sort ? '&order=' + sort : '');
    return this.http.get(url);
  }

  getAllCategorie(): Observable<any> {
    const url = this.environment.host + this.environment.endpoint.articoli + this.environment.endpoint.categoria + this.environment.endpoint.allCategorie;
    return this.http.get(url);
  }

  rangePrezzo(prezzo1: number, prezzo2: number, page: number = 1, resultsPerPage: number = null, sort: string = null): Observable<any> {
    const url = this.environment.host + this.environment.endpoint.articoli + this.environment.endpoint.prezzo +
      '?prezzo1=' + prezzo1 + '&prezzo2=' + prezzo2 +
      '&page=' + (Number.isNaN(page) ? 0 : page - 1) +
      (resultsPerPage !== null ? '&resultsPerPage=' + resultsPerPage : '') +
      (sort ? '&order=' + sort : '');
    return this.http.get(url);
  }

  getItemsWithGlobalFilter(
    filters: EntityRequestFilter,
    page: number = 1, 
    resultsPerPage: number = null, 
    sort: string = null
    ): Observable<any> {

    const url = this.environment.host + this.environment.endpoint.articoli + this.environment.endpoint.globalFilter +
    '?page=' + (Number.isNaN(page) ? 0 : page - 1) +
    (resultsPerPage !== null ? '&resultsPerPage=' + resultsPerPage : '') +
    (sort ? '&order=' + sort : '');

    return this.http.post(url, filters);
  }

}
