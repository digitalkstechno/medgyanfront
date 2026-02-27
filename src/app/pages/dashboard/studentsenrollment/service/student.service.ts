import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../../environment/env';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private http : HttpClient) { }

  studentapi = `${environment.baseurl}user`

  getStudent():Observable<any>{
    return this.http.get(`${this.studentapi}`)
  }
  getStudentbyId(studentId : string):Observable<any>{
    return this.http.get(`${this.studentapi}${studentId}`)
  }
  updateStudent(studentId : string , studentdata : any):Observable<any>{
    return this.http.put(`${this.studentapi}/${studentId}`,studentdata)
  }


  deleteStudent(studentId : string):Observable<any>{
    return this.http.delete(`${this.studentapi}/${studentId}`)
  }
}
