import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable()
export class PlayerService {

    public srcSubject = new BehaviorSubject<string>("");
    public srcState: Observable<string> = this.srcSubject.asObservable();

    setSrcSubject(x: string) {
        this.srcSubject.next(x)
    }

    constructor() { }

    setSrc(src: string): void {
        this.setSrcSubject(src)
    }
}