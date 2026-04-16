import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent {
  constructor(private router: Router) {}
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() breadcrumb: string = '';
  @Input() icon: string = 'products';
  @Input() theme: 'green' | 'purple' = 'green';

  get breadcrumbItems() {
    return this.breadcrumb.split(' / ').map(item => item.trim());
  }

  navigateTo(item: string) {
    const route = item.toLowerCase();
    if (route === 'home' || route === 'الرئيسية') {
      this.router.navigate(['/home']);
    } else if (route === 'categories' || route === 'الفئات') {
      this.router.navigate(['/categories']);
    } else if (route === 'brands' || route === 'العلامات التجارية' || route === 'الماركات') {
      this.router.navigate(['/brands']);
    }
  }
}
