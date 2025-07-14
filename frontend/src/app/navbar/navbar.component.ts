import { Component } from '@angular/core';
import { DbService } from 'src/services/db.service';
import { PlayerService } from 'src/services/player.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent {
  constructor(private player: PlayerService,
    private db: DbService) { }

  onDbClearButton(): void {
    this.db.clearDb().subscribe({
      next: (data: any) => console.log(data),
      error: (err: any) => console.error(err),
      complete: () => {
        this.player.setEpisodesUpdateNeed(true);
        console.log(`Database was cleared`);
      }
    });
  }
}