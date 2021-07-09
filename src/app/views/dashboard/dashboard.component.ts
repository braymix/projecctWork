import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { EServiceResponse } from '../../enumerations/EServiceResponse';
import { Severity } from '../../enumerations/Severity';
import { BaseResponseDto } from '../../interfaces/baseResponseDto';
import { ServiceResponse } from '../../interfaces/serviceResponse';
import { OrdiniDto, OrdiniService } from '../../services/ordini.service';

@Component({
  templateUrl: 'dashboard.component.html',
  providers: [MessageService]
})
export class DashboardComponent implements OnInit {

  public loading: boolean = false; 
  public message: any;

  constructor(
    private ordiniService: OrdiniService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const fromLogin = this.route.snapshot.params["fromLogin"];
    if (fromLogin) {
      this.loadOrdini();
    }
  }

  loadOrdini() {
    this.loading = true;
    this.ordiniService.addLastOrders().subscribe((resp: BaseResponseDto<ServiceResponse<OrdiniDto[]>>) => {
      if (resp.status == 200 && resp.success) {
        const numberOfOrdersAdded = resp.response.data.length;
        this.generateMessage({
          severity: Severity.SUCCESS,
          summary: "Ordini aggiornati con successo",
          detail: numberOfOrdersAdded == 0 ? "Non ci sono nuovi ordini" : (numberOfOrdersAdded + " ordini aggiunti")
        });
      } else if (resp.error) {
        if (resp.response.response == EServiceResponse.ERRORE_SERVER_REMOTO) {
          this.generateMessage({
            severity: Severity.ERROR,
            summary: null,
            detail: "Errore server remoto"
          });
        } else {
          this.generateMessage({
            severity: Severity.ERROR,
            summary: null,
            detail: "Errore non gestito"
          });
        }
      }
      this.loading = false;
      this.messageService.add(this.message);
    })
  }

  generateMessage(event) {
    this.message = {
      severity: event.severity, 
      summary: event.summary || (
        event.severity == Severity.ERROR ? "Si è verificato un problema" : 
        event.severity == Severity.SUCCESS ? "Operazione avvenuta con successo" : "Testo non stabilito"
        ), 
      detail: event.detail
    }
  }

}
