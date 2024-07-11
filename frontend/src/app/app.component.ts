import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
    title: string = "frontend";

    constructor() { }

    ngOnInit(): void {
        console.log(`${this.title} has been inited...`);
    }
}
