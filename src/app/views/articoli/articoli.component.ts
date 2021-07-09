import {Component, OnInit, ViewChild} from '@angular/core';
import {ArticoliDto, ArticoliService} from '../../services/articoli.service';
import {Router} from '@angular/router';
import {LazyLoadEvent, MessageService, SelectItem} from 'primeng/api';
import {OrderService} from '../../services/order.service';
import {Severity} from '../../enumerations/Severity';
import {StorageService} from '../../services/storage.service';
import {DataView} from 'primeng/dataview';
import {ToggleButton} from 'primeng/togglebutton';
import {EntityRequestFilter} from '../../interfaces/entityRequestFilter';
import {ETipoGiacenza} from '../../enumerations/ETipoGiacenza';

@Component({
  selector: 'app-articoli',
  templateUrl: './articoli.component.html',
  styleUrls: ['./articoli.component.scss'],
  providers: [MessageService]
})
export class ArticoliComponent implements OnInit {

  data: any[] = []; // articoli
  //orders
  sortOptions: SelectItem[];
  sortKey: string;
  sortField: string;
  sortOrder: number;
  lastLazyLoad: LazyLoadEvent = null;
  // page
  totalRecords: number;
  resultsPerPage: number = 9;
  page: number = 1;
  first: number = 0;
  loading: boolean = true;
  request: any = null;
  // find categoria
  search: any = {placeholder: 'Cerca negli aquisti'};
  findCategoria: string = '';
  displayPosition: boolean = false;
  position: string;
  checkedOrd: boolean = true;
  // filter categoy
  selectedCategoria: any;
  filteredCategoria: any;
  allCategories: any;
  // slider
  minPrezzoRange: number = 0;
  maxPrezzoRange: number = 100;
  rangeValues: number[] = [0, 50];
  rangePrezzoTriggered: boolean = false;
  @ViewChild('dt') dataView: DataView;
  @ViewChild('tb') toggleButton: ToggleButton;
  filters: EntityRequestFilter = {
    prezzo: [0, 50],
    categoria: '',
    titolo: '',
    tipoGiacenza: ETipoGiacenza.ALL
  };
  searchByTitle: boolean = false;
  searchByCategoria: boolean = false;
  searchByGiacenza: boolean = false;
  sliderGiacenza: number = 0;
  descrizioneGiacenza: string = 'Tutti gli articoli';
  sliderColors: string[] = [
    'var(--success)',
    'var(--success)',
    'var(--warning)',
    'var(--danger)'
  ];
  descrizioniGiacenza: string[] = [
    'Tutti gli articoli',
    'Articoli disponibili',
    'Disponibilità bassa',
    'Articoli non disponibili'
  ];
  tipiGiacenza: any[] = [
    ETipoGiacenza.ALL,
    ETipoGiacenza.OK,
    ETipoGiacenza.WARNING,
    ETipoGiacenza.DANGER
  ];

  constructor(
    public router: Router,
    public articoliService: ArticoliService,
    public orderService: OrderService,
    private messageService: MessageService,
    private storageService: StorageService
  ) {
  }

  // first function called when component is created
  ngOnInit(): void {

    // list dropdown for ordininig items
    this.sortOptions = [
      {label: 'Titolo', value: 'titolo'},
      {label: 'Categoria', value: 'categoria'},
      {label: 'Prezzo', value: 'prezzo'}
    ];

    this.articoliService.getAllCategorie()
      .subscribe(resp => this.allCategories = resp.response);

  }

  // ordinamento dropdown event, not in dialog pop-up
  onSortChange(event: { value: any; checked: boolean; }, key: string = null) {
    let value = event.value == null ? key : event.value;
    if (this.toggleButton.checked) {
      this.sortOrder = 1;
      this.sortField = value;
    } else {
      this.sortOrder = -1;
      this.sortField = value;
    }
  }

