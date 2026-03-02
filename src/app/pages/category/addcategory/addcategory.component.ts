import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SHARED_IMPORTS } from '../../../constant/shared_imports';
import { CategoryService } from '../service/category.service';

@Component({
  selector: 'app-addcategory',
  standalone: true,
  imports: [SHARED_IMPORTS],
  templateUrl: './addcategory.component.html',
  styleUrl: './addcategory.component.css'
})
export class AddcategoryComponent implements OnInit {

  categoryForm!: FormGroup;
  categories: any[] = [];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCategories();
  }

  initForm() {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      parent: [null]
    });
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe((res: any) => {
      this.categories = res || [];
    });
  }

  onSubmit() {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const formData = new FormData();
    formData.append('name', this.categoryForm.value.name);

    if (this.categoryForm.value.parent) {
      formData.append('parent', this.categoryForm.value.parent);
    }

    this.categoryService.createCategories(formData).subscribe({
      next: () => {
        alert('Category Created Successfully');
        this.categoryForm.reset();
        this.loadCategories();
        this.loading = false;
      },
      error: () => {
        alert('Error Creating Category');
        this.loading = false;
      }
    });
  }

}
