import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../authentication/service/auth.service';
import { SHARED_IMPORTS } from '../../constant/shared_imports';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [SHARED_IMPORTS],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  user: any = null;

  constructor(private authService: AuthService) {}

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
}
