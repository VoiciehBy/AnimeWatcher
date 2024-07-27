import { Component, OnInit } from '@angular/core';
import { PlayerService } from 'src/services/player.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
    title: string = "frontend";
    miku_angry: boolean = false;

    constructor(private player: PlayerService) { }

    ngOnInit(): void {
        console.log(`${this.title} has been inited...`);
        this.player.mikuAngryState.subscribe(b => this.miku_angry = b);
    }
}
