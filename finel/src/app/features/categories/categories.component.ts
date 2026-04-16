import { Component, inject, OnInit, signal } from '@angular/core';
import { CategoriesService } from '../../core/services/categories.service';
import { RouterLink } from '@angular/router';
import { BannerComponent } from '../../shared/ui/banner/banner.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [RouterLink, BannerComponent, TranslatePipe],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent implements OnInit {
  private readonly categoriesService = inject(CategoriesService);

  categoryList = signal<any[]>([]);
  subCategoryList = signal<any[]>([]);
  selectedCategoryName = signal<string>('');

  ngOnInit(): void {
    this.categoriesService.getCategories().subscribe({
      next: (res) => {
        this.categoryList.set(res.data);
      }
    });
  }

  showSubCategories(id: string, name: string): void {
    this.selectedCategoryName.set(name);
    this.categoriesService.getSubCategories(id).subscribe({
      next: (res) => {
        this.subCategoryList.set(res.data);
      }
    });
  }
}
