import {Component} from '@angular/core';
import { navItems } from '../../_nav';
import { StorageTokenService } from '../../services/storage-token.service';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent {
  public sidebarMinimized = false;
  public navItems = navItems;
  
  constructor(
    public token: StorageTokenService,
    private router: Router,
    private storageService: StorageService
    ){}

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  logout() {
    this.token.signOut();
    this.router.navigate(["login"]);
  }

  carrello() {
    this.router.navigate(["carrello"]);
  }

  getBadge() {
    const numberOfItems = this.storageService.getAllItems().length;
    return numberOfItems == 0 ? null : numberOfItems;
  }

}
