import { Component, OnInit } from '@angular/core';
import { SHARED_IMPORTS } from '../../../constant/shared_imports';
import { ContentService } from '../service/content.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contentlist',
  standalone: true,
  imports: [SHARED_IMPORTS],
  templateUrl: './contentlist.component.html',
  styleUrl: './contentlist.component.css',
})
export class ContentlistComponent implements OnInit {

  contents: any[] = [];
  filteredContents: any[] = [];
  paginatedContents: any[] = [];

  searchControl = new FormControl('');
  searchTerm = '';

  selectedVideo: SafeResourceUrl | null = null;

  selectedPlan: string = 'ALL';

  currentPage = 1;
  pageSize = 10;
  totalPages = 0;
  pages: number[] = [];

  constructor(
    private contentService: ContentService,
    private sanitizer: DomSanitizer,
    private router : Router,
  ) {}

  ngOnInit() {
    this.searchfunction();
    this.loadContent();
  }

  /* ================= SEARCH ================= */

  searchfunction() {
    this.searchControl.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value) => {
        this.searchTerm = (value || '').toString().trim();
        this.currentPage = 1;
        this.loadContent();
      });
  }

  /* ================= LOAD ================= */

  loadContent() {
    const filters: any = {};

    if (this.searchTerm) {
      filters.title = this.searchTerm;
    }

    this.contentService.getAllContent(filters).subscribe((res: any) => {
      this.contents = res.contents || [];
      this.applyFilters();
    });
  }

  /* ================= FILTER ================= */

  filterByPlan(plan: string) {
    this.selectedPlan = plan;
    this.currentPage = 1;
    this.applyFilters();
  }

  applyFilters() {
    let data = [...this.contents];

    if (this.selectedPlan !== 'ALL') {
      data = data.filter((item: any) =>
        item.allowedPlans?.includes(this.selectedPlan)
      );
    }

    this.filteredContents = data;
    this.setupPagination();
  }

  /* ================= PAGINATION ================= */

  setupPagination() {
    this.totalPages = Math.ceil(
      this.filteredContents.length / this.pageSize
    );

    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.updatePageData();
  }

  updatePageData() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedContents = this.filteredContents.slice(start, end);
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updatePageData();
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePageData();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePageData();
    }
  }

  /* ================= PLAY VIDEO (YOUTUBE + VIMEO) ================= */

  // playVideo(url: string) {
  //   if (!url) return;

  //   let embedUrl = '';

  //   // ===== YOUTUBE =====
  //   if (url.includes('youtube.com') || url.includes('youtu.be')) {
  //     let videoId = '';

  //     if (url.includes('youtu.be')) {
  //       videoId = url.split('/').pop()?.split('?')[0] || '';
  //     } else if (url.includes('watch?v=')) {
  //       videoId = url.split('watch?v=')[1].split('&')[0];
  //     }

  //     embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  //   }

  //   // ===== VIMEO =====
  //   if (url.includes('vimeo.com')) {
  //     const match = url.match(/vimeo\.com\/(?:.*\/)?(\d+)/);
  //     const videoId = match ? match[1] : '';
  //     embedUrl = `https://player.vimeo.com/video/${videoId}?autoplay=1`;
  //   }

  //   this.selectedVideo =
  //     this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  // }

  playVideo(url: string) {
    if (!url) return;

    let embedUrl = '';

    // ===== 1️⃣ VIMEO FIRST (PRIORITY) =====
    if (url.includes('vimeo.com')) {
      const match = url.match(/vimeo\.com\/(?:.*\/)?(\d+)/);
      const videoId = match ? match[1] : '';

      embedUrl = `https://player.vimeo.com/video/${videoId}?autoplay=1`;
    }

    // ===== 2️⃣ YOUTUBE =====
    else if (url.includes('youtube.com') || url.includes('youtu.be')) {
      let videoId = '';

      if (url.includes('youtu.be')) {
        videoId = url.split('/').pop()?.split('?')[0] || '';
      } else if (url.includes('watch?v=')) {
        videoId = url.split('watch?v=')[1].split('&')[0];
      }

      embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }

    this.selectedVideo =
      this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  closeVideo() {
    this.selectedVideo = null;
  }

  onEdit(item: any) {
    // here later you can open a modal / navigate to edit screen with item data
    console.log('Edit content', item._id);
    this.router.navigate(['/medgyan/content', item._id])

  }

  onDelete(item: any) {
    if (!confirm(`Are you sure you want to delete "${item.title}"?`)) {
      return;
    }

    this.contentService.deleteContent(item._id).subscribe({
      next: () => {
        this.contents = this.contents.filter(c => c._id !== item._id);
        this.applyFilters();
      },
      error: (err) => {
        console.error('Delete error', err);
      }
    });
  }
}
