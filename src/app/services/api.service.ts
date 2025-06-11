import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // Reemplaza con tu URL de Railway
  private apiUrl = 'TU_URL_RAILWAY/api/items';

  constructor(private http: HttpClient) { }

  // Headers
  private getHeaders() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      // Añade aquí cualquier header necesario como tokens de autenticación
    });
  }

  // CREATE
  createItem(item: any): Observable<any> {
    return this.http.post(this.apiUrl, item, { headers: this.getHeaders() });
  }

  // READ (all)
  getItems(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getHeaders() });
  }

  // READ (one)
  getItem(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  // UPDATE
  updateItem(id: number, item: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, item, { headers: this.getHeaders() });
  }

  // DELETE
  deleteItem(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}