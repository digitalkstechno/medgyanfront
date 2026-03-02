import { Component, OnInit } from '@angular/core';
import { SHARED_IMPORTS } from '../../../constant/shared_imports';
import { ContentService } from '../service/content.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-contentlist',
  standalone: true,
  imports: [SHARED_IMPORTS],
  templateUrl: './contentlist.component.html',
  styleUrl: './contentlist.component.css'
})
export class ContentlistComponent implements OnInit {

  contents: any[] = [];
  paginatedContents: any[] = [];

  selectedVideo!: SafeResourceUrl | null;

  // ✅ pagination
  currentPage = 1;
  pageSize = 10; // cards per page
  totalPages = 0;
  pages: number[] = [];

  constructor(
    private contentService: ContentService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(){
    this.loadContent();
  }

  loadContent(){
    this.contentService.getAllContent().subscribe((res:any)=>{
      this.contents = res.contents || [];
      this.setupPagination();
    });
  }

  /* ================= PAGINATION ================= */

  setupPagination(){
    this.totalPages = Math.ceil(this.contents.length / this.pageSize);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.updatePageData();
  }

  updatePageData(){
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedContents = this.contents.slice(start, end);
  }

  goToPage(page:number){
    this.currentPage = page;
    this.updatePageData();
  }

  nextPage(){
    if(this.currentPage < this.totalPages){
      this.currentPage++;
      this.updatePageData();
    }
  }

  prevPage(){
    if(this.currentPage > 1){
      this.currentPage--;
      this.updatePageData();
    }
  }

  /* ================= PLAY VIDEO ================= */

  playVideo(url: string){

    if(!url) return;

    let videoId = '';

    if(url.includes('youtu.be')){
      videoId = url.split('/').pop()?.split('?')[0] || '';
    }
    else if(url.includes('watch?v=')){
      videoId = url.split('watch?v=')[1].split('&')[0];
    }

    const embedUrl = `https://www.youtube.com/embed/${videoId}`;

    this.selectedVideo =
      this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  closeVideo(){
    this.selectedVideo = null;
  }
}
