import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SHARED_IMPORTS } from '../../constant/shared_imports';

@Component({
  selector: 'app-adminsidebar',
  imports: [SHARED_IMPORTS, CommonModule],
  templateUrl: './adminsidebar.html',
  styleUrl: './adminsidebar.css',
})
export class styAdminsidebar {

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


  // hasAnyMasterDropdownAccess(): boolean {
  //   const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');

  //   const check = (module: string) =>
  //     permissions.some((perm: any) =>
  //       perm.moduleName === module &&
  //       (perm.permissions?.create === 1 ||
  //        perm.permissions?.read === 1 ||
  //        perm.permissions?.update === 1 ||
  //        perm.permissions?.delete === 1)
  //     );

  //   return (
  //     check('doctor') ||
  //     check('service') ||
  //     check('serviceGroup') ||
  //     check('surgeryService') ||
  //     check('packages') ||
  //     check('bedType') ||
  //     check('bed') ||
  //     check('roomType') ||
  //     check('room') ||
  //     check('wardMaster') ||
  //     check('medicine') ||
  //     check('testParameter') ||
  //     check('testGroup') ||
  //     check('symptoms') ||
  //     check('symptomGroup')
  //   );
  // }

   dropdowns: {
    opd: boolean;
    master: boolean;
    ipd: boolean;
    doctor: boolean;
    user: boolean;
    layout: boolean;
    settings: boolean;
    course  : boolean;
    // add all other dropdowns here
  } = {
    opd: false,
    master: false,
    ipd: false,
    doctor: false,
    user: false,
    layout: false,
    settings: false,
    course: false,
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

  // In your sidebar component

  // logo shape









































}
