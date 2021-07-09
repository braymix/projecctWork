import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
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

    saveOrUpdate(articolo: ArticoliAcquistatiDto): Observable<any> {
        return this.http.post(environment.host + environment.endpoint.articoliAcquistati, articolo);
    }

    delete(id: number): Observable<any> {
        return this.http.delete(environment.host + environment.endpoint.articoliAcquistati + "delete/" + id);
    }
    
    insert(insertItemDto: InsertItemDto): Observable<any> {
        return this.http.post(environment.host + environment.endpoint.articoliAcquistati + insertItemDto.idAcquisto, insertItemDto);
    }

}