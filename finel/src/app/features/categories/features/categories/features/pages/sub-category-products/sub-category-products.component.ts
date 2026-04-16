import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../../../../../../core/services/products.service';
import { CartService } from '../../../../../../../core/services/cart.service';
import { WishlistService } from '../../../../../../../core/services/wishlist.service';
import { ToastrService } from 'ngx-toastr';

import { BannerComponent } from '../../../../../../../shared/ui/banner/banner.component';
import { TranslatePipe } from '@ngx-translate/core';
import { LowerCasePipe } from '@angular/common';
import { CardComponent } from '../../../../../../../shared/ui/card/card.component';

@Component({
  selector: 'app-sub-category-products',
  standalone: true,
  imports: [BannerComponent, TranslatePipe, LowerCasePipe, CardComponent],
  templateUrl: './sub-category-products.component.html',
})
export class SubCategoryProductsComponent implements OnInit {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _productsService = inject(ProductsService);
  private readonly _cartService = inject(CartService);
  private readonly _wishlistService = inject(WishlistService);
  private readonly _toastrService = inject(ToastrService);

  subCategoryId = signal<string | null>(null);
  subCategoryName = signal<string>('');
  productList = signal<any[]>([]);

  ngOnInit(): void {
    this._activatedRoute.paramMap.subscribe({
      next: (params) => {
        this.subCategoryId.set(params.get('id'));
        this.getProducts();
      },
    });
  }

  getProducts(): void {
    const id = this.subCategoryId();
    if (id) {
      this._productsService.getAllProducts(1, `subcategory=${id}`).subscribe({
        next: (res: any) => {
          this.productList.set(res.data);
          if (res.data.length > 0) {
            this.subCategoryName.set(res.data[0].subcategory[0].name);
          }
        },
      });
    }
  }

  addToCart(productId: string): void {
    if (!localStorage.getItem('freshToken')) {
      this._toastrService.warning('Please login first to add items to cart.', 'FreshCart', {
        progressBar: true,
        closeButton: true,
      });
      return;
    }

    this._cartService.addProductToCart(productId).subscribe({
      next: (res: any) => {
        const count =
          res?.numOfCartItem ??
          res?.data?.numOfCartItem ??
          res?.numOfCartItems ??
          res?.data?.numOfCartItems ??
          0;
        this._cartService.cartCount.set(count);
        this._toastrService.success(res?.message || 'Added to cart', 'FreshCart', {
          progressBar: true,
          closeButton: true,
        });
      },
      error: () => {
        this._toastrService.error('Failed to add product to cart', 'FreshCart', {
          progressBar: true,
          closeButton: true,
        });
      },
    });
  }

  isInWishlist = (productId: string) => this._wishlistService.wishlistItems().includes(productId);

  toggleWishlist(productId: string): void {
    if (!localStorage.getItem('freshToken')) {
      this._toastrService.warning('Please login first.', 'FreshCart', {
        progressBar: true,
        closeButton: true,
      });
      return;
    }

    if (this.isInWishlist(productId)) {
      this._wishlistService.removeProductFromWishlist(productId).subscribe({
        next: (res: any) => {
          if (res?.data && Array.isArray(res.data)) {
            this._wishlistService.wishlistItems.set(res.data);
            this._wishlistService.wishlistCount.set(res.data.length);
          }
          this._toastrService.success(res?.message || 'Removed from wishlist', 'FreshCart', {
            progressBar: true,
            closeButton: true,
          });
        },
        error: () => {
          this._toastrService.error('Failed to remove from wishlist', 'FreshCart', {
            progressBar: true,
            closeButton: true,
          });
        },
      });
    } else {
      this._wishlistService.addProductToWishlist(productId).subscribe({
        next: (res: any) => {
          if (res?.data && Array.isArray(res.data)) {
            this._wishlistService.wishlistItems.set(res.data);
            this._wishlistService.wishlistCount.set(res.data.length);
          }
          this._toastrService.success(res?.message || 'Added to wishlist', 'FreshCart', {
            progressBar: true,
            closeButton: true,
          });
        },
        error: () => {
          this._toastrService.error('Failed to add to wishlist', 'FreshCart', {
            progressBar: true,
            closeButton: true,
          });
        },
      });
    }
  }

  getDiscountPercent(product: any): number {
    if (!product?.price || !product?.priceAfterDiscount) {
      return 20;
    }
    const discount = ((product.price - product.priceAfterDiscount) / product.price) * 100;
    return Math.round(discount);
  }
}
