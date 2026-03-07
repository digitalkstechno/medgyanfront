import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

import { AuthService } from '../../authentication/service/auth.service';
import { StudentService } from '../dashboard/studentsenrollment/service/student.service';
import { SHARED_IMPORTS } from '../../constant/shared_imports';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SHARED_IMPORTS],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  user: any = null;
  passwordForm: FormGroup;
  showChangePassword = false;

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private authService: AuthService
  ) {
    this.passwordForm = this.fb.group(
      {
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    this.user = this.authService.getUser();
    console.log('🚀 User:', this.user);
  }

  getInitials(): string {
    if (!this.user?.name) return 'A';
    return this.user.name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  toggleChangePassword(): void {
    this.showChangePassword = !this.showChangePassword;
    if (!this.showChangePassword) {
      this.passwordForm.reset();
    }
  }

  passwordMatchValidator(group: FormGroup) {
    const newPass = group.get('newPassword')?.value;
    const confirmPass = group.get('confirmPassword')?.value;
    if (!newPass || !confirmPass) return null;
    return newPass === confirmPass ? null : { mismatch: true };
  }

 // profile.component.ts
updatePassword(): void {
  if (this.passwordForm.invalid) {
    this.passwordForm.markAllAsTouched();
    return;
  }

  const data = { pin: this.passwordForm.value.newPassword };

  this.studentService.ChangePassword(this.user._id,data).subscribe({
    next: () => {
      alert('Password updated successfully');
      this.passwordForm.reset();
      this.showChangePassword = false;
    },
    error: (err) => {
      console.error(err);
      alert(err?.error?.error || 'Failed to update password');
    },
  });
}

}
