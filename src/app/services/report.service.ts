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

  getWorkInProgressReport(data: any): Observable<any> {
    const queryParam = `contractor=${data.mainContractor}&name=${data.projectName}&unit=${data.projectUnit}&unitId=${data.unitId}`;
    return this.httpClient
      .get(`${this.apiEndPoint}/wip-report?${queryParam}`)
      .pipe(
        map((res: any) => {
          if (res && res.success) {
            return res.data;
          }
        })
      );
  }
  getInstallationProgressOverviewReport(data: any): Observable<any> {
    const queryParam = `contractor=${data.mainContractor}&name=${data.projectName}&unit=${data.projectUnit}&unitId=${data.unitId}`;
    return this.httpClient
      .get(`${this.apiEndPoint}/ipo-report?${queryParam}`)
      .pipe(
        map((res: any) => {
          if (res && res.success) {
            return res.data;
          }
        })
      );
  }
}
