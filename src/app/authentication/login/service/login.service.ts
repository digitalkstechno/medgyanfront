import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environment/env';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http : HttpClient) { }


  loginurl = `${environment.baseurl}login`;


    login(userData: any): Observable<any> {
    return this.http.post(this.loginurl, userData);
  }


}
