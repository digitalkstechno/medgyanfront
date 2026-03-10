import { Component, OnInit } from '@angular/core';
import { SHARED_IMPORTS } from '../../../constant/shared_imports';
import { StudentService } from '../../dashboard/studentsenrollment/service/student.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-subscriptioncontrol',
  standalone: true,
  imports: [SHARED_IMPORTS],
  templateUrl: './subscriptioncontrol.component.html',
  styleUrl: './subscriptioncontrol.component.css',
})
export class SubscriptioncontrolComponent implements OnInit {
  students: any[] = [];
  searchControl = new FormControl('');
  searchTerm = '';
  selectedStudent: any = null;
     isApproving = false;
       isExtending = false;
  // modals
  showApproveModal = false;
  showExtendModal = false;

  approveForm!: FormGroup;
  extendForm!: FormGroup;

  // pagination state
  page = 1;
  limit = 10;
  total = 0;
  pages = 0;
  paginationArray: number[] = [];

  constructor(private studentservice: StudentService) {}

  ngOnInit() {
    this.initForms();
    this.searchfunction();
    this.loadStudents();
  }

  initForms() {
    this.approveForm = new FormGroup({
      startDate: new FormControl('', Validators.required),
      expiryDate: new FormControl('', Validators.required),
      accessType: new FormControl('TRIAL', Validators.required),
      notes: new FormControl(''),
    });

    this.extendForm = new FormGroup({
      expiryDate: new FormControl('', Validators.required),
    });
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
          .filter((u: any) => !u.isBlocked)
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

  // ================= APPROVE / CHANGE PLAN =================
  openApproveModal(student?: any) {
    if (student) {
      this.selectedStudent = { ...student };
    }

    const sub = this.selectedStudent?.subscription;

    const formatForInput = (iso: string | null | undefined): string => {
      if (!iso) return '';
      return new Date(iso).toISOString().split('T')[0];
    };

    const today = new Date().toISOString().split('T')[0];

    let startForForm = today;
    let expiryForForm = '';

    if (sub?.expiresAt) {
      const oldExpiry = new Date(sub.expiresAt);
      const nextDay = new Date(oldExpiry.getTime());
      nextDay.setDate(oldExpiry.getDate() + 1);
      startForForm = nextDay.toISOString().split('T')[0];

      const plus30 = new Date(nextDay.getTime());
      plus30.setDate(plus30.getDate() + 30);
      expiryForForm = plus30.toISOString().split('T')[0];
    }

    this.approveForm.patchValue({
      startDate: formatForInput(sub?.startDate) ? startForForm : startForForm,
      expiryDate: expiryForForm || '',
      accessType: sub?.subscription_plan || 'TRIAL',
      notes: '',
    });

    this.showApproveModal = true;
  }

  getPreviewPlanName(): string {
    const accessType = this.approveForm.get('accessType')?.value;
    const planNames: { [key: string]: string } = {
      TRIAL: 'Trial',
      PREMIUM: 'Premium',
    };
    return planNames[accessType] || 'Access';
  }

    approveUser() {
    if (this.approveForm.invalid || !this.selectedStudent) {
      console.error('Form invalid or no student selected');
      return;
    }

    if (this.isApproving) return; // extra safety

    this.isApproving = true;

    const selectedPlan = this.approveForm.value.accessType;
    const status = selectedPlan === 'TRIAL' ? 'TRIAL' : 'ACTIVE';

    const payload = {
      subscription: {
        status,
        subscription_plan: selectedPlan,
        startDate: this.approveForm.value.startDate,
        expiresAt: this.approveForm.value.expiryDate,
      },
      subscriptionLog: {
        accessType: selectedPlan,
        notes:
          this.approveForm.value.notes || `Granted ${selectedPlan} plan`,
        action: 'ADMIN_APPROVED',
      },
    };

    this.studentservice
      .updateStudent(this.selectedStudent._id, payload)
      .subscribe({
        next: (response: any) => {
          const index = this.students.findIndex(
            (s) => s._id === this.selectedStudent._id
          );
          if (index !== -1 && response.data) {
            this.students[index] = response.data;
          }

          alert(
            `✅ ${this.getPreviewPlanName()} plan granted successfully!`
          );
          this.closeAllModals();
          this.loadStudents();
          this.isApproving = false;
        },
        error: (error) => {
          console.error('❌ Approval failed:', error);
          alert(
            '❌ Approval failed: ' + (error.error?.error || 'Try again')
          );
          this.isApproving = false;
        },
      });
  }

  // ================= EXTEND =================
  openExtendModal(student: any) {
    if (!student || !student.subscription) return;
    this.selectedStudent = { ...student };

    const sub = this.selectedStudent.subscription;

    const currentExpiry = sub.expiresAt
      ? new Date(sub.expiresAt)
      : new Date();
    const newExpiry = new Date(currentExpiry.getTime());
    newExpiry.setDate(newExpiry.getDate() + 30);
    const newExpiryStr = newExpiry.toISOString().split('T')[0];

    this.extendForm.patchValue({
      expiryDate: newExpiryStr,
    });

    this.showExtendModal = true;
  }

  // extendSubscription() {
  //   if (this.extendForm.invalid || !this.selectedStudent) return;

  //   const body = {
  //     expiresAt: this.extendForm.value.expiryDate,
  //     subscription_plan:
  //       this.selectedStudent.subscription?.subscription_plan || 'TRIAL',
  //     notes: 'Subscription extended by admin',
  //   };

  //   this.studentservice
  //     .extendSubscription(this.selectedStudent._id, body)
  //     .subscribe({
  //       next: () => {
  //         alert('Subscription extended successfully!');
  //         this.closeAllModals();
  //         this.loadStudents();
  //       },
  //       error: (error) => {
  //         console.error('❌ Extend failed:', error);
  //         alert(
  //           'Extension failed: ' + (error.error?.error || 'Unknown error')
  //         );
  //       },
  //     });
  // }

   extendSubscription() {
    if (this.extendForm.invalid || !this.selectedStudent) return;
    if (this.isExtending) return; // double-click guard

    this.isExtending = true;

    const body = {
      expiresAt: this.extendForm.value.expiryDate,
      subscription_plan:
        this.selectedStudent.subscription?.subscription_plan || 'TRIAL',
      notes: 'Subscription extended by admin',
    };

    this.studentservice
      .extendSubscription(this.selectedStudent._id, body)
      .subscribe({
        next: () => {
          alert('Subscription extended successfully!');
          this.closeAllModals();
          this.loadStudents();
          this.isExtending = false;
        },
        error: (error) => {
          console.error('❌ Extend failed:', error);
          alert(
            'Extension failed: ' + (error.error?.error || 'Unknown error')
          );
          this.isExtending = false;
        },
      });
  }

  closeExtendModal() {
    this.showExtendModal = false;
    this.extendForm.reset();
  }

  isSubscriptionExpired(student: any): boolean {
    const exp = student?.subscription?.expiresAt;
    if (!exp) return false;
    return this.getDaysLeft(exp) === 0;
  }

  // ================= HELPERS =================
  closeAllModals() {
    this.showApproveModal = false;
    this.showExtendModal = false;
    this.selectedStudent = null;
    this.approveForm.reset();
    this.extendForm.reset();
  }

  getDaysLeft(expiryDate: string): number {
    const today = new Date().getTime();
    const expiry = new Date(expiryDate).getTime();
    const diff = Math.ceil(
      (expiry - today) / (1000 * 60 * 60 * 24)
    );
    return diff < 0 ? 0 : diff;
  }

  getExpiryLabel(expiry: string | null): string {
    if (!expiry) return '';

    const today = new Date();
    const exp = new Date(expiry);

    today.setHours(0, 0, 0, 0);
    exp.setHours(0, 0, 0, 0);

    const diffMs = exp.getTime() - today.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'expires today';
    if (diffDays === 1) return 'expires in 1 day';
    if (diffDays > 1) return `expires in ${diffDays} days`;
    return `expired ${Math.abs(diffDays)} days ago`;
  }

  getStartLabel(startDate: string | null): string {
    if (!startDate || !this.selectedStudent?.subscription) return '';

    const start = new Date(startDate);
    const today = new Date();

    start.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffMs = today.getTime() - start.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    const plan = this.selectedStudent.subscription.subscription_plan;

    if (diffDays === 0) {
      return `Your ${plan} version started today`;
    }
    if (diffDays === 1) {
      return `Your ${plan} version started 1 day ago`;
    }
    return `Your ${plan} version started ${diffDays} days ago`;
  }
}
