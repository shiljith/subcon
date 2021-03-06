import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  baseUrl: string = `${environment.baseUrl}/dashboard`;

  constructor(private http: HttpClient) {}

  getTileValues() {
    return this.http.get(`${this.baseUrl}/tile-values`).pipe(
      map((res: any) => {
        if (res && res.success) {
          return res.data;
        }
      })
    );
  }
  getWorkValueData() {
    return this.http.get(`${this.baseUrl}/month-wise-work-value`).pipe(
      map((res: any) => {
        if (res && res.success) {
          return res.data;
        }
      })
    );
  }

  getProjectStatus() {
    return this.http.get(`${this.baseUrl}/project-status`).pipe(
      map((res: any) => {
        if (res && res.success) {
          return res.data;
        }
      })
    );
  }

  getManHour() {
    return this.http.get(`${this.baseUrl}/man-hour`).pipe(
      map((res: any) => {
        if (res && res.success) {
          return res.data;
        }
      })
    );
  }
}
