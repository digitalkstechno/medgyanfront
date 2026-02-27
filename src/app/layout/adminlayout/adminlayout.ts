import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Adminfooter } from '../adminfooter/adminfooter';
import { Adminheader } from '../adminheader/adminheader';
import { SHARED_IMPORTS } from '../../constant/shared_imports';
import { styAdminsidebar } from "../adminsidebar/adminsidebar";
@Component({
  selector: 'app-adminlayout',
  imports: [SHARED_IMPORTS, Adminfooter, Adminheader, RouterOutlet, styAdminsidebar],
  templateUrl: './adminlayout.html',
  styleUrl: './adminlayout.css',
})
export class Adminlayout {


isCollapsed = false;

  onSidebarCollapseChange(collapsed: boolean) {
    this.isCollapsed = collapsed;
  }

}








