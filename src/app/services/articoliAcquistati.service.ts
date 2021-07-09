import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { InsertItemDto } from "../interfaces/insertItemDto";
import { ArticoliDto } from "./articoli.service";

export interface ArticoliAcquistatiDto {
    articoloAcquistatoId: number;
    acquistoId: number;
    articoloId: number;
    quantitaAcquistata: number;
    prezzoUnitarioAcquisto: number;
    articolo: ArticoliDto;
}

@Injectable({
    providedIn: 'root'
})
export class ArticoliAcquistatiService {

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

    saveOrUpdate(articolo: ArticoliAcquistatiDto): Observable<any> {
        return this.http.post(this.environment.host + this.environment.endpoint.articoliAcquistati, articolo);
    }

    delete(id: number): Observable<any> {
        return this.http.delete(this.environment.host + this.environment.endpoint.articoliAcquistati + "delete/" + id);
    }
    
    insert(insertItemDto: InsertItemDto): Observable<any> {
        return this.http.post(this.environment.host + this.environment.endpoint.articoliAcquistati + insertItemDto.idAcquisto, insertItemDto);
    }

}