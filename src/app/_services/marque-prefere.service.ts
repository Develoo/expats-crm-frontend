import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const AUTH_API = 'http://localhost:8080/api/auth/';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Injectable({
    providedIn: 'root',
})
export class MarquePrefereService {
    private AUTH_API = 'http://localhost:8080/api/auth/';

    constructor(private http: HttpClient) {}

    getMarquePrefere(): Observable<any[]> {
        return this.http.get<any[]>(AUTH_API + 'marquesPrefere');
    }
}
