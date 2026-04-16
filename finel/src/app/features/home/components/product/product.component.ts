import { Component, inject, OnInit, signal } from '@angular/core';
import { ProductsService } from '../../../../core/services/products.service';
import { Product } from '../../../../core/models/product.interface';
import { CardComponent } from '../../../../shared/ui/card/card.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-product',
  imports: [CardComponent, TranslateModule],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  private readonly productsService = inject(ProductsService);

  productList = signal<Product[]>([]);

  ngOnInit(): void {
    this.getProductsData();
  }

  getProductsData(): void {
    this.productsService.getAllProducts().subscribe({
      next: (res) => {
        this.productList.set(res.data);
      },
      error: (err) => {
      },
    });
  }
}
