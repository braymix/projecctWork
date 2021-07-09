import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import {CardModule} from 'primeng/card';
import { Severity } from '../../../enumerations/Severity';
import { ArticoliService } from '../../../services/articoli.service';

@Component({
  selector: 'app-dettaglio-articoli',
  templateUrl: './dettaglio-articoli.component.html',
  styleUrls: ['./dettaglio-articoli.component.scss'],
  providers: [MessageService]

})
export class DettaglioArticoliComponent implements OnInit {
  

  articolo: any;

  date1:Date [];
  dateT1 : Date;
  dateT2 : Date;

  constructor(public router: Router,
              public routeActive: ActivatedRoute,
              public articoliService: ArticoliService,
              private messageService: MessageService) { }

  ngOnInit(): void {
    this.date1 = [];
    this.dateT1 = new Date();
    this.dateT2 = new Date();
    this.dateT2.setDate(this.dateT2.getDate() - 30);
    this.date1.push(this.dateT2);
    this.date1.push(this.dateT1);

    const asin = this.routeActive.snapshot.params.asin;
    console.log('asin: ' + asin);
    this.articoliService.getByAsin(asin).subscribe(resp=>{
      this.articolo= resp.response;
      if(this.articolo.giacenza > this.articolo.sogliaDisponibilitaBassa && this.articolo.giacenza <= this.articolo.sogliaDisponibilitaBassa + 5 ){
      this.generateToast({
        severity: Severity.WARNING,
        summary:"Giacenza Scarsa",
        detail:"Ricarica Giacenza"
      })
      
    }
    else if(this.articolo.giacenza <= this.articolo.sogliaDisponibilitaBassa){
      this.generateToast({
        severity: Severity.ERROR,
        summary:"Giacenza uguale o sotto la soglia",
        detail:"Ricarica giacenza"
      })

      }
      console.log("articolo", this.articolo.giacenza)
    });
  
    
  }


  generateToast(event: { severity: any; summary: any; detail: any; }) {
    this.messageService.clear();
    this.messageService.add({
      severity: event.severity,
      summary: event.summary,
      detail: event.detail
    });
  }
  

}
