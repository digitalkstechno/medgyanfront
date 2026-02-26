import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { SHARED_IMPORTS } from '../../constant/shared_import';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-adminsidebar',
  imports: [SHARED_IMPORTS, CommonModule],
  templateUrl: './adminsidebar.html',
  styleUrl: './adminsidebar.css',
})
export class Adminsidebar {
 logoUrl!: string;
  doctorId: string = '';
  role: string = '';

  isCollapsed = false;
 
 
  constructor( private router : Router
    
  ) {}
 
 
  

  logout(): void {
   this.router.navigateByUrl('/login')
  }
 

  

 

  

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
