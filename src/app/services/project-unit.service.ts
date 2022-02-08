import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ProjectUnit } from '../models/project';

@Injectable({
  providedIn: 'root',
})
export class ProjectUnitService {
  apiEndPoint: string = `${environment.baseUrl}/project-unit`;

  constructor(private httpClient: HttpClient) {}

  getAll(projectId: number, projectUnitFilter: number): Observable<any> {
    return this.httpClient
      .get(`${this.apiEndPoint}/${projectId}/${projectUnitFilter}`)
      .pipe(
        map((res: any) => {
          if (res && res.success) {
            return res.data;
          }
        }),
        catchError(this.handleError)
      );
  }

  filter(data: any): Observable<any> {
    return this.httpClient.post(`${this.apiEndPoint}/filter`, data).pipe(
      map((res: any) => {
        if (res && res.success) {
          return res.data;
        }
      }),
      catchError(this.handleError)
    );
  }
  add(data: ProjectUnit): Observable<any> {
    return this.httpClient.post(this.apiEndPoint, data).pipe(
      map((res: any) => {
        if (res && res.success) {
          return res.success;
        }
      }),
      catchError(this.handleError)
    );
  }

  update(data: ProjectUnit, id: number): Observable<any> {
    let API_URL = ``;
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
    return this.httpClient.get(`${this.apiEndPoint}/details/${id}`).pipe(
      map((res: any) => res.data),
      catchError(this.handleError)
    );
  }

  getUnits(): Observable<any> {
    return this.httpClient.get(`${this.apiEndPoint}/units`).pipe(
      map((res: any) => {
        if (res && res.success) {
          return res.data;
        }
      }),
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
