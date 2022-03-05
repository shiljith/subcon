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

  getWorkInProgressReport(filter: any): Observable<any> {
    const queryParam = `mainContractor=${filter.mainContractor}&projectName=${filter.projectName}&projectUnit=${filter.projectUnit}&unitNumber=${filter.unitNumber}&startDate=${filter.startDate}&endDate=${filter.endDate}`;
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
  getInstallationProgressOverviewReport(filter: any): Observable<any> {
    const queryParam = `mainContractor=${filter.mainContractor}&projectName=${filter.projectName}&projectUnit=${filter.projectUnit}&unitNumber=${filter.unitNumber}&startDate=${filter.startDate}&endDate=${filter.endDate}`;
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

  getMainContractors() {
    return this.httpClient.get(`${this.apiEndPoint}/get-contractors`).pipe(
      map((res: any) => {
        if (res && res.success) {
          return res.data;
        }
      })
    );
  }

  getProjects(filter: string) {
    return this.httpClient
      .get(`${this.apiEndPoint}/get-projects?filter=${filter}`)
      .pipe(
        map((res: any) => {
          if (res && res.success) {
            return res.data;
          }
        })
      );
  }

  getProjectUnits(filter: any) {
    const queryParam = `mainContractor=${filter.mainContractor}&projectName=${filter.projectName}`;
    return this.httpClient
      .get(`${this.apiEndPoint}/get-project-units?${queryParam}`)
      .pipe(
        map((res: any) => {
          if (res && res.success) {
            return res.data;
          }
        })
      );
  }

  getUnitNumbers(filter: any) {
    const queryParam = `mainContractor=${filter.mainContractor}&projectName=${filter.projectName}&projectUnit=${filter.projectUnit}`;
    return this.httpClient
      .get(`${this.apiEndPoint}/get-unit-numbers?${queryParam}`)
      .pipe(
        map((res: any) => {
          if (res && res.success) {
            return res.data;
          }
        })
      );
  }
}
