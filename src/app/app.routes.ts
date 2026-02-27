import { Routes } from '@angular/router';
import { Adminlayout } from './layout/adminlayout/adminlayout';
import { adminGuard } from './authentication/guard/admin.guard';

export const routes: Routes = [


  {
    path : 'medgyan',
    component : Adminlayout,
    canActivate : [adminGuard],
    children : [

      {
        path : '',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then( m => m.DashboardComponent)

      },
      {
        path : 'student',
        // children : [
        //   {
            loadComponent : () => import('./pages/studentlist/studentlist.component').then( m => m.StudentlistComponent)
        //   }
        // ]
      }
    ]
  },

  {
    path : 'login',
    loadComponent : () => import('./authentication/login/login.component').then(m => m.LoginComponent)
  },

  {
    path : '**',
    redirectTo : 'login'
  }

];
