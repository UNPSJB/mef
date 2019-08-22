import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {RouterModule} from '@angular/router';
import { AppRoutingModule } from './app.routes';
import { DinosuarioMostrarComponent } from './components/dinosuario-mostrar/dinosuario-mostrar.component';

@NgModule({
  declarations: [
    AppComponent,
    DinosuarioMostrarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
