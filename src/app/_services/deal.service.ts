import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const AUTH_API = 'http://localhost:8080/api/auth/deal';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
    providedIn: 'root',
})
export class DealService {
    private AUTH_API = 'http://localhost:8080/api/auth/deal';
    constructor(private http: HttpClient) {}

    getDealetatActif(): Observable<any[]> {
        return this.http.get<any[]>(AUTH_API + '/deals/Actif');
    }

    getDealetatEn_attente(): Observable<any[]> {
        return this.http.get<any[]>(AUTH_API + '/deals/En attente');
    }

    getDealetatRefuse(): Observable<any[]> {
        return this.http.get<any[]>(AUTH_API + '/deals/Refuse');
    }

    getdeal(): Observable<any[]> {
        return this.http.get<any[]>(AUTH_API);
    }

    updateDealr(id: number, user: any): Observable<any> {
        return this.http.put<any>(`${this.AUTH_API}/update/${id}`, user);
    }

    deleteData(id: number): Observable<any> {
        return this.http.delete(`${this.AUTH_API}/dealdelete/${id}`, {
            responseType: 'text',
        });
    }
}
