import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Project } from '../models/project';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  apiEndPoint: string = `${environment.baseUrl}/project`;

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

  filter(searchTerms: any): Observable<any> {
    console.log(searchTerms);
    return this.httpClient.post(`${this.apiEndPoint}/filter`, searchTerms).pipe(
      map((res: any) => {
        if (res && res.success) {
          return res.data;
        }
      }),
      catchError(this.handleError)
    );
  }
  add(data: Project): Observable<any> {
    return this.httpClient.post(this.apiEndPoint, data).pipe(
      map((res: any) => {
        if (res && res.success) {
          return res.success;
        }
      }),
      catchError(this.handleError)
    );
  }

  update(data: Project, id: number): Observable<any> {
    return this.httpClient.patch(`${this.apiEndPoint}/${id}`, data).pipe(
      map((res: any) => {
        if (res && res.success) {
          return res.success;
        }
      }),
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
      map((res: any) => {
        if (res && res.success) {
          return res.success;
        }
      }),
      catchError(this.handleError)
    );
  }

  // Error
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
