import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

import {FormsModule} from "@angular/forms";
import { NavbarComponent } from './navbar/navbar.component';
import { PlayerService } from 'src/services/player.service';
import { PPipe } from './p.pipe';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    PPipe
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [PlayerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
