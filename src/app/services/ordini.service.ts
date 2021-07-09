import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { ArticoliOrdinatiDto } from "./articoliOrdinati.service";

export interface OrdiniDto {
  amazonOrderId: string;
  purchaseDate: any;
  lastUpdateDate: any;
  paymentMethod: string;
  orderStatus: string;
  isPrime: boolean;
  isBusinessOrder: boolean;
  orderType: string;
  latestShipDate: any;
  buyerEmail: string;
  isSoldByAB: boolean;
  marketplaceId: string;
  isPremiumOrder: false;
  buyerName: string;
  earliestShipDate: any;
  companyLegalName: string;
  purchaseOrderNumber: number;
  shippingAddressName: string;
  shippingAddressLine1: string;
  shippingAddressCity: string;
  shippingCityStateOrRegion: string;
  numberOfItemsUnshipped: number;
  shippingStateOrRegionPostalCode: string;
  paymentMethodDetails: string;
  shipmentServiceLevelCategory: string;
  numberOfItemsShipped: number;
  isGlobalExpressEnabled: boolean;
  fulfillmentChannel: string;
  articoliOrdinati: Array<ArticoliOrdinatiDto>;
}

@Injectable({
  providedIn: "root",
})
export class OrdiniService {
  constructor(private http: HttpClient) {}

  getAll(
    page: number = 1,
    resultsPerPage: number = null,
    sort: string = null
  ): Observable<any> {
    const url =
      environment.host +
      environment.endpoint.ordini +
      "?page=" +
      (Number.isNaN(page) ? 0 : page - 1) +
      (resultsPerPage !== null ? "&resultsPerPage=" + resultsPerPage : "") +
      (sort ? "&order=" + sort : "");

    return this.http.get(url);
  }

  addLastOrders(): Observable<any> {
    return this.http.post(
      environment.host +
        environment.endpoint.ordini +
        environment.endpoint.addLastOrders,
      null
    );
  }

  searchByField(
    field: any,
    page: number = 1,
    resultsPerPage: number = null,
    sort: string = null
  ): Observable<any> {
    const url =
      environment.host +
      environment.endpoint.ordini +
      "?field=" +
      field +
      "&page=" +
      (Number.isNaN(page) ? 0 : page - 1) +
      (resultsPerPage !== null ? "&resultsPerPage=" + resultsPerPage : "") +
      (sort ? "&order=" + sort : "");

    return this.http.get(url);
  }
}
