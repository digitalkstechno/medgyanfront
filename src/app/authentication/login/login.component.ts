import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SHARED_IMPORTS } from '../../constant/shared_imports';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from './service/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SHARED_IMPORTS],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm: FormGroup;
  loading = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private loginservice: LoginService
  ) {
    this.loginForm = this.fb.group({
      identifier: ['', Validators.required], // ✅ username OR email
      pin: ['', Validators.required],
    });
  }

  OnSubmit() {
    if (this.loginForm.invalid) return;

    this.loading = true;

    const payload = {
      ...this.loginForm.value,
      deviceId: this.getDeviceId(),
      deviceInfo: this.getDeviceInfo(),
    };

    this.loginservice.login(payload).subscribe({
      next: (res: any) => {
        console.log('✅ Login success', res);

        // ✅ STORE for guard
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));

        // optional device store
        if (res.device) {
          localStorage.setItem('device', JSON.stringify(res.device));
        }

        // ✅ super admin redirect
        if (res.user?.isSuperAdmin) {
          this.router.navigateByUrl('/medgyan');
        } else {
          this.router.navigateByUrl('/');
        }

        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Login error', err);
        this.loading = false;
      }
    });
  }

  // ✅ simple device id
  private getDeviceId(): string {
    let id = localStorage.getItem('deviceId');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('deviceId', id);
    }
    return id;
  }

  // ✅ device info
  private getDeviceInfo() {
    return {
      deviceName: 'Web Browser',
      browser: navigator.userAgent,
      os: navigator.platform,
      deviceType: 'web',
      userAgent: navigator.userAgent,
    };
  }
}
