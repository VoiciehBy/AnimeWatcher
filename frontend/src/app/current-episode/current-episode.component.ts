import { Component } from '@angular/core';
import { PlayerService } from 'src/services/player.service';

@Component({
  selector: 'app-current-episode',
  templateUrl: './current-episode.component.html',
  styleUrls: ['./current-episode.component.css']
})
export class CurrentEpisodeComponent {
  showName: string;
  current: number;
  total: number;
  constructor(private player: PlayerService) { }

  ngOnInit(): void {
    console.log(`CurrentEpisodeComponent has been inited...`);
    this.player.showNameState.subscribe(s => this.showName = s);
    this.player.currEpisodeState.subscribe(x => this.current = x);
    this.player.totalEpisodeState.subscribe(x => this.total = x);
  }
}
