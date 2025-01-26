import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const AUTH_API = 'http://localhost:8080/api/auth/compagnsouhait';

@Injectable({
    providedIn: 'root',
})
export class CompagnSouhaitService {
    constructor(private http: HttpClient) {}

    getCompagnSouhait(): Observable<any[]> {
        return this.http.get<any[]>(AUTH_API);
    }
}
