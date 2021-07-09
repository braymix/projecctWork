import { Injectable } from '@angular/core';
import { ArticoliDto } from './articoli.service';

export class Carrello {
  item: ArticoliDto;
  quantita: number;
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  getItems(startIndex: number, endIndex: number): Carrello[] {
    var values: Carrello[] = [];
    var keys = Object.keys(localStorage);
    var i = keys.length;

    while ( i-- ) {
      if(i >= startIndex && i <= endIndex) {
        values.push(JSON.parse(localStorage.getItem(keys[i])));
      }
    }

    return values;
  }

  getAllItems(): Carrello[] {
    var values: Carrello[] = [];
    var keys = Object.keys(localStorage);
    var i = keys.length;

    while ( i-- ) {
      values.push(JSON.parse(localStorage.getItem(keys[i])));
    }

    return values;
  }

  getItem(asin: string): Carrello {
    return JSON.parse(localStorage.getItem(asin));
  }

  setItem(item: ArticoliDto, quantita: number) {
    const carrello: Carrello = {
      item: item,
      quantita: quantita
    } 
    localStorage.setItem(item.asin, JSON.stringify(carrello));
  }

  removeItem(asin: string) {
    localStorage.removeItem(asin);
  }

  clear() {
    localStorage.clear();
  }

}
