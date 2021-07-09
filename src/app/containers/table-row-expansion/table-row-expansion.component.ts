import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LazyLoadEvent, MessageService} from 'primeng/api';
import {Severity} from '../../enumerations/Severity';
import {BaseResponseDto} from '../../interfaces/baseResponseDto';
import {AcquistiDto} from '../../services/acquisti.service';
import {ArticoliDto, ArticoliService} from '../../services/articoli.service';
import {ArticoliAcquistatiService} from '../../services/articoliAcquistati.service';
import {Router} from '@angular/router';

export enum TableName {
  ACQUISTI,
  ORDINI
}

export enum ColumnType {
  STRING,
  NUMBER,
  DATE,
  BOOLEAN,
  CARICO_EFFETTUATO,
  PREZZO
}

export enum Actions {
  CLICK_ROW,
  CLICK_CARICO
}

export class Search {
  placeholder: string;
  defaultValue?: string;
}

@Component({
  selector: 'app-table-row-expansion',
  templateUrl: './table-row-expansion.component.html',
  styleUrls: ['./table-row-expansion.component.scss'],
  providers: [MessageService]
})
export class TableRowExpansionComponent implements OnInit {

  public prevEvent: any = null;
  public selectedColumns: any[] = [];
  readonly TableName = TableName;
  readonly ColumnType = ColumnType;
  readonly ClickRow: Actions = Actions.CLICK_ROW;
  readonly ClickCarico: Actions = Actions.CLICK_CARICO;
  public display: boolean = false;
  public articoli: any[] = [];
  public selectedItem: any;
  public selectedAcquisto: AcquistiDto;
  public articoloSelezionato: ArticoliDto = {
    articoloId: 0,
    asin: '',
    titolo: '',
    prezzo: 0,
    categoria: '',
    brand: '',
    giacenza: 0,
    sogliaDisponibilitaBassa: 0,
    pathImmagine: ''
  };
  @Input()
  public first: number = 0;
  @Input()
  public tableName: TableName;
  @Input()
  public rows: any[];
  @Input()
  public rowID: string;
  @Input()
  public expandedRowID: string;
  @Input()
  public columns: any[];
  @Input()
  public columnsRowExpanded: any[];
  @Input()
  public loading: boolean = false;
  @Input()
  public totalRecords: number;
  @Input()
  public resultsPerPage: number = 1;
  @Input()
  public reorderableColumns: boolean = false;
  @Input()
  public singleSort: boolean = true;
  @Input()
  public multiSort: boolean = false;
  @Input()
  public loadingSpinner: boolean = false;
  @Input()
  public showedAddArticolo: boolean = false;
  @Input()
  public search: Search = {placeholder: ''};
  @Output()
  public loadLazyEvent: EventEmitter<LazyLoadEvent> = new EventEmitter<LazyLoadEvent>();
  @Output()
  public clickBtnEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  public changeResultsPerPageEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  public pageChanged: EventEmitter<number> = new EventEmitter<number>();
  @Output()
  public sorting: EventEmitter<number> = new EventEmitter<number>();
  @Output()
  public generateToast: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  public loadOrdiniEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  public searchEvent: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  public onRowEditInitEvent: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  public onRowEditSaveEvent: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  public onRowEditCancelEvent: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  public onRowEditInitAEvent: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  public onRowEditSaveAEvent: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  public onRowEditCancelAEvent: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  public deleteAcquistoEvent: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  public deleteArticoloAcquistatoEvent: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  public addItemEvent: EventEmitter<any> = new EventEmitter<any>();
  private searchTimeout: any = null;

  constructor(
    private articoliService: ArticoliService,
    private articoliAcquistatiService: ArticoliAcquistatiService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.columns.forEach(col => {
      col.selected ? this.selectedColumns.push(col) : null;
    });
  }

  onLazyLoad(event: LazyLoadEvent) {
    let emit = true;

    if (this.prevEvent !== null) {
      Object.keys(this.prevEvent).find(key => {
        if (key === 'first' && this.prevEvent[key] !== event.first) {
          emit = false;
          return;
        }
      });
    }

    this.prevEvent = event;
    if (emit) {
      event.first = 0;
      this.loadLazyEvent.emit(event);
    }
  }

