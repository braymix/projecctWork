import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {StorageTokenService} from '../services/storage-token.service';
import {MessageService} from 'primeng/api';
import {Severity} from '../enumerations/Severity';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private storageTokenService: StorageTokenService,
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      if (err.status === 401) {
        // auto logout if 401 response returned from api
        this.storageTokenService.signOut();
        location.reload(true);
      }

      const error = err.error.message || err.statusText;

      return throwError(error);
    }))
  }
}
