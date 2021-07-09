import {Component, OnInit} from '@angular/core';
import {MessageService} from 'primeng/api';
import {AnalisiServiceService} from '../../services/analisi-service.service';

@Component({
  selector: 'app-analisi-totale-torta',
  templateUrl: './analisi-totale-torta.component.html',
  styleUrls: ['./analisi-totale-torta.component.scss'],
  providers: [MessageService],
})
export class AnalisiTotaleTortaComponent implements OnInit {
  primoForm: boolean = false;
  dataCategoria: any;
  dataProdotto: any;
  nome: any;
  categoria: any;
  date1: Date;
  listaCat: any[];
  listaProd: any[];
  flagToast: boolean = false;

  constructor(
    public analisi: AnalisiServiceService,
    private messageService: MessageService
  ) {
    this.dataCategoria = {
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: [],
          hoverBackgroundColor: [],
        },
      ],
    };
  }

  ngOnInit(): void {
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
    this.flagToast = false;
    if (this.date1 != null) {
      if (this.date1[1] == null) {
        this.date1[1] = this.date1[0];
      }
      let startS =
        this.date1[0].getFullYear() +
        '-' +
        this.date1[0].getMonth() +
        '-' +
        this.date1[0].getDate();
      let stopS =
        this.date1[1].getFullYear() +
        '-' +
        this.date1[1].getMonth() +
        '-' +
        this.date1[1].getDate();

      //elaborazione per nome del prodotto
      let arrayBiNamePrice = [];

      let first = true;
      this.analisi.sendData({start: startS, stop: stopS}).subscribe((e) => {
        e.response.forEach((element) => {
          let flag = false;

          if (first) {
            element.articoliOrdinati.forEach((elementArtOrd) => {
              let arr = [];
              arr.push(elementArtOrd.title);
              arr.push(
                elementArtOrd.itemPriceAmount * elementArtOrd.quantityShipped
              );
              arrayBiNamePrice.push(arr);
            });
            first = false;
          } else {
            arrayBiNamePrice.forEach((element2) => {
              element.articoliOrdinati.forEach((elementArtOrd) => {
                if (element2[0] == elementArtOrd.title) {
                  flag = true;
                }
              });
            });
            if (flag) {
              element.articoliOrdinati.forEach((elementArtOrd) => {
                arrayBiNamePrice.forEach((item) => {
                  if (item[0] == elementArtOrd.title) {
                    item[1] +=
                      elementArtOrd.itemPriceAmount *
                      elementArtOrd.quantityShipped;
                  }
                });
              });
            } else {
              element.articoliOrdinati.forEach((elementArtOrd) => {
                let arr = [];
                arr.push(elementArtOrd.title);
                arr.push(
                  elementArtOrd.itemPriceAmount * elementArtOrd.quantityShipped
                );
                arrayBiNamePrice.push(arr);
              });
            }
            //console.log(arrayBiNamePrice);
          }
        });

        this.dataProdotto = {
          labels: [],
          datasets: [],
        };
        let temp = [];
        let tempColor = [];
        arrayBiNamePrice.forEach((item) => {
          //console.log(this.dataProdotto.datasets);

          this.dataProdotto.labels.push(item[0]);
          temp.push(item[1]);
          tempColor.push(this.getRandomColor());
        });
        this.dataProdotto.datasets.push({
          data: temp,
          backgroundColor: tempColor,
          hoverBackgroundColor: [],
        });
        //console.log(this.dataProdotto);
        this.elaboraCategoria();
        if (arrayBiNamePrice.length > 0) {
          this.primoForm = true;
        } else {
          this.primoForm = false;
          if (this.flagToast == false) {
            this.showError2();
            this.flagToast = true;
          }
        }
      });

      // console.log(arrayBiNamePrice);
      //elaborazione per categoria
    } else {
      this.showError3();
      this.primoForm = false;
    }
  }

  elaboraCategoria() {
    if (this.date1 != null) {
      if (this.date1[1] == null) {
        this.date1[1] = this.date1[0];
      }
      let startS =
        this.date1[0].getFullYear() +
        '-' +
        this.date1[0].getMonth() +
        '-' +
        this.date1[0].getDate();
      let stopS =
        this.date1[1].getFullYear() +
        '-' +
        this.date1[1].getMonth() +
        '-' +
        this.date1[1].getDate();

      //elaborazione per categoria
      let arrayBiNamePrice2 = [];

      let first = true;

      this.categoria.forEach((cat) => {
        this.analisi
          .sendData({start: startS, stop: stopS, categoria: cat.name})
          .subscribe((e) => {
            e.response.forEach((element) => {
              element.articoliOrdinati.forEach((element2) => {
                let flag = false;
                if (first) {
                  let t = [];
                  t.push(cat.name);
                  t.push(element2.itemPriceAmount * element2.quantityShipped);
                  arrayBiNamePrice2.push(t);
                  first = false;
                } else {
                  arrayBiNamePrice2.forEach((it) => {
                    if (it[0] == cat.name) {
                      flag = true;
                    }
                  });
                  if (flag) {
                    arrayBiNamePrice2.forEach((items) => {
                      if (items[0] == cat.name) {
                        items[1] +=
                          element2.itemPriceAmount * element2.quantityShipped;
                      }
                    });
                  } else {
                    let t = [];
                    t.push(cat.name);
                    t.push(element2.itemPriceAmount * element2.quantityShipped);
                    arrayBiNamePrice2.push(t);
                  }
                }
              });
            });
            let temp = [];
            this.dataCategoria = {
              labels: [],
              datasets: [],
            };
            let tempColor = [];
            arrayBiNamePrice2.forEach((elemento) => {
              //console.log(this.dataProdotto.datasets);
              this.dataCategoria.labels.push(elemento[0]);
              temp.push(elemento[1]);
              tempColor.push(this.getRandomColor());
            });
            this.dataCategoria.datasets.push({
              data: temp,
              backgroundColor: tempColor,
              hoverBackgroundColor: [],
            });
          });
      });

      //console.log(temp);

      //console.log(this.dataCategoria);
    }
  }

  getRandomColor() {
    var color = Math.floor(0x1000000 * Math.random()).toString(16);
    return '#' + ('000000' + color).slice(-6);
  }

  nonMostrare() {
    this.primoForm = false;
  }

  showError() {
    this.messageService.add({
      severity: 'error',
      summary: 'Errore',
      detail: 'Inserisci solo o categoria o nome prodotto',
    });
  }

  showError2() {
    this.messageService.add({
      severity: 'error',
      summary: 'Errore',
      detail: 'Non ci sono dati disponibili per questa ricerca',
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
