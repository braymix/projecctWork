// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  host: "https://polo-nord-backend.azurewebsites.net/api/",
  endpoint: {
    'articoli': 'articoli/',
    'ordini': 'ordini/',
    'acquisti': 'acquisti/',
    'fornitori': 'fornitori/',
    'carico': 'carico/',
    'asin': 'asin/',
    'titolo': 'titolo/',
    'categoria' : 'categoria/',
    'addLastOrders': 'addLastOrders/',
    'prezzo': 'prezzo',
    'allCategorie' : 'allCategorie',
    'globalFilter': 'globalFilter',
    'articoliAcquistati': 'articoliAcquistati/'
  }

};
