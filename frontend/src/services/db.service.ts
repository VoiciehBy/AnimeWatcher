import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Observable } from "rxjs";

@Injectable()
export class DbService {
    host: string = "http://localhost:3000";

    constructor(private http: HttpClient) { }

    getAnime(name: string = ''): Observable<any> {
        return this.http.get(`${this.host}/anime?name=${name}`);
    }

    getAnimeEp(anime_name: string = '', no: number = 1): Observable<any> {
        return this.http.get(`${this.host}/episode?name=${anime_name}&no=${no}`);
    }

    getAnimeEpisodes(anime_name: string = ''): Observable<any> {
        return this.http.get(`${this.host}/episodes?anime_name=${anime_name}`);
    }

    addAnime(name: string = ''): Observable<any> {
        return this.http.put(`${this.host}/new_anime?name=${name}`, {});
    }

    addAnimeEp(anime_name: string = '', no: number = 1): Observable<any> {
        return this.http.put(`${this.host}/new_episode?anime_name=${anime_name}&no=${no}`, {});
    }

    markEpisodeAsWatched(anime_name: string = '', no: number = 1): Observable<any> {
        return this.http.patch(`${this.host}/episode?anime_name=${anime_name}&no=${no}`, {});
    }
}