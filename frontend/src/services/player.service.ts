import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable()
export class PlayerService {

    public showNameSubject: BehaviorSubject<string> = new BehaviorSubject<string>("akira");
    public showNameState: Observable<string> = this.showNameSubject.asObservable();

    public currEpisodeSubject: BehaviorSubject<number> = new BehaviorSubject<number>(1);
    public currEpisodeState: Observable<number> = this.currEpisodeSubject.asObservable();

    public totalEpisodeSubject: BehaviorSubject<number> = new BehaviorSubject<number>(1);
    public totalEpisodeState: Observable<number> = this.totalEpisodeSubject.asObservable();

    public srcSubject: BehaviorSubject<string> = new BehaviorSubject<string>("");
    public srcState: Observable<string> = this.srcSubject.asObservable();

    public searchQuerySubject: BehaviorSubject<string> = new BehaviorSubject<string>("akira");
    public searchQueryState: Observable<string> = this.searchQuerySubject.asObservable();

    public mikuAngrySubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public mikuAngryState: Observable<boolean> = this.mikuAngrySubject.asObservable();

    public updateEpisodesSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    public needForEpisodesUpdate: Observable<boolean> = this.updateEpisodesSubject.asObservable();

    constructor() { }

    setShowName(x: string) {
        this.showNameSubject.next(x);
    }

    setCurrentEpisode(x: number) {
        this.currEpisodeSubject.next(x);
    }

    setTotalEpisodeCount(x: number) {
        this.totalEpisodeSubject.next(x);
    }

    setSrc(src: string): void {
        this.srcSubject.next(src);
    }

    setSearchQuery(x: string): void {
        this.searchQuerySubject.next(x);
    }

    setMikuAngry(b: boolean): void {
        this.mikuAngrySubject.next(b);
    }

    setEpisodesUpdateNeed(b: boolean): void {
        this.updateEpisodesSubject.next(b);
    }
}