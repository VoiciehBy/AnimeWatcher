import { Component } from '@angular/core';
import { PlayerService } from 'src/services/player.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent {
  src: string;
  animeName: string;
  searchQuery: string;
  currentEpisode: number;
  angry_miku: boolean = false;

  constructor(private player: PlayerService) { }

  ngOnInit(): void {
    console.log(`PlayerComponent has been inited...`);
    this.player.showNameState.subscribe(s => this.animeName = s);
    this.player.searchQueryState.subscribe(s => this.searchQuery = s);
    this.player.currEpisodeState.subscribe(x => this.currentEpisode = x);
    this.player.srcState.subscribe(s => this.src = s);
    this.player.mikuAngryState.subscribe(b => this.angry_miku = b);
  }
}
