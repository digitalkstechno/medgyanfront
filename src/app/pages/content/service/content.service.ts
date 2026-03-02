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

  getAllContent() {
    return this.http.get(`${this.contentApi}`);
  }



}
