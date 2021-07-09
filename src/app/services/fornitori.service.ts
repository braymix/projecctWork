import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";

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

    getAll(
        page: number = 1,
        resultsPerPage: number = null,
        sort: string = null
    ): Observable<any> {

        const url = environment.host + environment.endpoint.fornitori +
        '?page=' + (Number.isNaN(page) ? 0 : page - 1) +
        (resultsPerPage !== null ? '&resultsPerPage=' + resultsPerPage : '') +
        (sort ? '&order=' + sort : '');

        return this.http.get(url);
    }

}