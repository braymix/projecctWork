import { Component, OnInit, Input } from "@angular/core";
import { AnalisiServiceService } from "../../services/analisi-service.service";
import { MessageService } from "primeng/api";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-analisi-dettaglio-articolo",
  templateUrl: "./analisi-dettaglio-articolo.component.html",
  styleUrls: ["./analisi-dettaglio-articolo.component.scss"],
  providers: [MessageService, DatePipe],
})
export class AnalisiDettaglioArticoloComponent implements OnInit {
  @Input() item;
  @Input() date1: Date;

  primoForm: any;
  daElaborare: any[];
  listaLabel: any[];
  listaData: any[];
  basicData: any;
  totaleGuadagno: any;
  dataInizio: any;
  dataFine: any;
  basicOptions: any;
  nArtOrd: any;
  dataProdotto: any;
  flag2 = false;
  errorFlag = false;

  constructor(
    public analisi: AnalisiServiceService,
    private messageService: MessageService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    //console.log(this.date1);
    //console.log(this.item)
    if (this.date1 == null) {
      this.errorFlag = true;
      this.showError2();
    }
    if (this.item == null) {
      this.errorFlag = true;
      this.showError();
    }
    if (!this.errorFlag) {
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
      this.totaleGuadagno = 0;
      this.nArtOrd = 0;
      this.listaLabel = [];
      this.listaData = [];
      let startS = this.datePipe.transform(this.date1[0], "yyyy-MM-dd");
      let stopS = this.datePipe.transform(this.date1[1], "yyyy-MM-dd");
      this.dataProdotto = {
        labels: [],
        datasets: [],
      };
      let list = [];

      this.dataFine = this.datePipe.transform(stopS, "dd/MM/yyyy");
      this.dataInizio = this.datePipe.transform(startS, "dd/MM/yyyy");
      this.analisi
        .sendData({
          start: startS,
          stop: stopS,
          nomeProdotto: this.item,
        })
        .subscribe((e) => {
          console.log(e.response);
          if (e.response.length == 0) {
            this.showError3();
            this.errorFlag = true;
          } else {
            this.daElaborare = e.response;
            this.daElaborare.forEach((element) => {
              let newDate = new Date(element.purchaseDate);
              this.listaLabel.push(
                newDate.getFullYear() +
                '-' +
                newDate.getMonth() +
                '-' +
                newDate.getDate()
              );
              let flagT = false;

              if (!this.flag2) {
                let temp = [];
                // console.log("primo giro: " + element.shippingAddressCity);
                temp.push(element.shippingAddressCity);
                temp.push(1);
                list.push(temp);
                this.flag2 = true;
              } else {
                list.forEach((e2) => {
                  if (e2[0] == element.shippingAddressCity) {
                    flagT = true;
                  }
                });
                if (flagT) {
                  list.forEach((e3) => {
                    if (e3[0] == element.shippingAddressCity) {
                      e3[1] += 1;
                    }
                  });
                } else {
                  let temp = [];
                  temp.push(element.shippingAddressCity);
                  temp.push(1);
                  list.push(temp);
                }
              }
              //console.log(list);
              this.dataProdotto = {
                labels: [],
                datasets: [],
              };
              let tempListS = [];
              let tempListC = [];
              this.dataProdotto.labels = [];
              //console.log(list)
              list.forEach((e4) => {
                ///console.log(e);
                this.dataProdotto.labels.push(e4[0]);
                tempListS.push(e4[1]);
                tempListC.push(this.getRandomColor());
              });
              this.dataProdotto.datasets.push({
                data: tempListS,
                backgroundColor: tempListC,
                hoverBackgroundColor: [],
              });
              //console.log(this.dataProdotto)
              element.articoliOrdinati.forEach((element2) => {
                this.listaData.push(
                  element2.itemPriceAmount * element2.quantityShipped
                );
                this.nArtOrd += element2.quantityShipped;
                this.totaleGuadagno +=
                  element2.itemPriceAmount * element2.quantityShipped;
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
                    this.item,
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
            }
            //console.log(this.daElaborare);
          }
        });
    }

    //console.log(list)
  }

  getRandomColor() {
    var color = Math.floor(0x1000000 * Math.random()).toString(16);
    return '#' + ('000000' + color).slice(-6);
  }

  showError() {
    this.messageService.add({
      severity: 'error',
      summary: 'Errore',
      detail: 'Devi inserire un nome prodotto',
    });
  }

  showError2() {
    this.messageService.add({
      severity: 'error',
      summary: 'Errore',
      detail: 'Devi inserire una data',
    });
  }

  showError3() {
    this.messageService.add({
      severity: 'error',
      summary: 'Errore',
      detail: 'Dati non presenti per l\'articolo: ' + this.item + ' nell\'ultimo mese',
    });
  }
}
