import { Component } from '@angular/core';
import { PlayerService } from 'src/services/player.service';
import { DbService } from 'src/services/db.service';

import { JikanResponse, Anime, AnimeClient, AnimeSearchParams, AnimeEpisode } from '@tutkli/jikan-ts';
import c from "../../constants.json";

import { episode } from "../../episode";

@Component({
  selector: 'app-select-anime',
  templateUrl: './select-anime.component.html',
  styleUrls: ['./select-anime.component.css'],
  standalone: false
})

export class AnimeEpisodeSelectorComponent {
  currentEpisode: number = 1;
  episodeCount: number = 1;
  episodes: episode[] = [];

  searchQuery: string = "";
  currentShowName: string = "";
  src: string = "";

  isEpisodesNeedToBeUpdated: boolean = false;

  constructor(private player: PlayerService, private db: DbService) { }

  ngOnInit(): void {
    console.log(`AnimeEpisodeSelectorComponent has been inited...`);
    this.player.currEpisodeState.subscribe(x => this.currentEpisode = x);
    this.player.totalEpisodeState.subscribe(x => this.episodeCount = x);
    this.player.searchQueryState.subscribe(x => this.searchQuery = x);
    this.player.showNameState.subscribe(x => this.currentShowName = x);
    this.player.srcState.subscribe(src => this.src = src);

    this.player.needForEpisodesUpdate.subscribe(x => this.isEpisodesNeedToBeUpdated = x);

    this.updateEpisodes();
    setInterval(() => {
      if (this.isEpisodesNeedToBeUpdated) {
        this.updateEpisodes();
        this.player.setEpisodesUpdateNeed(false);
      }
      this.player.setEpisodesUpdateNeed(true);
    }, 10000);
  }

  updateEpisodes(): void {
    this.episodes = [];
    this.db.getAnimeEpisodes(this.currentShowName).subscribe({
      next: (data: any) => {
        for (let i = 0; i < data.length; i++)
          this.episodes.push(new episode(1, data[i].anime_id, data[i].name, data[i].watched));
      },
      error: (err: any) => console.error(err),
      complete: () => { }
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

  selectEpisode(index: number) {
    this.currentEpisode = index + 1;
    this.player.setCurrentEpisode(+this.currentEpisode);

    this.db.markEpisodeAsWatched(this.currentShowName, +this.currentEpisode).subscribe({
      next: (data: any) => console.log(data),
      error: (err: any) => console.error(err),
      complete: () => console.log(`Marking E#${this.currentEpisode} of ${this.currentShowName} as watched completed`)
    })

    this.setIFramePlayerSrc(this.searchQuery, +this.currentEpisode);

    this.player.setEpisodesUpdateNeed(true);
  }

  selectNextEpisode(): void {
    if (this.currentEpisode + 1 <= this.episodeCount)
      this.currentEpisode++;
    this.selectEpisode(this.currentEpisode);
  }

  clearEpisode(index: number): void {
    this.db.markEpisodeAsNotWatched(this.currentShowName, index + 1).subscribe({
      next: (data: any) => console.log(data),
      error: (err: any) => console.error(err),
      complete: () => console.log(`Clearing ${this.currentShowName}E#${index + 1} completed`)
    })
    this.player.setEpisodesUpdateNeed(true);
  }
}