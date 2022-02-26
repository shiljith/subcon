import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { WIP } from '../models/wip';

@Injectable({
  providedIn: 'root',
})
export class WipService {
  apiEndPoint: string = `${environment.baseUrl}/wip`;

  constructor(private httpClient: HttpClient) {}

  getAll(projectId: number): Observable<any> {
    return this.httpClient.get(`${this.apiEndPoint}/${projectId}`).pipe(
      map((res: any) => {
        if (res && res.success) {
          return res.data;
        }
      }),
      catchError(this.handleError)
    );
  }

  add(data: WIP): Observable<any> {
    return this.httpClient.post(this.apiEndPoint, data).pipe(
      map((res: any) => {
        if (res && res.success) {
          return res.success;
        }
      }),
      catchError(this.handleError)
    );
  }

  update(data: WIP, id: number): Observable<any> {
    return this.httpClient.patch(`${this.apiEndPoint}/${id}`, data).pipe(
      map((res: any) => res.success),
      catchError(this.handleError)
    );
  }

  updateStatus(data: any, id: number): Observable<any> {
    return this.httpClient
      .patch(`${this.apiEndPoint}/change-status/${id}`, data)
      .pipe(
        map((res: any) => res.success),
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
