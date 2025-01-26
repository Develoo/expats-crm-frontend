// geo-location.service.ts
import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GeoLocationService {
  private apiUrl = 'https://nominatim.openstreetmap.org/reverse';
  private apiUrl1 = 'http://localhost:8080/api/location';

  constructor(private http: HttpClient) {}

  getAddress(latitude: number, longitude: number): Observable<any> {
    const url = `${this.apiUrl}?lat=${latitude}&lon=${longitude}&format=json`;
    return this.http.get(url);
  }

  getCountryName(latitude: number, longitude: number): Observable<any> {
    const url = `${this.apiUrl}?lat=${latitude}&lon=${longitude}&format=json`;
    return this.http.get(url);
  }

  sendLocation(location: { latitude: number, longitude: number }): Observable<any> {
    return this.http.post(this.apiUrl1, location);
  }
}
