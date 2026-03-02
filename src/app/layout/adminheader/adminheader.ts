import { Component } from '@angular/core';
import { SHARED_IMPORTS } from '../../constant/shared_imports';
import { AuthService } from '../../authentication/service/auth.service';

@Component({
  selector: 'app-adminheader',
  imports: [SHARED_IMPORTS],
  templateUrl: './adminheader.html',
  styleUrl: './adminheader.css',
})
export class Adminheader {
  userInitials: string = 'P'; // Default fallback
fullName : string = ''
  constructor(private authService : AuthService){}


 ngOnInit() {

  const user = this.authService.getUser();
  // console.log("🚀 ~ Adminheader ~ ngOnInit ~ user:", user);

  /* ---------- DISPLAY NAME ---------- */
  this.fullName = user?.name || user?.userName || 'Admin';

  // console.log("🚀 ~ Adminheader ~ ngOnInit ~ fullName:", this.fullName);

  /* ---------- INITIALS LOGIC ---------- */
  const names = this.fullName.trim().split(' ').filter(Boolean);

  if (names.length > 1) {
    // Example: Super Admin → SA
    this.userInitials =
      names[0].charAt(0).toUpperCase() +
      names[1].charAt(0).toUpperCase();
  } else {
    // Example: Admin → A
    this.userInitials = names[0].charAt(0).toUpperCase();
  }

}

}
