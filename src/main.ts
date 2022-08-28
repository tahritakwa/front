import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import 'hammerjs';
import { enableProdMode } from '@angular/core';
enableProdMode();
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => { });
