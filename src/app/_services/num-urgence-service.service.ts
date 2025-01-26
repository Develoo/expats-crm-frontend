import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const AUTH_API = 'http://localhost:8080/api/auth/numUrgence';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
    providedIn: 'root',
})
export class NumUrgenceServiceService {
    constructor(private http: HttpClient) {}
    private AUTH_API = 'http://localhost:8080/api/auth/numUrgence';

    numurgence(numeroUrgence: any): Observable<any> {
        return this.http.post(
            `${AUTH_API}`,
            {
                titre: numeroUrgence.titre,
                photo: numeroUrgence.photo,
                description: numeroUrgence.description,
                num: numeroUrgence.num,
                lien: numeroUrgence.lien,
                //userPreferCommunis: UserRole.userPreferCommunis,
                pays: numeroUrgence.pays,
                // categorie: numeroUrgence.categorie,
            },
            httpOptions
        );
    }

    getnumurgence(): Observable<any[]> {
        return this.http.get<any[]>(AUTH_API);
    }

    updateNumUrgence(id: number, numurgence: any): Observable<any> {
        return this.http.put<any>(`${this.AUTH_API}/numur/${id}`, numurgence);
    }

    // Méthode pour obtenir un numéro d'urgence par ID
    getNumUrgenceById(id: number): Observable<any> {
        return this.http.get<any>(`${this.AUTH_API}/numurs/${id}`);
    }

    deleteData(id: number): Observable<any> {
        return this.http.delete(`${this.AUTH_API}/numurge/${id}`, {
            responseType: 'text',
        });
    }

    getNumeroUrgenceByCategorie(categorie: string): Observable<any[]> {
        return this.http.get<any[]>(`${AUTH_API}/numurgenc`, {
            params: { categorie: categorie },
        });
    }
}
