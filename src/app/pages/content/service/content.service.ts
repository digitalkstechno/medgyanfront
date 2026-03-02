import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environment/env';

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  constructor(private http: HttpClient) {}

  contentApi = `${environment.baseurl}content`;

  /* ================= CONTENT ================= */

  createContent(data: FormData) {
    return this.http.post(`${this.contentApi}`, data);
  }

  getAllContent( filters: any = {}) {
    const params: any = {...filters };
    return this.http.get(`${this.contentApi}`, { params });
  }
//   getAllContent(page = 1, limit = 10, filters: any = {}) {
//   const params: any = { page, limit, ...filters };
//   return this.http.get<any>(`${this.contentApi}`, { params });
// }



}
