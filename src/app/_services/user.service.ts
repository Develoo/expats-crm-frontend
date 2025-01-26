import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:8080/api/test/';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    constructor(private http: HttpClient) {}
    private AUTH_API = 'http://localhost:8080/api/auth/';

    private options = {
        headers: new HttpHeaders().set('Content-Type', 'application/json'),
    };

    getPublicContent(): Observable<any> {
        return this.http.get(API_URL + 'all', { responseType: 'text' });
    }

    getUserBoard(): Observable<any> {
        return this.http.get(API_URL + 'user', { responseType: 'text' });
    }

    getModeratorBoard(): Observable<any> {
        return this.http.get(API_URL + 'mod', { responseType: 'text' });
    }

    getAdminBoard(): Observable<any> {
        return this.http.get(API_URL + 'admin', { responseType: 'text' });
    }
    updatesUser(id: number, user: any): Observable<any> {
        return this.http.put<any>(`${this.AUTH_API}update/${id}`, user);
    }

    getUserRoleById(id: number): Observable<any> {
        return this.http.get(`${this.AUTH_API}${id}`);
    }
    updatesUserPro(id: number, user: any): Observable<any> {
        return this.http.put<any>(`${this.AUTH_API}ttt/${id}`, user);
    }

    getUserById(id: number): Observable<any> {
        return this.http.get(`${this.AUTH_API}${id}`);
    }

    getRoleList(): Observable<any> {
        return this.http.get(`${this.AUTH_API}roles`, this.options);
    }

    updateUser4(id: any, user: any): Observable<any> {
        return this.http.put<any>(`${this.AUTH_API}userssst/${id}`, user);
    }

    updateUser5(id: any, user: any): Observable<any> {
        return this.http.put<any>(`${this.AUTH_API}up/${id}`, user);
    }

    /*login(email: string, password: string): Observable<any> {
        return this.http.post(
            AUTH_API + 'signin',
            {
                email,
                password,
            },
            httpOptions
        );
    }*/

    deleteData(id: number): Observable<any> {
        return this.http.delete(`${this.AUTH_API}user/${id}`, {
            responseType: 'text',
        });
    }

    // Méthode pour obtenir un numéro d'urgence par ID
    /* getUserRoleById(id: number): Observable<any> {
        return this.http.get<any>(`${this.AUTH_API}${id}`);
    }*/
}
