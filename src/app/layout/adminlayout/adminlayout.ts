import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SHARED_IMPORTS } from '../../constant/shared_import';
import { Adminsidebar } from '../adminsidebar/adminsidebar';
import { Adminfooter } from '../adminfooter/adminfooter';
import { Adminheader } from '../adminheader/adminheader';
@Component({
  selector: 'app-adminlayout',
  imports: [SHARED_IMPORTS, Adminfooter, Adminsidebar, Adminheader],
  templateUrl: './adminlayout.html',
  styleUrl: './adminlayout.css',
})
export class Adminlayout {

   
isCollapsed = false;

  onSidebarCollapseChange(collapsed: boolean) {
    this.isCollapsed = collapsed;
  }

}








