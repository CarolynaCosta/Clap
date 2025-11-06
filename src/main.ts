import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { routes } from './app/app.routes';
import { IonicModule } from '@ionic/angular';

import { register } from 'swiper/element/bundle';
register();


bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(IonicModule.forRoot(), HttpClientModule),
    provideRouter(routes)
  ]
}).catch(err => console.error(err));
