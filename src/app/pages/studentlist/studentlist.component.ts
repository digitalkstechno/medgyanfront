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
    this.loadstudents();
  }

  initForms() {
    this.approveForm = this.fb.group({
      startDate: ['', Validators.required],
      expiryDate: ['', Validators.required],
      accessType: ['Standard Trial (Restricted)'],
      notes: ['']
    });

    this.extendForm = this.fb.group({
      expiryDate: ['', Validators.required]
    });
  }

  // ✅ load only NON super admin users
  loadstudents() {
    this.studentservice.getStudent().subscribe((res: any[]) => {
      this.students = res.filter(u => !u.isSuperAdmin);
    });
  }

  // ================= ACTION MODAL =================

  openActionModal(student: any) {
    this.selectedStudent = student;
    console.log("🚀 ~ StudentlistComponent ~ openActionModal ~  this.selectedStudent:",  this.selectedStudent)
    this.showActionModal = true;
  }

  closeActionModal() {
    this.showActionModal = false;
  }

  // ================= APPROVE =================

  openApproveModal(student?: any) {
    if (student) this.selectedStudent = student;

    this.showActionModal = false;
    this.showApproveModal = true;

    const today = new Date().toISOString().split('T')[0];
    this.approveForm.patchValue({ startDate: today });
  }

  approveUser() {
    if (this.approveForm.invalid || !this.selectedStudent) return;

    const payload = {
      subscription: {
        status: 'TRIAL',
        expiresAt: this.approveForm.value.expiryDate
      }
    };

    this.studentservice
      .updateStudent(this.selectedStudent._id, payload)
      .subscribe(() => {
        this.closeAllModals();
        this.loadstudents();
      });
  }

  // ================= EXTEND =================

  extendSubscription() {
    if (this.extendForm.invalid || !this.selectedStudent) return;

    const payload = {
      subscription: {
        status: 'ACTIVE',
        expiresAt: this.extendForm.value.expiryDate
      }
    };

    this.studentservice
      .updateStudent(this.selectedStudent._id, payload)
      .subscribe(() => {
        this.closeAllModals();
        this.loadstudents();
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
        this.loadstudents();
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
}
