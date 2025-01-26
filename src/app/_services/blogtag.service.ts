import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
    providedIn: 'root',
})
export class BlogtagService {
    constructor(private http: HttpClient) {}
    private AUTH_API = 'http://localhost:8080/api/auth/Tag';

    // Méthode pour récupérer les tags d'un blog
    getTagsByBlogId(blogId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.AUTH_API}/tags/${blogId}`);
    }
}
