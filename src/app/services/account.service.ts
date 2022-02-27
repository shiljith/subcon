import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Account } from '../models/account';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  apiEndPoint: string = `${environment.baseUrl}/account`;

  constructor(private httpClient: HttpClient) {}

  get(): Observable<any> {
    return this.httpClient.get(this.apiEndPoint).pipe(
      map((res: any) => {
        if (res && res.success) {
          return res.data;
        }
      })
    );
  }

  update(data: Account): Observable<any> {
    return this.httpClient.patch(this.apiEndPoint, data).pipe(
      map((res: any) => {
        if (res && res.success) {
          return res.success;
        }
      })
    );
  }
}
