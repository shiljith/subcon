import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  apiEndPoint: string = `${environment.baseUrl}/report`;
  report: any;

  constructor(private httpClient: HttpClient) {}

  getWorkInProgressReport(): Observable<any> {
    return this.httpClient.get(`${this.apiEndPoint}/wip-report`).pipe(
      map((res: any) => {
        if (res && res.success) {
          return res.data;
        }
      })
    );
  }
  getInstallationProgressOverviewReport(): Observable<any> {
    const data = {
      unit: 'Escalator',
      contractor: 'Aswin',
      name: 'javascript',
    };
    return this.httpClient
      .get(
        `${this.apiEndPoint}/ipo-report/${data.unit}/${data.contractor}/${data.name}`
      )
      .pipe(
        map((res: any) => {
          if (res && res.success) {
            return res.data;
          }
        })
      );
  }
}
