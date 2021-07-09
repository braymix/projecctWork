import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { StorageTokenService } from './storage-token.service';

@Injectable({
  providedIn: 'root'
})
export class IsAutenticatedService {

  constructor( public router: Router, public token:StorageTokenService) {}

  canActivate(): boolean {
    if (this.token.getToken() == null) {
      this.router.navigate(['dashboard']);
      return false;
    }
    return true;
  }
}
