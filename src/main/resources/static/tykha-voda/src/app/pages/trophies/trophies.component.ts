import { Component } from '@angular/core';

@Component({
  selector: 'app-trophies',
  templateUrl: './trophies.component.html',
  styleUrls: ['./trophies.component.css']
})
export class TrophiesComponent {
  k = 1;
  formats = ["png", "jpg", "jpeg", "webp"];
  visiblePhotos: string[] = []; 

  loadMore() {
    for (let i = this.k; i < this.k + 4; i++) {
      this.tryLoadImage(i, 0);
    }
    this.k += 4;
  }

  tryLoadImage(index: number, formatIndex: number) {
    if (formatIndex >= this.formats.length) {
      return;
    }

    const format = this.formats[formatIndex];
    const url = `assets/photos/gallery/fishph${index}.${format}`;

    const img = new Image();
    img.src = url;

    img.onload = () => {

      this.visiblePhotos.push(url);
    };

    img.onerror = () => {

      this.tryLoadImage(index, formatIndex + 1);
    };
  }
}