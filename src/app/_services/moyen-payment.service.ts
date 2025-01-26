import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const AUTH_API = 'http://localhost:8080/api/auth/moyenPay';

@Injectable({
    providedIn: 'root',
})
export class MoyenPaymentService {
    // private AUTH_API = "http://localhost:8080/api/moyenPay";

    constructor(private http: HttpClient) {}

    getMoyenPayment(): Observable<any[]> {
        return this.http.get<any[]>(AUTH_API);
    }
}
