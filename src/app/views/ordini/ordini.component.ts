import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { Search } from '../../containers/table-row-expansion/table-row-expansion.component';
import { ColumnType } from '../../enumerations/ColumnType';
import { EServiceResponse } from '../../enumerations/EServiceResponse';
import { Severity } from '../../enumerations/Severity';
import { TableName } from '../../enumerations/TableName';
import { BaseResponseDto } from '../../interfaces/baseResponseDto';
import { PageableDto } from '../../interfaces/pageableDto';
import { ServiceResponse } from '../../interfaces/serviceResponse';
import { ArticoliOrdinatiDto } from '../../services/articoliOrdinati.service';
import { OrderService } from '../../services/order.service';
import { OrdiniDto, OrdiniService } from '../../services/ordini.service';

@Component({
  selector: 'app-ordini',
  templateUrl: './ordini.component.html',
  styleUrls: ['./ordini.component.scss'],
  providers: [DatePipe, MessageService]
})
export class OrdiniComponent implements OnInit {

  tableName: TableName = TableName.ORDINI;
  orders: OrdiniDto[] = null;
  rowID: string = "amazonOrderId";
  expandedRowID: string = "asin";
  totalRecords: number;
  resultsPerPage: number = null;
  page: number = 1;
  loading: boolean = true;
  multiSort: boolean = true;
  reorderableColumns: boolean = true;
  resizableColumns: boolean = true;
  lastLazyLoad: LazyLoadEvent = null;
  request: any = null;
  errors: string[] = [];
  loadingSpinner: boolean = false;
  first = 0;
  search: Search = {
    placeholder: 'Cerca negli ordini...'
  };

  columnsRowExpanded: any[] = [
    {
      header: "ASIN",
      field: "asin"
    },
    {
      header: "Descrizione",
      field: "title"
    },
    {
      header: "Prezzo",
      field: "itemPriceAmount",
      type: ColumnType.PREZZO
    },
    {
      header: "Quantità ordinata",
      field: "quantityOrdered"
    },
    {
      header: "Quantità spedita",
      field: "quantityShipped"
    }
  ]

  columns: any[] = [
    {
      header: "ID",
      field: "amazonOrderId",
      selected: true
    },
    {
      header: "Data acquisto",
      field: "purchaseDate",
      selected: true
    },
    {
      header: "Stato ordine",
      field: "orderStatus",
      selected: true
    },
    {
      header: "Tipo ordine",
      field: "orderType",
      selected: true
    },
    {
      header: "Canale",
      field: "fulfillmentChannel"
    },
    {
      header: "Numero articoli spediti",
      field: "numberOfItemsShipped",
      selected: true
    },
    {
      header: "Numero articoli non spediti",
      field: "numberOfItemsUnshipped"
    },
    {
      header: "Metodo di pagamento",
      field: "paymentMethod"
    },
    {
      header: "Dettagli metodo di pagamento",
      field: "paymentMethodDetails"
    },
    {
      header: "Marketplace ID",
      field: "marketplaceId"
    },
    {
      header: "Ordine business",
      field: "isBusinessOrder",
      type: ColumnType.BOOLEAN
    },
    {
      header: "Prime",
      field: "isPrime",
      type: ColumnType.BOOLEAN
    },
    {
      header: "Abilitato GlobalExpress",
      field: "isGlobalExpressEnabled",
      type: ColumnType.BOOLEAN
    },
    {
      header: "Ordine premium",
      field: "isPremiumOrder",
      type: ColumnType.BOOLEAN
    },
    {
      header: "Venduto da AB",
      field: "isSoldByAB",
      type: ColumnType.BOOLEAN
    },
    {
      header: "Nome azienda",
      field: "companyLegalName"
    },
    {
      header: "Email compratore",
      field: "buyerEmail"
    },
    {
      header: "Nome compratore",
      field: "buyerName",
      selected: true
    }
  ]

  constructor(
    private ordiniService: OrdiniService,
    private orderService: OrderService,
    private datePipe: DatePipe,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    
  }

