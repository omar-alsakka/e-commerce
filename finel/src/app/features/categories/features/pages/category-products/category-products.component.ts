import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FlowbiteService } from '../../../../../core/services/flowbite.service';
import { initFlowbite } from 'flowbite';
import { CategoriesService } from '../../../../../core/services/categories.service';
import { CartService } from '../../../../../core/services/cart.service';
import { WishlistService } from '../../../../../core/services/wishlist.service';
import { ToastrService } from 'ngx-toastr';
import { BannerComponent } from '../../../../../shared/ui/banner/banner.component';
import { CardComponent } from '../../../../../shared/ui/card/card.component';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-category-products',
  standalone: true,
  imports: [RouterLink, BannerComponent, CardComponent, CommonModule, TranslatePipe],
  templateUrl: './category-products.component.html',
})
export class CategoryProductsComponent implements OnInit {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _categoriesService = inject(CategoriesService);
  private readonly _cartService = inject(CartService);
  private readonly _wishlistService = inject(WishlistService);
  private readonly _toastrService = inject(ToastrService);
  private readonly _flowbiteService = inject(FlowbiteService);

  categoryId = signal<string | null>(null);
  categoryName = signal<string>('');
  productList = signal<any[]>([]);
  currentSort = signal<string>('');

  ngOnInit(): void {
    this._activatedRoute.paramMap.subscribe({
      next: (params) => {
        const id = params.get('id');
        if (id) {
          this.categoryId.set(id);
          this.loadCategoryProducts(id, this.currentSort());
          this.loadCategoryName(id);
        }
      },
    });

    this._flowbiteService.loadFlowbite(() => {
      initFlowbite();
    });
  }

  loadCategoryProducts(id: string, sort: string = ''): void {
    this._categoriesService.getSpecificSubCategory(id, sort).subscribe({
      next: (res: any) => {
        this.productList.set(res.data || []);
      },
      error: (err) => {
        
        this.productList.set([]);
      },
    });
  }

  changeSort(sort: string): void {
    this.currentSort.set(sort);
    const id = this.categoryId();
    if (id) {
      this.loadCategoryProducts(id, sort);
    }
  }

  loadCategoryName(id: string): void {
    this._categoriesService.getSpecificCategory(id).subscribe({
      next: (res: any) => {
        if (res.data) {
          this.categoryName.set(res.data.name);
        }
      },
      error: (err) => {
        
        this.categoryName.set('Products');
      }
    });
  }

  getDiscountPercent(product: any): number {
    if (!product?.price || !product?.priceAfterDiscount) {
      return 20;
    }
    const discount = ((product.price - product.priceAfterDiscount) / product.price) * 100;
    return Math.round(discount);
  }
}
