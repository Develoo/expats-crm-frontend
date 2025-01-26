import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class FileService {
    private baseUrl = 'http://localhost:8080/api/auth';

    constructor(private http: HttpClient) {}

    /* upload(file: File): Observable<HttpEvent<any>> {
        const formData: FormData = new FormData();

        formData.append('file', file);

        const req = new HttpRequest(
            'POST',
            `${this.baseUrl}/upload`,
            formData,
            {
                reportProgress: true,
                responseType: 'json',
            }
        );

        return this.http.request(req);
    }*/

    upload(file: File): Observable<HttpEvent<any>> {
        const formData: FormData = new FormData();
        formData.append('files', file); // 'files' correspond au paramètre attendu par le backend

        const req = new HttpRequest(
            'POST',
            `${this.baseUrl}/upload`,
            formData,
            {
                reportProgress: true,
                responseType: 'json',
            }
        );

        return this.http.request(req);
    }

    getFiles(): Observable<any> {
        return this.http.get(`${this.baseUrl}/files`);
    }
    upload1(file: File): Observable<HttpEvent<any>> {
        const formData: FormData = new FormData();

        formData.append('file', file);

        const req = new HttpRequest(
            'POST',
            `${this.baseUrl}/upload1`,
            formData,
            {
                reportProgress: true,
                responseType: 'json',
            }
        );

        return this.http.request(req);
    }

    getFiles1(): Observable<any> {
        return this.http.get(`${this.baseUrl}/files1`);
    }
}
