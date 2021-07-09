import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {StorageTokenService} from '../services/storage-token.service';
import {isEmpty} from 'rxjs/operators';


@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private storageTokenService: StorageTokenService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add auth header with jwt if user is logged in and request is to the api url
    const token = this.storageTokenService.getToken();
    if (token != null) {
      request = request.clone({
        setHeaders: {Authorization: `Bearer ${token}`}
      });
    }
    return next.handle(request);
  }
}
