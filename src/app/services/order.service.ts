import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor() { }

  public parse(event: any): string {
    let multiSortMeta = event.multiSortMeta;
    let orderString = null;
    if (multiSortMeta !== null && multiSortMeta !== undefined) {
      orderString = '';
      multiSortMeta.forEach((item, index: number) => {
        orderString += item.field + ',' + item.order;
        if (index !== multiSortMeta.length - 1) {
          orderString += ';';
        }
      });
    } else {
      if (event.sortField != null && event.sortOrder != null) {
        orderString = event.sortField + "," + event.sortOrder;
      }
    }
    return orderString;
  }

}
