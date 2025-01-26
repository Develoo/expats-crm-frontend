import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const AUTH_API = 'http://localhost:8080/api/auth/ajoutblog';
const AUTH_APII = 'http://localhost:8080/api/auth';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

export interface Blog {
    id?: number;
    value: string;
}

export interface BlogDTO {
    title: string;
    content: string;
    blogCategorieId: number | null; // Autoriser null pour ce champ
    blogScategorieIds: number[]; // Liste des IDs de BlogSCategorie
    pays: string;
    photo: string;
    tags: TagDTO[]; // Liste de tags
}

export interface TagDTO {
    nom: string;
}

@Injectable({
    providedIn: 'root',
})
export class BlogService {
    private apiUrl = 'http://localhost:8080/api/auth/inputs';
    private AUTH_API = 'http://localhost:8080/api/auth/notifications';
    AUTH_APII = 'http://localhost:8080/api/auth';
    private baseUrl = 'http://localhost:8080/api/auth';

    constructor(private http: HttpClient) {}

    addblogs(Blog: any): Observable<any> {
        return this.http.post(
            `${AUTH_API}`,
            {
                title: Blog.title,
                photo: Blog.photo,
                content: Blog.content,
                //categorie: Blog.categorie,
                pays: Blog.pays,
                blogCategorieId: Blog.blogCategorieId,
                blogScategorieIds: Blog.blogScategorieIds,
                tags: Blog.tags,
                /*categorie: Notification.categorie,
            pays: Notification.pays,*/
                //  lien: numeroUrgence.lien,
                //userPreferCommunis: UserRole.userPreferCommunis,
                // pays: Notification.pays,
            },
            httpOptions
        );
    }

    getInputFields(): Observable<Blog[]> {
        return this.http.get<Blog[]>(this.apiUrl);
    }

    createInputField(inputField: Blog): Observable<Blog> {
        return this.http.post<Blog>(this.apiUrl, inputField);
    }

    deleteInputField(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    getCategories(): Observable<any[]> {
        return this.http.get<any[]>(AUTH_APII + '/blogCategorie');
    }

    getBlogSCategories(): Observable<any[]> {
        return this.http.get<any[]>(AUTH_APII + '/blogSCategorie');
    }

    getblog(): Observable<any[]> {
        return this.http.get<any[]>(AUTH_APII + '/blog');
    }

    getBlogCtaegLire(): Observable<any[]> {
        return this.http.get<any[]>(AUTH_APII + '/blogs/categorie-lire');
    }

    getBlogCtaegEcouter(): Observable<any[]> {
        return this.http.get<any[]>(AUTH_APII + '/blogs/categorie-Ecouter');
    }

    getBlogCtaegRegarder(): Observable<any[]> {
        return this.http.get<any[]>(AUTH_APII + '/blogs/categorie-Regarder');
    }

    getBlogsByBlogScategorie(scategorieId: number): Observable<any[]> {
        return this.http.get<any[]>(
            `${this.AUTH_APII}/by-sous-categorie/${scategorieId}`
        );
    }

    getBlogById(id: number): Observable<any> {
        return this.http.get<any>(`${this.AUTH_APII}/blog/${id}`);
    }

    updateBlog(id: number, blogDTO: BlogDTO): Observable<BlogDTO> {
        const url = `${this.baseUrl}/updateblog/${id}`;
        return this.http.put<BlogDTO>(url, blogDTO, {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        });
    }

    deleteData(id: number): Observable<any> {
        return this.http.delete(`${this.AUTH_APII}/blog/${id}`, {
            responseType: 'text',
        });
    }

    // Récupérer les blogs par sous-catégorie spécifique
    /*  getBlogsBySousCategorie(scategorieId: number): Observable<any[]> {
        return this.http.get<any[]>('${this.AUTH_APII}/by-sous-categorie/${scategorieId}');
    }  */
}
