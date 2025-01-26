import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const AUTH_API = 'http://localhost:8080/api/auth/notifications';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    constructor(private http: HttpClient) {}
    private AUTH_API = 'http://localhost:8080/api/auth/notifications';

    addnotifications(Notification: any): Observable<any> {
        return this.http.post(
            `${AUTH_API}`,
            {
                titre: Notification.titre,
                photo: Notification.photo,
                description: Notification.description,
                categorie: Notification.categorie,
                pays: Notification.pays,
                //  lien: numeroUrgence.lien,
                //userPreferCommunis: UserRole.userPreferCommunis,
                // pays: Notification.pays,
            },
            httpOptions
        );
    }

    getnotification(): Observable<any[]> {
        return this.http.get<any[]>(AUTH_API);
    }

    updateNotification(id: number, notification: any): Observable<any> {
        return this.http.put<any>(`${this.AUTH_API}/notif/${id}`, notification);
    }

    // Méthode pour obtenir un numéro d'urgence par ID
    getNotificationById(id: number): Observable<any> {
        return this.http.get<any>(`${this.AUTH_API}/notifs/${id}`);
    }

    deleteData(id: number): Observable<any> {
        return this.http.delete(`${this.AUTH_API}/notifica/${id}`, {
            responseType: 'text',
        });
    }

    getNotificationsByCategorie(categorie: string): Observable<any[]> {
        return this.http.get<any[]>(`${AUTH_API}/notificationss`, {
            params: { categorie: categorie },
        });
    }

    /* deleteData(id: number): Observable<any> {
        return this.http.delete(`${this.AUTH_API}/numurge/${id}`, {
            responseType: 'text',
        });
    }*/
}
