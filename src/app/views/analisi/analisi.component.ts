import {Component, OnInit} from '@angular/core';
import {AnalisiServiceService} from '../../services/analisi-service.service';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-analisi',
  templateUrl: './analisi.component.html',
  styleUrls: ['./analisi.component.scss'],
  providers: [DatePipe]
})
export class AnalisiComponent implements OnInit {
  date1: Date;
  flag: boolean = false;
  nomeSel: any;
  nome: any;
  isInvited: String;
  listaProd: any [];
  restName: any;
  arrayDate: any[];
  dateSend: Date;

  constructor(public analisi: AnalisiServiceService, public datepipe: DatePipe) {
  }

  ngOnInit(): void {

    /*     this.date2 = new Date();
        let latest_date1 = this.datepipe.transform(this.date2);
        this.arrayDate = [];
        this.arrayDate.push(latest_date1);
        this.date2.setDate(this.date1.getDate()-7);
        this.arrayDate.push( this.datepipe.transform(this.date2))
        console.log(this.arrayDate);


        console.log(latest_date1);
        console.log("a"); */
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

  nonMostrare() {
    this.flag = false;
  }

  elabora() {

    this.flag = true;
  }

}
