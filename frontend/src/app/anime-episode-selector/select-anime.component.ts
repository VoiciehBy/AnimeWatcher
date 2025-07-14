import { Component } from '@angular/core';
import { PlayerService } from 'src/services/player.service';
import { DbService } from 'src/services/db.service';

import { getAnimeURL} from "../../../../utils";
import c from "../../constants.json";

import { episode } from "../../episode";

@Component({
  selector: 'app-select-anime',
  templateUrl: './select-anime.component.html',
  styleUrls: ['./select-anime.component.css']
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
      if (this.isEpisodesNeedToBeUpdated)
        this.updateEpisodes();
      this.player.setEpisodesUpdateNeed(false);
    }, 3000);
  }

  updateEpisodes(): void {
    this.episodes = [];
    this.db.getAnimeEpisodes(this.currentShowName).subscribe({
      next: (data: any) => {
        for (let i = 0; i < data.length; i++)
          this.episodes.push(new episode(1, data[i].anime_id, data[i].watched));
      },
      error: (err: any) => console.error(err),
      complete: () => { }
    });
  }

  setIFramePlayerSrc(searchQuery: string = "akira", episodeNumber: number = 1) {
    getAnimeURL(searchQuery, episodeNumber).then(
      (episodeURL: any) => {
        this.player.setSrc(episodeURL);
        this.player.setMikuAngry(episodeURL === c.angry_miku_url);
      }).catch((err: any) => console.error(err));
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

  clearEpisode(index: number): void{
    this.db.markEpisodeAsNotWatched(this.currentShowName, index + 1).subscribe({
      next: (data: any) => console.log(data),
      error: (err: any) => console.error(err),
      complete: () => console.log(`Clearing ${this.currentShowName}E#${index + 1} completed`)
    })
    this.player.setEpisodesUpdateNeed(true);
  }
}