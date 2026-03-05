import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-adminfooter',
  imports: [],
  templateUrl: './adminfooter.html',
  styleUrl: './adminfooter.css',
})
export class Adminfooter {
logoUrl!: string;
  doctorId: string = '';
  role: string = '';

  isCollapsed = false;

 onLogoError(event: any) {
    event.target.src = 'DigiLogocropped-removebg-preview 1.jpg'; // fallback image
  }

  constructor( private router : Router

  ) {}

  userRole: string | null = null;

 logout(): void {
  // ✅ clear auth data
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('deviceId');

  // optional: clear everything
  // localStorage.clear();

  // ✅ redirect to login
  this.router.navigateByUrl('/login');
}

  allowedModules: string[] = [];
  ngOnInit() {



  }




   dropdowns: {
    user: boolean;
    layout: boolean;
    settings: boolean;
    course  : boolean;
    category  : boolean;
    // add all other dropdowns here
  } = {

    user: false,
    layout: false,
    settings: false,
    course: false,
    category : false
    // ...
  };


  // toggleDropdown(menu: keyof typeof this.dropdowns) {
  //   this.dropdowns[menu] = !this.dropdowns[menu];
  // }

  @Output() collapseChange = new EventEmitter<boolean>();

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;

    // Emit the change to parent component
    this.collapseChange.emit(this.isCollapsed);

    // Close all dropdowns when collapsing
    if (this.isCollapsed) {
      Object.keys(this.dropdowns).forEach(
        (key) => (this.dropdowns[key as keyof typeof this.dropdowns] = false)
      );
    }
  }
  // Keep your existing toggleDropdown function
  toggleDropdown(menu: keyof typeof this.dropdowns) {
    // Close all others first
    for (const key in this.dropdowns) {
      if (key !== menu) {
        this.dropdowns[key as keyof typeof this.dropdowns] = false;
      }
    }

    // Toggle the clicked one (open/close)
    this.dropdowns[menu] = !this.dropdowns[menu];
  }

  sidebarCollapsed = false;

  isSidebarOpen = false;
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    if (this.isSidebarOpen) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
      // Optionally, also close dropdowns
      Object.keys(this.dropdowns).forEach(
        (key) => (this.dropdowns[key as keyof typeof this.dropdowns] = false)
      );
    }
  }
  screenIsSmall = false;
  @HostListener('window:resize')
  onResize() {
    this.screenIsSmall = window.innerWidth <= 600;
  }

}
