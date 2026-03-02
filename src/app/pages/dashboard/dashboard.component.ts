import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentService } from './studentsenrollment/service/student.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  totalStudents = 0;
  trialActive = 0;
  trialExpired = 0;
  paidUsers = 0;
  pendingApprovals = 0;

  // you can keep/change/remove these trend values
  totalStudentsTrend = 12;
  trialActiveTrend = 0;
  trialExpiredTrend = -2;
  paidUsersTrend = 15;

  loading = false;
  error: string | null = null;

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.fetchStudents();
  }

  pendingUsers: any[] = [];

  fetchStudents(): void {
    this.loading = true;
    this.error = null;

    this.studentService.getStudent(1, 1000, {}).subscribe({
      next: (res: any) => {
        const users = res?.users || [];
        const nonSuperUsers = users.filter((u: any) => !u.isSuperAdmin);
        this.totalStudents = nonSuperUsers.length;

        const now = new Date();

        let trialActiveCount = 0;
        let trialExpiredCount = 0;
        let paidCount = 0;
        let pendingCount = 0;
        const pendingList: any[] = [];

        nonSuperUsers.forEach((user: any) => {
          const sub = user.subscription || {};
          const status: string | undefined = sub.status;
          const expiresAt: Date | null = sub.expiresAt
            ? new Date(sub.expiresAt)
            : null;

          if (status === 'TRIAL' && !expiresAt) {
            pendingCount++;
            pendingList.push(user);
            return;
          }

          // ✅ If backend already marked expired
          if (status === 'EXPIRED') {
            trialExpiredCount++;
            return;
          }

          if (status === 'TRIAL' && expiresAt) {
            if (expiresAt < now) {
              trialExpiredCount++;
            } else {
              trialActiveCount++;
            }
          }

          if (status === 'ACTIVE' || status === 'PAID') {
            paidCount++;
          }
        });

        this.trialActive = trialActiveCount;
        this.trialExpired = trialExpiredCount;
        this.paidUsers = paidCount;
        this.pendingApprovals = pendingCount;
        this.pendingUsers = pendingList;

        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to load dashboard data';
        this.loading = false;
      },
    });
  }
}
