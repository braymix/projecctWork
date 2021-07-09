import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

export interface ArticoliOrdinatiDto {
    orderItemId: string;
    asin: string;
    amazonOrderId: string;
    itemPriceAmount: number;
    itemPriceCurrencyCode: string;
    pointsGrantedPointsMonetaryValueAmount: number;
    pointsGrantedPointsMonetaryValueCurrencyCode: string;
    pointsGrantedPointsNumber: number;
    promotionIds: string;
    quantityOrdered: number;
    quantityShipped: number;
    shippingPriceAmount: number;
    shippingPriceCurrencyCode: string;
    title: string;
}

@Injectable({
    providedIn: 'root'
})
export class ArticoliOrdinatiService {

    constructor(
        private http: HttpClient
    ){}

}