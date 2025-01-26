import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class OpeninhoursService {
    private AUTH_API = 'http://localhost:8080/api/auth/';

    constructor(private http: HttpClient) {}

    getUserById(proRoleId: any): Observable<any> {
        return this.http.get(`${this.AUTH_API}by-pro-role/${proRoleId}`);
    }
}
