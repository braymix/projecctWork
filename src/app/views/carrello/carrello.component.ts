import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { EServiceResponse } from '../../enumerations/EServiceResponse';
import { Severity } from '../../enumerations/Severity';
import { BaseResponseDto } from '../../interfaces/baseResponseDto';
import { FornitoriDto } from '../../interfaces/fornitoriDto';
import { PageableDto } from '../../interfaces/pageableDto';
import { ServiceResponse } from '../../interfaces/serviceResponse';
import { AcquistiDto, AcquistiService } from '../../services/acquisti.service';
import { ArticoliDto } from '../../services/articoli.service';
import { FornitoriService } from '../../services/fornitori.service';
import { OrderService } from '../../services/order.service';
import { Carrello, StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-carrello',
  templateUrl: './carrello.component.html',
  styleUrls: ['./carrello.component.scss'],
  providers: [MessageService]
})
export class CarrelloComponent implements OnInit {

  selectedColumns: any[] = [];
  carrello: Carrello[] = [];
  selectedItems: Carrello[] = [];
  first: number = 0;
  totalRecords: number = 0;
  reorderableColumns: boolean = true;
  rowID: string = "asin";
  loading: boolean = true;
  resultsPerPage: number = 10;
  form: FormGroup;
  search: any = {
    placeholder: "Cerca negli articoli",
    defaultValue: ""
  }
  fornitori: any[] = [];
  submitted: boolean = false;
  fornitore: any;
  newAcquisto: any;
  articoliAcquistati: any[] = [];
  articoloAcquistato: any;
  isDisabled = false;

  columns: any[] = [
    {
      header: "ASIN",
      field: "asin",
      selected: true
    },
    {
      header: "Descrizione",
      field: "titolo",
      selected: true
    },
    {
      header: "Categoria",
      field: "categoria"
    },
    {
      header: "Giacenza",
      field: "giacenza"
    },
    {
      header: "Brand",
      field: "brand"
    },
    {
      header: "Soglia disponibilità bassa",
      field: "sogliaDisponibilitaBassa"
    }
  ]

  get f() {
    return this.form.controls;
  }

  art: ArticoliDto;

  constructor(
    private storageService: StorageService,
    private fornitoriService: FornitoriService,
    private orderService: OrderService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private acquistiService: AcquistiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.columns.forEach(col => {
      col.selected ? this.selectedColumns.push(col) : null
    });
    this.fornitoriService.getAll(1, 100, this.orderService.parse({sortField: "nome", sortOrder: 1}))
      .subscribe((resp: BaseResponseDto<PageableDto<FornitoriDto[]>>) => {
        resp.response.data.forEach((fornitore: FornitoriDto) => {
          this.fornitori.push(fornitore);
        });
    });
    this.form = this.fb.group({
      fornitore: [null, [
        Validators.required
      ]],
      numeroFattura: [null]
    });
  }

  lazyLoad() {
    setTimeout(()=> {
      this.loading = true; 
      this.selectedItems = this.storageService.getItems(this.first, this.first + this.resultsPerPage - 1);
      this.selectedItems.forEach(e => {
        e.item.prezzo = Number(e.item.prezzo.toFixed(2))
      })
      this.carrello = this.storageService.getAllItems();
      this.totalRecords = this.carrello.length;
      this.loading = false;
    }, 1);
  }

  onInput(event, row: Carrello) {
    const val = event.value;
    this.storageService.setItem(row.item, (!val || val < 1 || !Number.isInteger(val)) ? 1 : val <= 100 ? val : 100);
    this.loadCarrello();
  }

  loadCarrello() {
    this.carrello = this.storageService.getAllItems();
  }

  remove(row: Carrello) {
    this.storageService.removeItem(row.item.asin);
    this.lazyLoad();
  }

  getPrezzo(row: Carrello): number {
    return row.item.prezzo * row.quantita;
  }

  getTotale(): number {
    var totale: number = 0;
    this.carrello.forEach(e => {
      totale += (this.getPrezzo(e));
    })
    return totale;
  }

  toString(num: number): string {
    return num.toFixed(2).toString().replace(',','x').replace('.',',').replace('x','.');
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

  effettuaAcquisto() {
    this.submitted = true;
    this.isDisabled = true;

    this.carrello.forEach((e: Carrello) => {
      this.articoloAcquistato = {
        articoloId: e.item.articoloId,
        prezzoUnitarioAcquisto: e.item.prezzo,
        quantitaAcquistata: e.quantita
      }
      this.articoliAcquistati.push(this.articoloAcquistato);
    });

    this.newAcquisto = {
      dataFattura: new Date(),
      numeroFattura: this.form.controls.numeroFattura.value,
      caricoEffettuato: false,
      fornitoreId: this.form.controls.fornitore.value,
      articoliAcquistati: this.articoliAcquistati
    }

    this.acquistiService.saveOrUpdate(this.newAcquisto).subscribe((resp: BaseResponseDto<ServiceResponse<AcquistiDto>>) => {
      if (resp.status == 200 && resp.success) {
        this.storageService.clear();
        this.generateToast({
          severity: Severity.SUCCESS,
          summary: null,
          detail: 'Acquisto effettuato correttamente'
        });
        this.lazyLoad();
        this.router.navigate(["acquisti"]);
      } else if (resp.error) {
        if (resp.response.response == EServiceResponse.EMPTY_DTO) {
          this.generateToast({
            severity: Severity.ERROR,
            summary: "Acquisto non effettuato",
            detail: 'Acquisto vuoto'
          });
        } else if (resp.response.response == EServiceResponse.CREATE_FAILED) {
          this.generateToast({
            severity: Severity.ERROR,
            summary: "Acquisto non effettuato",
            detail: 'Inserimento non riuscito'
          });
        }
        this.isDisabled = false;
      }
    });
    this.submitted = false;
  }

}
