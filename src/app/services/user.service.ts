import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable, throwError } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  apiEndPoint: string = `${environment.baseUrl}/user`;

  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<any> {
    return this.httpClient.get(this.apiEndPoint).pipe(
      map((res: any) => {
        if (res && res.success) {
          return res.data;
        }
      }),
      catchError(this.handleError)
    );
  }

  add(data: User): Observable<any> {
    return this.httpClient.post(this.apiEndPoint, data).pipe(
      map((res: any) => {
        if (res && res.success) {
          return res.data;
        }
      }),
      catchError(this.handleError)
    );
  }

  update(data: User, id: number): Observable<any> {
    let API_URL = ``;
    return this.httpClient.put(`${this.apiEndPoint}/${id}`, data).pipe(
      map((res: any) => res.data),
      catchError(this.handleError)
    );
  }

  get(id: number): Observable<any> {
    return this.httpClient.get(`${this.apiEndPoint}/${id}`).pipe(
      map((res: any) => res.data),
      catchError(this.handleError)
    );
  }

  delete(id: number): Observable<any> {
    return this.httpClient.delete(`${this.apiEndPoint}/${id}`).pipe(
      map((res: any) => res.success),
      catchError(this.handleError)
    );
  }

  handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Handle client error
      errorMessage = error.error.message;
    } else {
      // Handle server error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
