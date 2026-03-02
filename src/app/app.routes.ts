import { Routes } from '@angular/router';
import { Adminlayout } from './layout/adminlayout/adminlayout';
import { adminGuard } from './authentication/guard/admin.guard';

export const routes: Routes = [
  {
    path: 'medgyan',
    component: Adminlayout,
    canActivate: [adminGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent,
          ),
      },
      {
        path: 'student',
        loadComponent: () =>
          import('./pages/studentlist/studentlist.component').then(
            (m) => m.StudentlistComponent,
          ),
      },
      {
        path: 'category',
        loadComponent: () =>
          import('./pages/category/addcategory/addcategory.component').then(
            (m) => m.AddcategoryComponent,
          ),
      },
      {
        path: 'categorylist',
        loadComponent: () =>
          import('./pages/category/categorylist/categorylist.component').then(
            (m) => m.CategorylistComponent,
          ),
      },
      {
        path: 'content',
        loadComponent: () =>
          import('./pages/content/addcontent/addcontent.component').then(
            (m) => m.AddcontentComponent,
          ),
      },
      {
        path: 'contentlist',
        loadComponent: () =>
          import('./pages/content/contentlist/contentlist.component').then(
            (m) => m.ContentlistComponent,
          ),
      },

      {
        path: 'profile',
        loadComponent : () => import('./pages/profile/profile.component').then(m => m.ProfileComponent)
      },
    ],
  },


  {
    path: 'login',
    loadComponent: () =>
      import('./authentication/login/login.component').then(
        (m) => m.LoginComponent,
      ),
  },

  {
    path: '**',
    redirectTo: 'login',
  },
];
