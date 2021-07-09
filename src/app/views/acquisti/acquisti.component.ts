import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { Actions } from '../../enumerations/Actions';
import { ColumnType } from '../../enumerations/ColumnType';
import { EServiceResponse } from '../../enumerations/EServiceResponse';
import { Severity } from '../../enumerations/Severity';
import { TableName } from '../../enumerations/TableName';
import { BaseResponseDto } from '../../interfaces/baseResponseDto';
import { InsertItemDto } from '../../interfaces/insertItemDto';
import { PageableDto } from '../../interfaces/pageableDto';
import { ServiceResponse } from '../../interfaces/serviceResponse';
import { AcquistiDto, AcquistiService } from '../../services/acquisti.service';
import { ArticoliAcquistatiDto, ArticoliAcquistatiService } from '../../services/articoliAcquistati.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-acquisti',
  templateUrl: './acquisti.component.html',
  styleUrls: ['./acquisti.component.scss'],
  providers: [DatePipe, MessageService]
})
export class AcquistiComponent implements OnInit {

  tableName: TableName = TableName.ACQUISTI;
  acquisti: AcquistiDto[] = null;
  rowID: string = "acquistoId";
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
  search: any = {placeholder: "Cerca negli aquisti"};
  first: number = 0;
  showedAddArticolo: boolean = false;
  clonedAcquisti: { [s: string]: AcquistiDto; } = {};
  clonedArticoli: Map<number, ArticoliAcquistatiDto> = new Map<number, ArticoliAcquistatiDto>();

  columnsRowExpanded: any[] = [
    {
      header: "ASIN",
      field: "asin",
      item: true
    },
    {
      header: "Quantità acquistata",
      field: "quantitaAcquistata",
      editable: true
    },
    {
      header: "Descrizione",
      field: "titolo",
      item: true
    },
    {
      header: "Prezzo unitario",
      field: "prezzoUnitarioAcquisto",
      type: ColumnType.PREZZO,
      editable: true
    },
    {
      header: "Categoria",
      field: "categoria",
      item: true
    }
  ]

  columns: any[] = [
    {
      header: "Numero fattura",
      field: "numeroFattura",
      editable: true,
      selected: true
    },
    {
      header: "Data fattura",
      field: "dataFattura",
      editable: true,
      selected: true
    },
    {
      header: "Fornitore",
      field: "nome",
      supplier: true,
      selected: true
    },
    {
      header: "Carico effettuato",
      field: "caricoEffettuato",
      type: ColumnType.CARICO_EFFETTUATO,
      selected: true
    }
  ]

  constructor(
    private acquistiService: AcquistiService,
    private articoliAcquistatiService: ArticoliAcquistatiService,
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
      fn = this.acquistiService.searchByField(
        this.search.defaultValue,
        this.page,
        this.resultsPerPage,
        this.orderService.parse(event)
      );
    } else {
      fn = this.acquistiService.getAll(
        this.page,
        this.resultsPerPage,
        this.orderService.parse(event)
      );
      this.search.defaultValue = null;
    }

