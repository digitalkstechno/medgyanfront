import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SHARED_IMPORTS } from '../../../constant/shared_imports';
import { ContentService } from '../service/content.service';
import { CategoryService } from '../../category/service/category.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-addcontent',
  standalone: true,
  imports: [SHARED_IMPORTS],
  templateUrl: './addcontent.component.html',
  styleUrl: './addcontent.component.css'
})
export class AddcontentComponent implements OnInit {

  contentForm!: FormGroup;
  categories: any[] = [];
  thumbnailFile: any;

  plans = ["TRIAL","BASIC","PRO","PREMIUM"];

  constructor(
    private fb: FormBuilder,
    private contentService: ContentService,
    private categoryService : CategoryService,
    private router : Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCategories();
  }

  initForm() {
    this.contentForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      type: ['VIDEO', Validators.required],
      contentUrl: ['', Validators.required],
      category: [''],
      allowedPlans: [[]],
      isFree: [false],
      isPublished: [true]
    });
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe((res: any) => {
      this.categories = res;
    });
  }

  /* ========= PLAN SELECT ========= */

  onPlanChange(event: any) {

    const plans = this.contentForm.value.allowedPlans;

    if (event.target.checked) {
      plans.push(event.target.value);
    } else {
      const index = plans.indexOf(event.target.value);
      if (index > -1) plans.splice(index, 1);
    }

    this.contentForm.patchValue({ allowedPlans: plans });
  }

  /* ========= THUMBNAIL ========= */

  onThumbnail(event: any) {
    this.thumbnailFile = event.target.files[0];
  }

  /* ========= SUBMIT ========= */

  onSubmit() {


    if (this.contentForm.invalid) {
      this.contentForm.markAllAsTouched();
      console.log("🚀 ~ AddcontentComponent ~ onSubmit ~ this.contentForm.invalid:", this.contentForm.invalid)

      return;
    }
      console.log("🚀 ~ AddcontentComponent ~ onSubmit ~ this.contentForm.valid")

    const formData = new FormData();

    Object.entries(this.contentForm.value).forEach(([key, value]) => {
      if (key !== 'allowedPlans') {
        formData.append(key, value as any);
      }
    });

    formData.append(
      'allowedPlans',
      JSON.stringify(this.contentForm.value.allowedPlans)
    );

    if (this.thumbnailFile) {
      formData.append('thumbnail', this.thumbnailFile);
    }

    this.contentService.createContent(formData).subscribe({
      next: () => {
        alert("Content Added Successfully");
        this.contentForm.reset();
        this.router.navigateByUrl('/medgyan/contentlist')
      },
      error: () => {
        alert("Error Adding Content");
      }
    });

  }

}
