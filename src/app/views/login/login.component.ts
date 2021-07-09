import { Component,OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from "@angular/forms";
import { ApiServiceService } from '../../services/api-service.service';
import { StorageTokenService } from '../../services/storage-token.service';
import { Router } from '@angular/router';
import { ServiceResponse } from '../../interfaces/serviceResponse';
import { EServiceResponse } from '../../enumerations/EServiceResponse';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html',
  providers: [MessageService]
})
export class LoginComponent implements OnInit {

  constructor(
    public fb: FormBuilder,
    public api: ApiServiceService,
    public token: StorageTokenService,
    public router: Router,
    private messageService: MessageService
  ) { }

  public formGroup: FormGroup;

  ngOnInit() {
    this.formGroup = this.fb.group({
      username: [""],
      password: [""]
    })
  }

  login(){
    this.api.login(this.formGroup.value).subscribe((resp: ServiceResponse<any>)=>{
      if (resp.response == EServiceResponse.OK) {
        this.token.saveToken(resp.data['accessToken']);
        this.router.navigate(['dashboard', {fromLogin: true}]);
      } else if (resp.response == EServiceResponse.CREDENZIALI_VUOTE) {
        this.messageService.add({
          severity: "error",
          summary: "Si è verificato un problema",
          detail: "Username o password non inseriti"
        })
      } else if (resp.response == EServiceResponse.CREDENZIALI_ERRATE) {
        this.messageService.add({
          severity: "error",
          summary: "Si è verificato un problema",
          detail: "Credenziali errate"
        })
      } else {
        this.messageService.add({
          severity: "error",
          summary: "Si è verificato un problema",
          detail: "Errore non gestito"
        })
      }
    });
  }

}
