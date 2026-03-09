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

  showQrUpload = false;
  // multiple new files selected in UI
  selectedQrFiles: File[] = [];
  qrPreviewUrls: string[] = [];
  isRemovingQr = false;

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
    this.loaduserbyID(this.user._id);
  }

  loaduserbyID(userid: string): void {
    this.studentService.getStudentbyId(userid).subscribe((res) => {
      this.user = res;
      // user.Qrthumbnail is string[] from backend
    });
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

  toggleQrUpload(): void {
    this.showQrUpload = !this.showQrUpload;
    if (!this.showQrUpload) {
      this.clearSelectedQrFiles();
    }
  }

  passwordMatchValidator(group: FormGroup) {
    const newPass = group.get('newPassword')?.value;
    const confirmPass = group.get('confirmPassword')?.value;
    if (!newPass || !confirmPass) return null;
    return newPass === confirmPass ? null : { mismatch: true };
  }

  updatePassword(): void {
    if (this.passwordForm.invalid || !this.user?._id) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const data = { pin: this.passwordForm.value.newPassword };

    this.studentService.ChangePassword(this.user._id, data).subscribe({
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

  // QR upload handlers (multiple)
  onQrFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      this.clearSelectedQrFiles();
      return;
    }

    this.selectedQrFiles = Array.from(input.files);
    this.qrPreviewUrls = [];

    this.selectedQrFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        this.qrPreviewUrls.push(reader.result as string);
      };
      reader.readAsDataURL(file);
    });
  }

  uploadQr(): void {
    if (!this.selectedQrFiles || this.selectedQrFiles.length === 0 || !this.user?._id) {
      return;
    }

    const formData = new FormData();
    this.selectedQrFiles.forEach((file) => {
      formData.append('Qrthumbnail', file);
    });

    this.studentService.updateProfile(this.user._id, formData).subscribe({
      next: (res) => {
        alert('QR code(s) updated successfully');
        if (res?.data?.Qrthumbnail && res.data.Qrthumbnail.length > 0) {
          this.user.Qrthumbnail = res.data.Qrthumbnail;
        } else {
          this.user.Qrthumbnail = [];
        }
        this.clearSelectedQrFiles();
      },
      error: (err) => {
        console.error(err);
        alert(err?.error?.error || 'Failed to update QR code(s)');
      },
    });
  }

  // remove a selected **new** file from the local list before upload
  removeSelectedPreview(index: number): void {
    this.selectedQrFiles.splice(index, 1);
    this.qrPreviewUrls.splice(index, 1);
  }

  clearSelectedQrFiles(): void {
    this.selectedQrFiles = [];
    this.qrPreviewUrls = [];
  }

  // remove ALL existing QR using update API only (no new file)
  removeQr(): void {
    if (!this.user?._id || !this.user?.Qrthumbnail || this.isRemovingQr) {
      return;
    }

    const confirmRemove = confirm('Are you sure you want to remove all current QR code(s)?');
    if (!confirmRemove) {
      return;
    }

    this.isRemovingQr = true;

    const formData = new FormData();
    formData.append('removeQr', 'true');

    this.studentService.updateProfile(this.user._id, formData).subscribe({
      next: (res) => {
        alert('QR code(s) removed successfully');
        this.user.Qrthumbnail = [];
        this.clearSelectedQrFiles();
        this.isRemovingQr = false;
      },
      error: (err) => {
        console.error(err);
        alert(err?.error?.error || 'Failed to remove QR code(s)');
        this.isRemovingQr = false;
      },
    });
  }

  // remove a PARTICULAR existing QR by filename
  removeExistingQr(filename: string): void {
    if (!this.user?._id || this.isRemovingQr) return;

    const ok = confirm('Remove this QR image?');
    if (!ok) return;

    this.isRemovingQr = true;

    const formData = new FormData();
    formData.append('removeQrName', filename);

    this.studentService.updateProfile(this.user._id, formData).subscribe({
      next: (res) => {
        alert('QR image removed successfully');
        this.user.Qrthumbnail = res.data?.Qrthumbnail || [];
        this.isRemovingQr = false;
      },
      error: (err) => {
        console.error(err);
        alert(err?.error?.error || 'Failed to remove QR image');
        this.isRemovingQr = false;
      },
    });
  }
}
