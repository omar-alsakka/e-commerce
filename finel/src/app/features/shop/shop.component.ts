import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ProductsService } from '../../core/services/products.service';
import { Product } from '../../core/models/product.interface';
import { CardComponent } from '../../shared/ui/card/card.component';
import { BannerComponent } from '../../shared/ui/banner/banner.component';
import { FlowbiteService } from '../../core/services/flowbite.service';
import { initFlowbite } from 'flowbite';
import { TranslatePipe } from '@ngx-translate/core';
import { LowerCasePipe } from '@angular/common';

@Component({
  selector: 'app-shop',
  imports: [CardComponent, BannerComponent, TranslatePipe, LowerCasePipe],
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css'],
})
export class ShopComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly _flowbiteService = inject(FlowbiteService);

  productList = signal<Product[]>([]);
  pageSize = signal<number>(1);
  cp = signal<number>(1);
  total = signal<number>(0);
  currentSort = signal<string>('');

  pages = computed(() => {
    const size = this.pageSize();
    const totalItems = this.total();
    if (size <= 0 || totalItems <= 0) {
      return [1];
    }
    const count = Math.max(1, Math.ceil(totalItems / size));
    return Array.from({ length: count }, (_, i) => i + 1);
  });

  ngOnInit(): void {
    this.getProductsData(1);
    
    this._flowbiteService.loadFlowbite(() => {
      initFlowbite();
    });
  }

  getProductsData(page: number): void {
    const sort = this.currentSort();
    const query = sort ? `sort=${sort}` : '';
    this.productsService.getAllProducts(page, query).subscribe({
      next: (res) => {
        this.productList.set(res.data);
        this.pageSize.set(res.metadata?.limit ?? this.pageSize());
        this.cp.set(res.metadata?.currentPage ?? page);
        this.total.set(res.results ?? this.total());
      },
      error: (err) => {
        
      },
    });
  }

  goToPage(page: number): void {
    if (page === this.cp()) {
      return;
    }
    this.getProductsData(page);
  }

  prevPage(): void {
    if (this.cp() > 1) {
      this.goToPage(this.cp() - 1);
    }
  }

  nextPage(): void {
    const lastPage = this.pages().length;
    if (this.cp() < lastPage) {
      this.goToPage(this.cp() + 1);
    }
  }

  changeSort(sort: string): void {
    this.currentSort.set(sort);
    this.getProductsData(1);
  }
}
