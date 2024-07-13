import { Component } from '@angular/core';
import { PlayerService } from 'src/services/player.service';

@Component({
  selector: 'app-current-episode',
  templateUrl: './current-episode.component.html',
  styleUrls: ['./current-episode.component.css']
})
export class CurrentEpisodeComponent {
  showName: string;
  searchQuery: string;
  current: number;
  total: number;
  miku_angry: boolean;
  constructor(private player: PlayerService) { }

  ngOnInit(): void {
    console.log(`CurrentEpisodeComponent has been inited...`);
    this.player.showNameState.subscribe(s => this.showName = s);
    this.player.searchQueryState.subscribe(s => this.searchQuery = s);
    this.player.currEpisodeState.subscribe(x => this.current = x);
    this.player.totalEpisodeState.subscribe(x => this.total = x);
    this.player.mikuAngryState.subscribe(b => this.miku_angry = b);
  }
}
