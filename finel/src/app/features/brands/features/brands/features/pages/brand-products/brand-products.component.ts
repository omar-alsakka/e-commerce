import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FlowbiteService } from '../../../../../../../core/services/flowbite.service';
import { initFlowbite } from 'flowbite';
import { ProductsService } from '../../../../../../../core/services/products.service';
import { Product } from '../../../../../../../core/models/product.interface';
import { CardComponent } from '../../../../../../../shared/ui/card/card.component';
import { BannerComponent } from '../../../../../../../shared/ui/banner/banner.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-brand-products',
  standalone: true,
  imports: [CardComponent, BannerComponent, TranslatePipe],
  templateUrl: './brand-products.component.html',
})
export class BrandProductsComponent implements OnInit {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _productsService = inject(ProductsService);
  private readonly _flowbiteService = inject(FlowbiteService);

  brandId = signal<string | null>(null);
  brandName = signal<string>('');
  productList = signal<Product[]>([]);
  currentSort = signal<string>('');

  ngOnInit(): void {
    this._activatedRoute.paramMap.subscribe({
      next: (params) => {
        this.brandId.set(params.get('id'));
        this.getProductsByBrand(this.currentSort());
      }
    });

    this._flowbiteService.loadFlowbite(() => {
      initFlowbite();
    });
  }

  getProductsByBrand(sort: string = ''): void {
    const id = this.brandId();
    if (id) {
      this._productsService.getAllProducts(1, `brand=${id}${sort ? '&sort=' + sort : ''}`).subscribe({
        next: (res: any) => {
          this.productList.set(res.data);
          if (res.data.length > 0) {
            this.brandName.set(res.data[0].brand.name);
          }
        }
      });
    }
  }

  changeSort(sort: string): void {
    this.currentSort.set(sort);
    this.getProductsByBrand(sort);
  }
}
