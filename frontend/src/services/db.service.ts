import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Observable } from "rxjs";

@Injectable()
export class DbService {
    host: string = "http://localhost:3000";

    private httpOptions: any;

    constructor(private http: HttpClient) { 
        this.httpOptions = {
            headers: new HttpHeaders({
                "Access-Control-Allow-Origin":"*",
                "Access-Control-Allow-Methods":"GET, POST, PUT, DELETE, OPTIONS"
            })
        }
    }

    getAnime(name: string = ''): Observable<any> {
        return this.http.get(`${this.host}/anime?name=${name}`, this.httpOptions);
    }

    getAnimeEp(anime_name: string = '', no: number = 1): Observable<any> {
        return this.http.get(`${this.host}/episode?name=${anime_name}&no=${no}`, this.httpOptions);
    }

    getAnimeEpisodes(anime_name: string = ''): Observable<any> {
        return this.http.get(`${this.host}/episodes?anime_name=${anime_name}`, this.httpOptions);
    }

    addAnime(name: string = ''): Observable<any> {
        return this.http.put(`${this.host}/new_anime?name=${name}`, {},  this.httpOptions);
    }

    addAnimeEp(anime_name: string = '', no: number = 1): Observable<any> {
        return this.http.put(`${this.host}/new_episode?anime_name=${anime_name}&no=${no}`, {},  this.httpOptions);
    }

    markEpisodeAsWatched(anime_name: string = '', no: number = 1): Observable<any> {
        return this.http.patch(`${this.host}/episode?anime_name=${anime_name}&no=${no}`, {},  this.httpOptions);
    }

    markEpisodeAsNotWatched(anime_name: string = '', no: number = 1): Observable<any> {
        return this.http.patch(`${this.host}/episode?anime_name=${anime_name}&no=${no}&watched=false`, {},  this.httpOptions);
    }

    clearDb(): Observable<any>{
        return this.http.delete(`${this.host}/clear`, {});
    }
}