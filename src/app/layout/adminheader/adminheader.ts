import { Component } from '@angular/core';
import { SHARED_IMPORTS } from '../../constant/shared_imports';

@Component({
  selector: 'app-adminheader',
  imports: [SHARED_IMPORTS],
  templateUrl: './adminheader.html',
  styleUrl: './adminheader.css',
})
export class Adminheader {
  userInitials: string = 'P'; // Default fallback

}
