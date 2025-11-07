// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.



// src/environments/environment.ts

export const environment = {
  production: false,

  // 🔹 Chave da API do TMDB
  tmdbApiKey: '77c38bc86cd424db480ddbe638e4b466',

  // 🔹 Configuração do Firebase
  firebaseConfig: {
    apiKey: "AIzaSyASMoY0vTrNgFjyGkmQfQw4-YrFPfHnN0w",
    authDomain: "clap-c767f.firebaseapp.com",
    projectId: "clap-c767f",
    storageBucket: "clap-c767f.appspot.com",
    messagingSenderId: "836484119429",
    appId: "1:836484119429:web:58da07d914be3ecfe8e2ec"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
