import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

const AUTH_API = 'http://localhost:8080/api/auth/';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
    providedIn: 'root'
})
export class VilleService {
    private AUTH_API = "http://localhost:8080/api/auth/";

    constructor(private http: HttpClient) { }

    getVille(): Observable<any[]> {
        return this.http.get<any[]>(AUTH_API + 'ville');
    }
    getVilleByPays(pays: string): Observable<any[]> {
        return this.http.get<any[]>(AUTH_API + `villeByPays?pays=${pays}`);
    }
}


