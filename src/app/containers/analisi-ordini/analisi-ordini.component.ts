import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import {AnalisiServiceService} from '../../services/analisi-service.service';
import {MessageService} from 'primeng/api';

@Component({
  selector: "app-analisi-ordini",
  templateUrl: "./analisi-ordini.component.html",
  styleUrls: ["./analisi-ordini.component.scss"],
  providers: [MessageService, DatePipe],
})
export class AnalisiOrdiniComponent implements OnInit {

  constructor(
    public analisi: AnalisiServiceService,
    private messageService: MessageService,
    private datePipe: DatePipe
  ) {}

  invioDati: any;
  date1: Date[];
  nome: any;
  categoria: any;
  nomeSel: any;
  categoriaSel: any;
  listaCat: any[];
  listaProd: any[];
  daElaborare: any;
  basicOptions: any;
  basicData: any;
  listaData: any[];
  listaLabel: any[];
  primoForm: boolean = false;
  cat1Sel: any;
  dateT1: Date;
  dateT2: Date;

  ngOnInit(): void {
    this.date1 = [];
    this.dateT1 = new Date();
    this.dateT2 = new Date();
    this.dateT2.setDate(this.dateT2.getDate() - 30);
    this.date1.push(this.dateT2);
    this.date1.push(this.dateT1);
    console.log(this.date1);
    this.elabora();
    this.basicOptions = {
      legend: {
        labels: {
          fontColor: '#495057',
        },
      },
      scales: {
        xAxes: [
          {
            ticks: {
              fontColor: '#495057',
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              fontColor: '#495057',
            },
          },
        ],
      },
    };

    let i = 0;
    this.analisi.getAllCat().subscribe((a) => {
      a.response.forEach((element) => {
        if (i == 0) {
          this.listaCat = [{name: element, code: element}];
        } else {
          this.listaCat.push({name: element, code: element});
        }
        i++;
      });
      this.categoria = this.listaCat;
    });
    let k = 0;
    this.analisi.getAllProd().subscribe((a) => {
      a.response.forEach((element) => {
        if (k == 0) {
          this.listaProd = [{name: element.titolo, code: element.titolo}];
        } else {
          this.listaProd.push({name: element.titolo, code: element.titolo});
        }
        k++;
      });
      this.nome = this.listaProd;
    });
  }

  elabora() {
    this.listaLabel = [];
    this.listaData = [];
    if (this.date1 != null) {
      if (this.date1[1] == null) {
        this.date1[1] = this.date1[0];
      }
      let startS = this.datePipe.transform(this.date1[0], "yyyy-MM-dd");
      let stopS = this.datePipe.transform(this.date1[1], "yyyy-MM-dd");

      if (this.categoriaSel != null && this.nomeSel == null) {
        //filtra per categoria
        this.analisi
          .sendData({
            start: startS,
            stop: stopS,
            categoria: this.categoriaSel.name,
          })
          .subscribe((e) => {
            this.daElaborare = e.response;
            this.daElaborare.forEach((element) => {
              let newDate = this.datePipe.transform(element.purchaseDate, "yyyy-MM-dd");
              this.listaLabel.push(newDate);
              element.articoliOrdinati.forEach((element2) => {
                this.listaData.push(
                  element2.itemPriceAmount * element2.quantityShipped
                );
              });
            });
            this.basicData = {
              labels: [],
              datasets: [
                {
                  label:
                    "aquisti da " +
                    this.datePipe.transform(startS, "dd/MM/yyyy") +
                    " a " +
                    this.datePipe.transform(stopS, "dd/MM/yyyy") +
                    " filtrato per categoria " +
                    this.categoriaSel.name,
                  backgroundColor: '#42A5F5',
                  data: [],
                },
              ],
            };
            this.basicData.labels = this.listaLabel;
            this.basicData.datasets[0].data = this.listaData;
            if (this.listaData.length > 0) {
              this.primoForm = true;
            } else {
              this.primoForm = false;
              this.showError2();
            }
          });
      } else if (this.categoriaSel == null && this.nomeSel != null) {
        //filtra per prodotto
        this.analisi
          .sendData({
            start: startS,
            stop: stopS,
            nomeProdotto: this.nomeSel.name,
          })
          .subscribe((e) => {
            this.daElaborare = e.response;
            this.daElaborare.forEach((element) => {
              let newDate = this.datePipe.transform(element.purchaseDate, "yyyy-MM-dd");
              this.listaLabel.push(newDate);
              element.articoliOrdinati.forEach((element2) => {
                this.listaData.push(
                  element2.itemPriceAmount * element2.quantityShipped
                );
              });
            });
            this.basicData = {
              labels: [],
              datasets: [
                {
                  label:
                    "aquisti da " +
                    this.datePipe.transform(startS, "dd/MM/yyyy") +
                    " a " +
                    this.datePipe.transform(stopS, "dd/MM/yyyy") +
                    " filtrato per prodotto " +
                    this.nomeSel.name,
                  backgroundColor: '#42A5F5',
                  data: [],
                },
              ],
            };
            this.basicData.labels = this.listaLabel;
            this.basicData.datasets[0].data = this.listaData;
            if (this.listaData.length > 0) {
              this.primoForm = true;
            } else {
              this.primoForm = false;
              this.showError2();
            }
          });
      } else if (this.categoriaSel != null && this.nomeSel != null) {
        //alert di errore non dovrebbe capitare
        this.showError();
        this.primoForm = false;
      } else {
        //filtra per data e basta
        this.analisi.sendData({start: startS, stop: stopS}).subscribe((e) => {
          this.daElaborare = e.response;
          this.daElaborare.forEach((element) => {
            let newDate = this.datePipe.transform(element.purchaseDate, "yyyy-MM-dd");
            this.listaLabel.push(newDate);
            element.articoliOrdinati.forEach((element2) => {
              this.listaData.push(
                element2.itemPriceAmount * element2.quantityShipped
              );
            });
          });
          this.basicData = {
            labels: [],
            datasets: [
              {
                label: 'Aquisti da ' + startS + ' a ' + stopS,
                backgroundColor: '#42A5F5',
                data: [],
              },
            ],
          };
          this.basicData.labels = this.listaLabel;
          this.basicData.datasets[0].data = this.listaData;
          if (this.listaData.length > 0) {
            this.primoForm = true;
          } else {
            this.primoForm = false;
            this.showError2();
          }
        });
      }
    } else {
      this.showError3();
      this.primoForm = false;
    }
  }

  nonMostrare() {
    this.primoForm = false;
  }

  showError() {
    this.messageService.add({
      severity: 'error',
      summary: 'Errore',
      detail: 'Inserisci solo la categoria o il nome del prodotto',
    });
  }

  showError2() {
    this.messageService.add({
      severity: 'error',
      summary: 'Errore',
      detail: 'Non ci sono dati disponibili per questa ricerca, riprova con più dati',
    });
  }

  showError3() {
    this.messageService.add({
      severity: 'error',
      summary: 'Errore',
      detail: 'Data non inserita',
    });
  }
}