  lazyLoad(event: LazyLoadEvent = null) {
    if (event === null) {
      event = this.lastLazyLoad;
    }

    this.loading = true;
    this.lastLazyLoad = event;

    if (this.request) {
      this.request.unsubscribe();
    }

    let fn;
    if (this.search.defaultValue !== undefined && this.search.defaultValue !== null) {
      fn = this.ordiniService.searchByField(
        this.search.defaultValue,
        this.page,
        this.resultsPerPage,
        this.orderService.parse(event)
      );
    } else {
      fn = this.ordiniService.getAll(
        this.page,
        this.resultsPerPage,
        this.orderService.parse(event)
      );
      this.search.defaultValue = null;
    }

    if (fn) {
      fn.subscribe((resp: BaseResponseDto<PageableDto<OrdiniDto[]>>) => {
        this.loading = false;
        if (resp.status == 200 && resp.success) {
          resp.response.data.forEach((ordine: OrdiniDto) => {
            ordine.purchaseDate = ordine.purchaseDate != null ? 
              this.datePipe.transform(ordine.purchaseDate, "dd/MM/yyyy HH:mm") : "Non impostata";
            ordine.earliestShipDate = ordine.earliestShipDate != null ?
              this.datePipe.transform(ordine.earliestShipDate, "dd/MM/yyyy HH:mm") : "Non impostata";
            ordine.lastUpdateDate = ordine.lastUpdateDate != null ? 
              this.datePipe.transform(ordine.lastUpdateDate, "dd/MM/yyyy HH:mm") : "Non impostata";
            ordine.latestShipDate = ordine.latestShipDate != null ?
              this.datePipe.transform(ordine.latestShipDate, "dd/MM/yyyy HH:mm") : "Non impostata";
            ordine.articoliOrdinati.forEach((articolo: ArticoliOrdinatiDto) => {
              if (articolo.title.length >= 20) {
                articolo.title = articolo.title.substring(0, 20) + "...";
              }
            })
          });
          this.orders = resp.response.data;
          this.totalRecords = resp.response.totalCount;
          this.resultsPerPage = resp.response.resultsPerPage;
          event.rows = resp.response.totalCount;
          event.first = 0;
        }
        if (resp.error) {
          this.errors.push("Si è verificato un errore");
          this.generateToast({
            severity: Severity.ERROR, 
            summary: null, 
            detail: "Impossibile caricare gli ordini"});
        }
      });
    }
  }

  onChangeResultsPerPage(resultsPerPage: number) {
    this.resultsPerPage = resultsPerPage;
    this.onPageChanged(1);
  }

  onPageChanged(number: number) {
    this.page = number;
    this.lazyLoad();
  }

  generateToast(event) {
    this.messageService.clear();
    this.messageService.add({
      severity: event.severity, 
      summary: event.summary || (
        event.severity == Severity.ERROR ? "Si è verificato un problema" : 
        event.severity == Severity.SUCCESS ? "Operazione avvenuta con successo" : "Testo non stabilito"
        ), 
      detail: event.detail
    });
  }

  loadOrdini() {
    this.loadingSpinner = true;
    this.ordiniService.addLastOrders().subscribe((resp: BaseResponseDto<ServiceResponse<OrdiniDto[]>>) => {
      if (resp.status == 200 && resp.success) {
        const numberOfOrdersAdded = resp.response.data.length;
        this.generateToast({
          severity: Severity.SUCCESS,
          summary: "Ordini aggiornati con successo",
          detail: numberOfOrdersAdded == 0 ? "Non ci sono nuovi ordini" : (numberOfOrdersAdded + " ordini aggiunti")
        });
        this.lazyLoad();
      } else if (resp.error) {
        if (resp.response.response == EServiceResponse.ERRORE_SERVER_REMOTO) {
          this.generateToast({
            severity: Severity.ERROR,
            summary: null,
            detail: "Errore server remoto"
          });
        } else {
          this.generateToast({
            severity: Severity.ERROR,
            summary: null,
            detail: "Errore non gestito"
          });
        }
      }
      this.loadingSpinner = false;
    })
  }

  searchEvent(value: string) {
    this.search.defaultValue = value.trim().length === 0 ? null : value.trim();
    this.pageChanged(1);
  }

  pageChanged(page: number) {
    this.page = page;
    this.lazyLoad();
  }

  sorting(event) {
    if (event.multisortmeta) {
      this.lastLazyLoad.multiSortMeta = event.multisortmeta;
    }
    this.pageChanged(1);
  }

}
