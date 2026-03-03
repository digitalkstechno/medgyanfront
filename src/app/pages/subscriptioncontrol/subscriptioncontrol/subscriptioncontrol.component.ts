import { Component, OnInit } from '@angular/core';
import { SHARED_IMPORTS } from '../../../constant/shared_imports';
import { StudentService } from '../../dashboard/studentsenrollment/service/student.service';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-subscriptioncontrol',
  imports: [SHARED_IMPORTS],
  standalone: true,
  templateUrl: './subscriptioncontrol.component.html',
  styleUrl: './subscriptioncontrol.component.css',
})
export class SubscriptioncontrolComponent implements OnInit {
  students: any[] = [];
  searchControl = new FormControl('');
  searchTerm = '';

  // pagination state
  page = 1;
  limit = 10;
  total = 0;
  pages = 0;
  paginationArray: number[] = [];

  constructor(private studentservice: StudentService) {}

  ngOnInit() {
    this.searchfunction();
    this.loadStudents();
  }

  // ================= Search Function =================
  searchfunction() {
    this.searchControl.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value) => {
        this.searchTerm = (value || '').toString().trim();
        this.page = 1;
        this.loadStudents();
      });
  }

  // ================= LOAD WITH PAGINATION =================
  loadStudents() {
    const filters: any = {};

    if (this.searchTerm) {
      filters.name = this.searchTerm;
      filters.userName = this.searchTerm;
    }

    this.studentservice
      .getStudent(this.page, this.limit, filters)
      .subscribe((res: any) => {
        this.students = (res.users || [])
          .filter((u: any) => !u.isSuperAdmin)
          // do NOT show blocked users
          .filter((u: any) => !u.isBlocked)
          // only show users that have BOTH startDate and expiresAt
          .filter(
            (u: any) =>
              u.subscription &&
              !!u.subscription.startDate &&
              !!u.subscription.expiresAt
          );

        if (res.pagination) {
          this.page = res.pagination.page;
          this.limit = res.pagination.limit;
          this.total = res.pagination.total;
          this.pages = res.pagination.pages;
          this.buildPaginationArray();
        }
      });
  }

  buildPaginationArray() {
    this.paginationArray = Array.from({ length: this.pages }, (_, i) => i + 1);
  }

  changePage(p: number) {
    if (p < 1 || p > this.pages || p === this.page) return;
    this.page = p;
    this.loadStudents();
  }
}