  // lazy load table
  lazyLoad(event: LazyLoadEvent = null) {

    if (event === null) {
      event = this.lastLazyLoad;
    }

    this.loading = true;
    this.lastLazyLoad = event;

    if (this.request) {
      this.request.unsubscribe();
    }

    this.page = (event.first / event.rows) + 1; // calculate rows

    let fn;

    this.searchByTitle = false;
    this.searchByCategoria = false;
    this.searchByGiacenza = false;

    if (this.descrizioneGiacenza !== undefined && this.descrizioneGiacenza !== null) {
      this.searchByGiacenza = true;
    }
    if (this.search.defaultValue !== undefined && this.search.defaultValue !== null && this.search.defaultValue != '') { // search filter
      this.searchByTitle = true;
    }
    if (this.selectedCategoria != '' && this.selectedCategoria !== null) { // order category
      this.searchByCategoria = true;
    }

    if (this.searchByTitle || this.searchByCategoria || (this.sortField !== null && this.sortField !== '') || this.searchByGiacenza) {
      this.filters = {
        titolo: this.searchByTitle ? this.search.defaultValue : '',
        categoria: !this.searchByCategoria ? '' : this.selectedCategoria ? this.selectedCategoria : '',
        prezzo: this.rangeValues ? this.rangeValues : [0, 50],
        tipoGiacenza: this.searchByGiacenza ? this.tipiGiacenza[this.sliderGiacenza] : ETipoGiacenza.ALL
      };
      fn = this.articoliService.getItemsWithGlobalFilter(
        this.filters,
        this.page,
        this.resultsPerPage,
        this.orderService.parse(event)
      );
    } else {
      this.filters = {
        titolo: '',
        categoria: '',
        prezzo: [0, 50],
        tipoGiacenza: ETipoGiacenza.ALL
      };
      fn = this.articoliService.getItemsWithGlobalFilter( // get all
        this.filters,
        this.page,
        this.resultsPerPage,
        this.orderService.parse(event)
      );
      this.search.defaultValue = '';
    }
    // fetch data
    fn.subscribe(resp => {
      if (resp.status == 200 && resp.response != null && resp.success == true) {
        this.data = resp.response.data;
        this.totalRecords = resp.response.totalCount;
        this.resultsPerPage = resp.response.resultsPerPage;
        event.rows = resp.response.totalCount;
        event.first = 0;
      } else {
        if (resp.error) {
          this.generateToast({
            severity: Severity.ERROR,
            summary: 'Errore server',
            detail: 'Impossibile caricare gli articoli'
          });
        }
      }
    });
  }

  onClear(event) {
    this.lazyLoad();
  }

  // dialog
  showPositionDialog(position: string) {
    this.position = position;
    this.displayPosition = true;
  }

  // toast message
  generateToast(event: { severity: any; summary: any; detail: any; }) {
    this.messageService.clear();
    this.messageService.add({
      severity: event.severity,
      summary: event.summary,
      detail: event.detail
    });
  }

  // filter for title
  filter(value) {
    this.search.defaultValue = value.target.value.trim().length === 0 ? null : value.target.value.trim();
    this.dataView.first = 0;
    this.lazyLoad();
  }

  // show filtered categories
  filterCategory(event: { query: any; }) {

    let filtered: any[] = [];
    let query = event.query; // text input of textbox

    for (let i = 0; i < this.allCategories.length; i++) {
      let dataFiltered = this.allCategories[i];
      if (dataFiltered.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(dataFiltered);
      }
    }
    this.filteredCategoria = filtered;
  }

  // function callback for orders items
  handleChangeOrder(event: { value: any; checked: boolean; }) {
    this.onSortChange(event, this.sortKey);
  }

  // function for show the category selected
  chooseCategory() {
    this.findCategoria = this.selectedCategoria;
    if (this.findCategoria == null || this.findCategoria == '') {
      this.page = 0;
    }
    this.lazyLoad();
    this.findCategoria = ''; // va solo la prima volta
  }

  addToCart(item: ArticoliDto) {
    const itemAlreadyPresent = this.storageService.getItem(item.asin);
    if (itemAlreadyPresent != null) {
      this.storageService.setItem(item, itemAlreadyPresent.quantita + 1);
    } else {
      this.storageService.setItem(item, 1);
    }
    this.generateToast({
      severity: Severity.SUCCESS,
      summary: 'Operazione avvenuta con successo',
      detail: 'Articolo aggiunto al carrello'
    });
    this.lazyLoad();
  }

  // get items between price1-price2
  rangePrice(event: number[]) {
    // this.maxRangePrice = event[1]>=100 ? event[1] + 20 : 100; // se volete l'incremento automatico
    this.minPrezzoRange = event[0];
    this.maxPrezzoRange = event[1];
    this.rangePrezzoTriggered = true;
    this.lazyLoad();
    this.rangePrezzoTriggered = false;

  }

  dettaglioArticolo(event: { asin: any; }) {
    this.router.navigate(['articoli', event.asin]);
  }

  onChange(event) {
    const maxRangePrice = event[1] >= (this.maxPrezzoRange * 0.8) ?
      event[1] + 20 :
      (event[1] < (this.maxPrezzoRange * 0.8) && event[1] > (this.maxPrezzoRange * 0.6) && event[1] > 120) ?
        event[1] - 20 : this.maxPrezzoRange; // se volete l'incremento automatico
    this.minPrezzoRange = event[0];
    this.maxPrezzoRange = maxRangePrice;
  }

  onChangeGiacenza(value) {
    const color = this.sliderColors[value];
    this.sliderGiacenza = value;
    this.descrizioneGiacenza = this.descrizioniGiacenza[value];
    document.documentElement.style.setProperty('--colorGiacenzaSlider', color);
  }

  onSlideEndGiacenza() {
    this.lazyLoad();
  }

  // get items between price1-price2
  onSlideEnd() {
    this.rangePrezzoTriggered = true;
    this.lazyLoad();
    this.rangePrezzoTriggered = false;
  }
  
}
