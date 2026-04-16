import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stars',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center gap-0.5" [class.text-yellow-400]="color === 'yellow'" [class.text-emerald-500]="color === 'emerald'">
      @for (star of stars; track $index) {
        <i [class]="star" [ngClass]="sizeClass"></i>
      }
    </div>
  `,
  styles: [`
    :host { display: inline-block; }
  `]
})
export class StarsComponent implements OnChanges {
  @Input() rating: number = 0;
  @Input() color: 'yellow' | 'emerald' = 'yellow';
  @Input() size: 'xs' | 'sm' | 'md' | 'lg' = 'xs';

  stars: string[] = [];

  get sizeClass() {
    return {
      'text-[10px]': this.size === 'xs',
      'text-sm': this.size === 'sm',
      'text-base': this.size === 'md',
      'text-lg': this.size === 'lg'
    };
  }

  ngOnChanges(): void {
    this.calculateStars();
  }

  private calculateStars(): void {
    const stars: string[] = [];
    const rating = this.rating;

    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push('fas fa-star');
      } else if (rating >= i - 0.5) {
        stars.push('fas fa-star-half-alt');
      } else {
        stars.push('far fa-star text-gray-200 dark:text-slate-700');
      }
    }
    this.stars = stars;
  }
}
