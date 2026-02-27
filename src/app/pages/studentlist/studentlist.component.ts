import { Component, OnInit } from '@angular/core';
import { StudentService } from '../dashboard/studentsenrollment/service/student.service';
import { SHARED_IMPORTS } from '../../constant/shared_imports';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-studentlist',
  standalone: true,
  imports: [SHARED_IMPORTS],
  templateUrl: './studentlist.component.html',
  styleUrl: './studentlist.component.css'
})
export class StudentlistComponent implements OnInit {
students: any[] = [];
  selectedStudent: any = null;

  // pagination state
  page = 1;
  limit = 10;
  total = 0;
  pages = 0;

  // modals
  showApproveModal = false;
  showActionModal = false;

  approveForm!: FormGroup;
  extendForm!: FormGroup;

  constructor(
    private studentservice: StudentService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.initForms();
    this.loadStudents();
  }

  initForms() {
    this.approveForm = this.fb.group({
      startDate: ['', Validators.required],
      expiryDate: ['', Validators.required],
      accessType: ['Standard Trial (Restricted)'],
      notes: [''],
    });

    this.extendForm = this.fb.group({
      startDate: ['', Validators.required],
      expiryDate: ['', Validators.required],
    });
  }

  // ================= LOAD WITH PAGINATION =================
  loadStudents() {
    this.studentservice.getStudent(this.page, this.limit).subscribe((res: any) => {
      // res = { success, message, users, pagination }
      this.students = (res.users || []).filter((u: any) => !u.isSuperAdmin);

      if (res.pagination) {
        this.page = res.pagination.page;
        this.limit = res.pagination.limit;
        this.total = res.pagination.total;
        this.pages = res.pagination.pages;
      }
    });
  }

  // simple helpers for UI
  canPrev(): boolean {
    return this.page > 1;
  }

  canNext(): boolean {
    return this.page < this.pages;
  }

  goToPage(page: number) {
    if (page < 1 || page > this.pages) return;
    this.page = page;
    this.loadStudents();
  }

  nextPage() {
    if (!this.canNext()) return;
    this.page++;
    this.loadStudents();
  }

  prevPage() {
    if (!this.canPrev()) return;
    this.page--;
    this.loadStudents();
  }

  // ================= ACTION MODAL =================
  openActionModal(student: any) {
    this.selectedStudent = student;
    console.log("🚀 ~ StudentlistComponent ~ openActionModal ~  this.selectedStuden:",  this.selectedStudent)
    this.showActionModal = true;
  }

  closeActionModal() {
    this.showActionModal = false;
  }

  // ================= APPROVE =================
  openApproveModal(student?: any) {
    if (student) this.selectedStudent = student;
    console.log(
      '🚀 ~ StudentlistComponent ~ openApproveModal ~ this.selectedStudent :',
      this.selectedStudent
    );

    this.showActionModal = false;
    this.showApproveModal = true;

    const sub = this.selectedStudent?.subscription;

    // convert ISO string to yyyy-MM-dd for <input type="date">
    const formatForInput = (iso: string | null | undefined): string => {
      if (!iso) return '';
      return new Date(iso).toISOString().split('T')[0];
    };

    const today = new Date().toISOString().split('T')[0];

    this.approveForm.patchValue({
      startDate: formatForInput(sub?.startDate) || today,
      expiryDate: formatForInput(sub?.expiresAt) || '',
      accessType: this.approveForm.value.accessType || 'Standard Trial (Restricted)',
      notes: this.approveForm.value.notes || '',
    });
  }


  approveUser() {
    if (this.approveForm.invalid || !this.selectedStudent) return;

    const payload = {
      subscription: {
        status: 'TRIAL',
        expiresAt: this.approveForm.value.expiryDate,
        startDate: this.approveForm.value.startDate,
      },
    };

    this.studentservice
      .updateStudent(this.selectedStudent._id, payload)
      .subscribe(() => {
        this.closeAllModals();
        this.loadStudents();
      });
  }

  // ================= EXTEND =================
  extendSubscription() {
    if (this.extendForm.invalid || !this.selectedStudent) return;

    const payload = {
      subscription: {
        status: 'ACTIVE',
        expiresAt: this.extendForm.value.expiryDate,
      },
    };

    this.studentservice
      .updateStudent(this.selectedStudent._id, payload)
      .subscribe(() => {
        this.closeAllModals();
        this.loadStudents();
      });
  }

  // ================= DELETE =================
  deleteUser() {
    if (!this.selectedStudent) return;
    if (!confirm('Delete this user?')) return;

    this.studentservice
      .deleteStudent(this.selectedStudent._id)
      .subscribe(() => {
        this.closeAllModals();
        this.loadStudents();
      });
  }

  // ================= HELPERS =================
  closeAllModals() {
    this.showApproveModal = false;
    this.showActionModal = false;
    this.selectedStudent = null;
  }

  getDaysLeft(expiry: string | null): number {
    if (!expiry) return 0;
    const diff = new Date(expiry).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
  getExpiryLabel(expiry: string | null): string {
  if (!expiry) return '';

  const today = new Date();
  const exp = new Date(expiry);

  // normalize to midnight to avoid time zone issues
  today.setHours(0, 0, 0, 0);
  exp.setHours(0, 0, 0, 0);

  const diffMs = exp.getTime() - today.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'expires today';
  }

  if (diffDays === 1) {
    return 'expires in 1 day';
  }

  if (diffDays > 1) {
    return `expires in ${diffDays} days`;
  }

  // already expired
  return `expired ${Math.abs(diffDays)} days ago`;
}

  getStartLabel(startDate: string | null): string {
  if (!startDate) return '';

  const start = new Date(startDate);
  const today = new Date();

  // normalize to midnight to avoid time-zone hour differences
  start.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffMs = today.getTime() - start.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return `Your ${this.selectedStudent.subscription?.status} version started today`;
  }

  if (diffDays === 1) {
    return `Your ${this.selectedStudent.subscription?.status} version started 1 day ago`;
  }

  return `Your ${this.selectedStudent.subscription?.status} version started ${diffDays} days ago`;
}

}
