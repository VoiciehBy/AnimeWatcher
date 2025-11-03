import { Component, OnInit } from '@angular/core';
import { PlayerService } from 'src/services/player.service';
import { DbService } from 'src/services/db.service';

import { JikanResponse, Anime, AnimeClient, AnimeSearchParams, AnimeEpisode } from '@tutkli/jikan-ts';
import c from "../../constants.json";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  standalone: false
})

export class SearchComponent {
  searchQuery: string = "";
  currentShowName: string = "";
  src: string = "";

  episodeCount: number = 1;

  constructor(private player: PlayerService, private db: DbService) { }

  ngOnInit(): void {
    console.log(`SearchComponent has been inited...`);
    this.player.searchQueryState.subscribe(s => this.searchQuery = s);
    this.player.showNameState.subscribe(s => this.currentShowName = s);
    this.player.srcState.subscribe(src => this.src = src);
    this.player.totalEpisodeState.subscribe(x => this.episodeCount = x);

    this.onSearchButtonClick();
  }

  setAnimeName(searchQuery: string) {
    const animeClient = new AnimeClient();
    const searchParams: AnimeSearchParams = {
      q: searchQuery
    }
    animeClient.getAnimeSearch(searchParams).then((response: JikanResponse<Anime[]>) => {
      let title = response.data[0].title;
      this.player.setShowName(title);
      this.db.addAnime(title.replaceAll("'", "")).subscribe({
        next: (data: any) => console.log(data),
        error: (err: any) => console.error(err),
        complete: () => console.log(`Adding ${title.replaceAll("'", "")} completed...`)
      })
    }).catch((err: any) => {
      console.error(err);
      this.player.setShowName("cannot_find");
    });
  }

  setIFramePlayerSrc(searchQuery: string = "akira", episodeNumber: number = 1) {
    const animeClient = new AnimeClient();
    const searchParams: AnimeSearchParams = {
      q: searchQuery
    }
    animeClient.getAnimeSearch(searchParams).then((response: JikanResponse<Anime[]>) => {
      animeClient.getAnimeEpisodes(response.data[0].mal_id).then((eps: JikanResponse<AnimeEpisode[]>) => {
        const _str_fun = (x : any) => x.toLowerCase().replaceAll(" ", "-");
        const embed_url = (x : any, y : any) => `${c.video_api}${_str_fun(x)}-episode-${y}.mp4`;
        const episodeURL = embed_url(this.currentShowName, episodeNumber)
        this.player.setSrc(episodeURL);
        this.player.setMikuAngry(episodeURL === c.angry_miku_url);
      })
    }).catch((err: any) => console.error(err))
  }

  async setEpisodeCount(searchQuery: string = "akira") {
    const animeClient = new AnimeClient();
    const searchParams: AnimeSearchParams = {
      q: searchQuery
    }
    animeClient.getAnimeSearch(searchParams).then((response: JikanResponse<Anime[]>) => {
      this.player.setTotalEpisodeCount(response.data[0].episodes);
      this.player.setEpisodesUpdateNeed(true);
      for (let i = 0; i < this.episodeCount; i++)
        this.db.addAnimeEp(this.currentShowName, i + 1, "").subscribe({
          next: (data: any) => console.log(data),
          error: (err: any) => console.error(err),
          complete: () => console.log(`Adding E#${i + 1} of ${this.currentShowName} completed...`)
        });
    }).catch((err: any) => console.error(err));
  }

  onSearchButtonClick() {
    this.player.setCurrentEpisode(1);
    this.player.setSearchQuery(this.searchQuery);
    this.player.setEpisodesUpdateNeed(true);
    this.setAnimeName(this.searchQuery);
    this.setIFramePlayerSrc(this.searchQuery, 1);
    this.setEpisodeCount(this.searchQuery);
  }
}