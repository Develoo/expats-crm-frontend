import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class LogService {
    private AUTH_API = 'http://localhost:8080/api/auth/column-change-log/';

    constructor(private http: HttpClient) {}

    getLogById(proRoleId: any): Observable<any> {
        return this.http.get(`${this.AUTH_API}by-pro-role/${proRoleId}`);
    }

    getLogUserById(userRoleId: any): Observable<any> {
        return this.http.get(`${this.AUTH_API}by-user-role/${userRoleId}`);
    }
}
