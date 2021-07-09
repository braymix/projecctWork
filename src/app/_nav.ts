import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    icon: 'fa fa-tachometer'
  },
  {
    name: 'Articoli',
    url: '/articoli',
    icon: 'fa fa-list-ul'
  },
  {
    name: 'Acquisti',
    url: '/acquisti',
    icon: 'fa fa-shopping-bag'
  },
  {
    name: 'Vendite',
    url: '/ordini',
    icon: 'fa fa-cart-arrow-down'
  },
  {
    name: 'Analisi',
    url: '/analisi',
    icon: 'fa fa-line-chart'
  }
];