    if (fn) {
      fn.subscribe((resp: BaseResponseDto<PageableDto<AcquistiDto[]>>) => {
        this.loading = false;
        if (resp.status == 200 && resp.success) {
          resp.response.data.forEach((acquisto: AcquistiDto) => {
            acquisto.dataFattura = acquisto.dataFattura != null ?
              this.datePipe.transform(acquisto.dataFattura, "dd/MM/yyyy HH:mm") : "Non impostata";
            acquisto.articoliAcquistati.forEach((articoloAcquistato: ArticoliAcquistatiDto) => {
              if (articoloAcquistato.articolo.titolo.length >= 20) {
                articoloAcquistato.articolo.titolo = articoloAcquistato.articolo.titolo.substring(0, 20) + "...";
              }
            })
          });
          this.acquisti = resp.response.data;
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
            detail: "Impossibile caricare gli acquisti"
          });
        }
      });
    }
  }

  onClick(event) {
    const rowId: any = event.rowID;
    const action: Actions = event.action;
    switch (action) {
      case Actions.CLICK_CARICO: {
        var acquisto: AcquistiDto = {
          acquistoId: rowId,
          numeroFattura: 0,
          fornitoreId: 0,
          dataFattura: null,
          caricoEffettuato: null,
          fornitore: null,
          articoliAcquistati: null
        }
        this.acquistiService.caricoMagazzino(acquisto).subscribe((resp: BaseResponseDto<EServiceResponse>) => {
          if (resp.status == 200 && resp.success == true) {
            this.generateToast({
              severity: Severity.SUCCESS, 
              summary: null, 
              detail: "Carico del magazzino effettuato"
            });
            this.lazyLoad();
          }
          if (resp.error) {
            if (resp.response == EServiceResponse.CARICO_FAILED) {
              this.generateToast({
                severity: Severity.ERROR, 
                summary: null, 
                detail: "Carico del magazzino fallito"
              });
            } else if (resp.response == EServiceResponse.CARICO_GIA_EFFETTUATO) {
              this.generateToast({
                severity: Severity.WARNING, 
                sumary: null, 
                detail: "Carico del magazzino già effettuato"
              });
            }
          }
        })
      }
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

  OnRowEditInit(row: AcquistiDto) {
    this.clonedAcquisti[row.acquistoId] = {...row};
  }

  onRowEditSave(row: AcquistiDto) {
    delete this.clonedAcquisti[row.acquistoId];
    const updateAcquisto: AcquistiDto = {
      acquistoId: row.acquistoId,
      articoliAcquistati: row.articoliAcquistati,
      caricoEffettuato: row.caricoEffettuato,
      dataFattura: new Date(this.datePipe.transform(row.dataFattura, "yyyy-dd-MM HH:mm")),
      fornitore: row.fornitore,
      fornitoreId: row.fornitoreId,
      numeroFattura: row.numeroFattura
    }
    this.acquistiService.saveOrUpdate(updateAcquisto).subscribe((resp: BaseResponseDto<ServiceResponse<AcquistiDto>>) => {
      if (resp.status == 200 && resp.success) {
        this.generateToast({
          severity: Severity.SUCCESS, 
          summary: null, 
          detail: "Acquisto modificato con successo"
        });
      } else if (resp.error) {
        this.generateToast({
          severity: Severity.ERROR, 
          summary: null, 
          detail: "Non è stato possibile modificare l'acquisto"
        });
      }
      this.lazyLoad();
    });
  }

  onRowEditCancel(row: AcquistiDto) {
    this.lazyLoad();
    delete this.clonedAcquisti[row.acquistoId];
  }

  OnRowEditInitA(articolo: ArticoliAcquistatiDto) {
    this.clonedArticoli.set(articolo.articoloAcquistatoId, articolo);
  }

  onRowEditSaveA(articolo: ArticoliAcquistatiDto) {
    this.clonedArticoli.delete(articolo.articoloAcquistatoId);
    this.articoliAcquistatiService.saveOrUpdate(articolo).subscribe((resp: BaseResponseDto<ServiceResponse<AcquistiDto>>) => {
      if (resp.status == 200 && resp.success) {
        this.generateToast({
          severity: Severity.SUCCESS, 
          summary: null, 
          detail: "Acquisto modificato con successo"
        });
      } else if (resp.error) {
        this.generateToast({
          severity: Severity.ERROR, 
          summary: null, 
          detail: "Non è stato possibile modificare l'acquisto"
        });
      }
      this.lazyLoad();
    });
  }

  onRowEditCancelA(articolo: ArticoliAcquistatiDto) {
    this.lazyLoad();
    this.clonedArticoli.delete(articolo.articoloAcquistatoId);
  }

  deleteAcquisto(row: AcquistiDto) {
    this.acquistiService.delete(row.acquistoId).subscribe((resp: BaseResponseDto<EServiceResponse>) => {
      if (resp.status == 200 && resp.success) {
        this.generateToast({
          severity: Severity.SUCCESS, 
          summary: null, 
          detail: "Acquisto eliminato correttamente"
        });
      } else {
        this.generateToast({
          severity: Severity.ERROR, 
          summary: null, 
          detail: "Non è stato possibile eliminare l'acquisto"
        });
      }
      this.lazyLoad();
    });
  }

  deleteArticoloAcquistato(articolo: ArticoliAcquistatiDto) {
    this.articoliAcquistatiService.delete(articolo.articoloAcquistatoId).subscribe((resp: BaseResponseDto<EServiceResponse>) => {
      if (resp.status == 200 && resp.success) {
        this.generateToast({
          severity: Severity.SUCCESS, 
          summary: null, 
          detail: "Articolo eliminato correttamente"
        });
      } else {
        this.generateToast({
          severity: Severity.ERROR, 
          summary: null, 
          detail: "Non è stato possibile eliminare l'articolo"
        });
      }
      this.lazyLoad();
    });
  }

  addItem(event) {
    const insertItemDto: InsertItemDto = {
      idAcquisto: event.acquistoId,
      titolo: event.item
    }
    this.articoliAcquistatiService.insert(insertItemDto)
      .subscribe((resp: BaseResponseDto<ServiceResponse<ArticoliAcquistatiDto>>) => {
        if (resp.status == 200 && resp.success) {
          this.generateToast({
            severity: Severity.SUCCESS, 
            summary: null, 
            detail: "Articolo inserito con successo"
          });
          this.showedAddArticolo = false;
          this.lazyLoad();
        } else if (resp.response.response == EServiceResponse.ARTICOLO_GIA_PRESENTE) {
          this.generateToast({
            severity: Severity.ERROR, 
            summary: null, 
            detail: "Articolo già presente"
          });
        } else {
          this.generateToast({
            severity: Severity.ERROR, 
            summary: null, 
            detail: "Articolo non trovato"
          });
        }
      });
  }

}
