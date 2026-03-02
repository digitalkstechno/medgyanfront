import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environment/env';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient) {}

  categoryApi = `${environment.baseurl}category`;

  /* ================= CATEGORY ================= */

  createCategories(data: FormData) {
    return this.http.post(`${this.categoryApi}`, data);
  }

  getCategories() {
    return this.http.get(`${this.categoryApi}`);
  }
}