  onPage(event) {
    const page = event.first / event.rows + 1;
    this.pageChanged.emit(page);
  }

  onClick(rowID: any, action: Actions) {
    if (action == Actions.CLICK_CARICO) {
      this.clickBtnEvent.emit({rowID, action});
    } else {
      this.articoliService.getByAsin(rowID).subscribe((resp: BaseResponseDto<ArticoliDto>) => {
        if (resp.status == 200 && resp.success) {
          this.articoloSelezionato = resp.response;
          this.display = true;
          this.checkGiacenza(this.articoloSelezionato);
        } else if (resp.error) {
          this.generateToast.emit({
            severity: Severity.ERROR,
            summary: null,
            detail: 'Impossibile caricare articolo selezionato'
          });
        }
      });
    }
  }

  getExpandedRow(col, articolo): string {
    return col.item ? articolo.articolo[col.field] + this.isPrezzo(col) : articolo[col.field] + this.isPrezzo(col);
  }

  isPrezzo(col: any): string {
    return col.type === ColumnType.PREZZO ? ' €' : '';
  }

  dettaglio(asin: string) {
    this.router.navigate(['articoli', asin]);
  }

  closeDialog() {
    this.display = false;
  }

  checkGiacenza(articolo: ArticoliDto) {
    const giacenza: number = articolo.giacenza;
    const soglia: number = articolo.sogliaDisponibilitaBassa;
    if (giacenza < soglia) {
      this.generateToast.emit({
        severity: Severity.ERROR,
        summary: 'ATTENZIONE',
        detail: 'Giacenza minore della soglia di disponibilità'
      });
    } else if (giacenza == soglia) {
      this.generateToast.emit({
        severity: Severity.ERROR,
        summary: 'ATTENZIONE',
        detail: 'Giacenza uguale alla soglia di disponibilità'
      });
    } else if (giacenza <= (soglia + 5)) {
      this.generateToast.emit({
        severity: Severity.WARNING,
        summary: 'ATTENZIONE',
        detail: 'Giacenza vicina alla soglia di disponibilità'
      });
    }
  }

  loadOrdini() {
    this.loadOrdiniEvent.emit();
  }

  searchFn(event: any): void {
    if (this.searchTimeout !== null) {
      clearTimeout(this.searchTimeout);
    }

    this.loading = true;
    this.searchTimeout = setTimeout(() => {
      this.searchEvent.emit(event.target.value);
    }, 2000);
  }

  onSort(event) {
    this.sorting.emit(event);
  }

  onRowEditInit(row) {
    this.onRowEditInitEvent.emit(row);
  }

  onRowEditSave(row) {
    this.onRowEditSaveEvent.emit(row);
  }

  onRowEditCancel(row, ri) {
    this.onRowEditCancelEvent.emit(row);
  }

  onRowEditInitA(articolo, riA) {
    console.log(articolo, riA);
    this.onRowEditInitAEvent.emit(articolo);
  }

  onRowEditSaveA(articolo) {
    this.onRowEditSaveAEvent.emit(articolo);
  }

  onRowEditCancelA(articolo, riA) {
    this.onRowEditCancelAEvent.emit(articolo);
  }

  deleteAcquisto(row) {
    this.deleteAcquistoEvent.emit(row);
  }

  deleteArticoloAcquistato(row) {
    this.deleteArticoloAcquistatoEvent.emit(row);
  }

  showAddArticolo(row: AcquistiDto) {
    this.showedAddArticolo = true;
    this.selectedAcquisto = row;
  }

  filter(event) {
    let filtered: any[] = [];
    this.articoliService.getByTitle(event.query).subscribe((resp: BaseResponseDto<ArticoliDto[]>) => {
      if (resp.status == 200 && resp.success) {
        resp.response.forEach((art: ArticoliDto) => {
          filtered.push(art.titolo);
        });
        this.articoli = filtered;
      }
    });
  }

  add() {
    this.addItemEvent.emit({
      acquistoId: this.selectedAcquisto.acquistoId,
      item: this.selectedItem
    });
  }

}
