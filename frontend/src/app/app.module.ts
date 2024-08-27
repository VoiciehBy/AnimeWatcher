import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

import { FormsModule } from "@angular/forms";
import { NavbarComponent } from './navbar/navbar.component';
import { PlayerService } from 'src/services/player.service';
import { DbService } from 'src/services/db.service';
import { PPipe } from './p.pipe';
import { AnimeEpisodeSelectorComponent } from './anime-episode-selector/select-anime.component';
import { SearchComponent } from './search/search.component';
import { CurrentEpisodeComponent } from './current-episode/current-episode.component';
import { PlayerComponent } from './player/player.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    PPipe,
    AnimeEpisodeSelectorComponent,
    SearchComponent,
    CurrentEpisodeComponent,
    PlayerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    PlayerService,
    DbService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
