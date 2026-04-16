import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CategoriesService } from '../../../../../core/services/categories.service';
import { BannerComponent } from '../../../../../shared/ui/banner/banner.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-sub-categories',
  standalone: true,
  imports: [RouterLink, BannerComponent, TranslatePipe],
  templateUrl: './sub-categories.component.html',
  styleUrls: ['./sub-categories.component.css'],
})
export class SubCategoriesComponent implements OnInit {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _categoriesService = inject(CategoriesService);

  subCategories = signal<any[]>([]);
  categoryName = signal<string>('');

  ngOnInit(): void {
    this._activatedRoute.paramMap.subscribe({
      next: (params) => {
        let catId = params.get('id');
        if (catId) {
          this.loadSubCategories(catId);
          this.loadCategoryName(catId);
        }
      },
    });
  }

  loadCategoryName(id: string): void {
    this._categoriesService.getSpecificCategory(id).subscribe({
      next: (res) => {
        this.categoryName.set(res.data.name);
      }
    });
  }

  loadSubCategories(id: string): void {
    this._categoriesService.getSubCategories(id).subscribe({
      next: (res: any) => {
        this.subCategories.set(res.data);
      },
      error: (err) => {
        
      },
    });
  }
}
