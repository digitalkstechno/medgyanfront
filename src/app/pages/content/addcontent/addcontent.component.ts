import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SHARED_IMPORTS } from '../../../constant/shared_imports';
import { ContentService } from '../service/content.service';
import { CategoryService } from '../../category/service/category.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-addcontent',
  standalone: true,
  imports: [CommonModule, ...SHARED_IMPORTS],
  templateUrl: './addcontent.component.html',
  styleUrl: './addcontent.component.css',
})
export class AddcontentComponent implements OnInit {
  contentForm!: FormGroup;
  categories: any[] = [];
  thumbnailFile: File | null = null;

  plans = ['TRIAL', 'PREMIUM'];
  // plans = ['TRIAL', 'BASIC', 'PRO', 'PREMIUM'];

  isEditMode = false;
  contentId: string | null = null;
  existingThumbnail: string | null = null;

  constructor(
    private fb: FormBuilder,
    private contentService: ContentService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.initForm();

    this.contentForm.get('contentUrl')?.valueChanges.subscribe((url) => {
      const id = this.extractVimeoId(url);
      this.contentForm.patchValue({
        contentId: id,
      });
    });

    this.loadCategories();
    this.checkEditMode();
  }

  /* ================= FORM INIT ================= */

  initForm() {
    this.contentForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      type: ['VIDEO', Validators.required],
      contentUrl: ['', Validators.required],
      contentId: ['', Validators.required],
      category: [''],
      allowedPlans: [[], [this.atLeastOnePlanValidator]],
      thumbnail: [null, Validators.required], // ✅ Now thumbnail part of form
      isFree: [false],
      isPublished: [true],
    });
  }

  /* ================= CUSTOM VALIDATOR ================= */

  atLeastOnePlanValidator(control: AbstractControl) {
    if (!control.value || control.value.length === 0) {
      return { required: true };
    }
    return null;
  }

  /* ================= LOAD CATEGORY ================= */

  loadCategories() {
    this.categoryService.getCategories().subscribe((res: any) => {
      this.categories = res;
    });
  }

  /* ================= EDIT MODE CHECK ================= */

  checkEditMode() {
    this.contentId = this.route.snapshot.paramMap.get('id');
    if (this.contentId) {
      this.isEditMode = true;
      this.loadContentById(this.contentId);
      // in edit mode thumbnail not strictly required if already exists
      this.contentForm.get('thumbnail')?.clearValidators();
      this.contentForm.get('thumbnail')?.updateValueAndValidity();
    }
  }

  loadContentById(id: string) {
    this.contentService.getContentById(id).subscribe((res: any) => {
      const data = res.content || res; // depends on your API structure

      this.existingThumbnail = data.thumbnail || null;

      this.contentForm.patchValue({
        title: data.title,
        description: data.description,
        type: data.type || 'VIDEO',
        contentUrl: data.contentUrl,
        contentId: data.contentId || this.extractVimeoId(data.contentUrl),
        category: data.category || '',
        allowedPlans: data.allowedPlans || [],
        isFree: data.isFree ?? false,
        isPublished: data.isPublished ?? true,
      });
    });
  }

  /* ================= PLAN CHANGE ================= */

  onPlanChange(event: any) {
    const control = this.contentForm.get('allowedPlans');
    let plans = [...(control?.value || [])];

    if (event.target.checked) {
      if (!plans.includes(event.target.value)) {
        plans.push(event.target.value);
      }
    } else {
      plans = plans.filter((p: string) => p !== event.target.value);
    }

    control?.setValue(plans);
    control?.markAsTouched();
    control?.updateValueAndValidity();
  }

  /* ================= THUMBNAIL ================= */

  onThumbnail(event: any) {
    const file = event.target.files[0];

    if (file) {
      this.thumbnailFile = file;
      this.contentForm.patchValue({ thumbnail: file });
      this.contentForm.get('thumbnail')?.updateValueAndValidity();
    }
  }

  /* =================  Extract VimeoId ================= */

  extractVimeoId(url: string): string {
    if (!url) return '';

    const match = url.match(/vimeo\.com\/(?:.*\/)?(\d+)/);
    return match ? match[1] : '';
  }

  /* ================= SUBMIT ================= */

  onSubmit() {
     console.log("i am here ")
    if (this.contentForm.invalid) {
      this.contentForm.markAllAsTouched();
      console.log('Form Invalid:', this.contentForm.errors);
      return;
    }
   console.log("i am here ")
    const formData = new FormData();

    Object.entries(this.contentForm.value).forEach(([key, value]) => {
      if (key !== 'thumbnail' && key !== 'allowedPlans') {
        formData.append(key, value as any);
      }
    });

    formData.append(
      'allowedPlans',
      JSON.stringify(this.contentForm.value.allowedPlans),
    );

    if (this.thumbnailFile) {
      formData.append('thumbnail', this.thumbnailFile);
    }

    if (!this.isEditMode) {
      this.contentService.createContent(formData).subscribe({
        next: () => {
          alert('Content Added Successfully');
          this.contentForm.reset();
          this.router.navigateByUrl('/medgyan/contentlist');
        },
        error: (err) => {
          console.error(err);
          alert('Error Adding Content');
        },
      });
    } else if (this.contentId) {
      this.contentService.updateContent(this.contentId, formData).subscribe({
        next: () => {
          alert('Content Updated Successfully');
          this.router.navigateByUrl('/medgyan/contentlist');
        },
        error: (err) => {
          console.error(err);
          alert('Error Updating Content');
        },
      });
    }
  }
}
