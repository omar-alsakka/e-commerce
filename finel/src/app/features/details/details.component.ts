import { Component, inject, OnInit, signal, CUSTOM_ELEMENTS_SCHEMA, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { register } from 'swiper/element/bundle';

import { ProductsService } from '../../core/services/products.service';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { Product } from '../../core/models/product.interface';
import { StarsComponent } from '../../shared/ui/stars/stars.component';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, RouterLink, StarsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent implements OnInit {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _productsService = inject(ProductsService);
  private readonly _cartService = inject(CartService);
  private readonly _wishlistService = inject(WishlistService);
  private readonly _toastrService = inject(ToastrService);

  productDetails = signal<Product | null>(null);
  relatedProducts = signal<Product[]>([]);
  quantity = signal<number>(1);
  activeImage = signal<string>('');
  activeTab = signal<'details' | 'reviews' | 'shipping'>('details');

  ngOnInit(): void {
    register();
    this._activatedRoute.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.getProductDetails(id);
      }
    });
  }

  getProductDetails(id: string): void {
    this._productsService.getSpecificProduct(id).subscribe({
      next: (res) => {
        this.productDetails.set(res.data);
        this.activeImage.set(res.data.imageCover);
        this.getRelatedProducts(res.data.category._id);
      },
      error: (err) => {
        
      },
    });
  }

  getRelatedProducts(categoryId: string): void {
    this._productsService.getAllProducts(1, `category[in]=${categoryId}`).subscribe({
      next: (res) => {
        this.relatedProducts.set(res.data.filter((p: Product) => p.id !== this.productDetails()?.id));
      },
    });
  }

  changeActiveImage(img: string): void {
    this.activeImage.set(img);
  }

  goToCheckout(): void {
    this._router.navigate(['/checkout']);
  }

  increaseQty(): void {
    this.quantity.update((q) => q + 1);
  }

  decreaseQty(): void {
    if (this.quantity() > 1) {
      this.quantity.update((q) => q - 1);
    }
  }

  isLoading = signal<boolean>(false);

  addToCart(id: string, count?: number): void {
    if (!localStorage.getItem('freshToken')) {
      this._toastrService.warning('Please login first', 'FreshCart');
      return;
    }

    this.isLoading.set(true);
    const qty = count ?? this.quantity();

    this._cartService.addProductToCart(id).subscribe({
      next: (res) => {
        if (qty > 1) {
          this._cartService.updateCartCount(id, qty).subscribe({
            next: (updateRes) => {
              this._toastrService.success(`Added to cart with quantity: ${qty}`, 'Success');
              this._cartService.cartCount.set(updateRes.numOfCartItems);
              this.isLoading.set(false);
            },
            error: () => {
              this._toastrService.error('Failed to update quantity', 'Error');
              this.isLoading.set(false);
            }
          });
        } else {
          this._toastrService.success(res.message, 'Success');
          this._cartService.cartCount.set(res.numOfCartItems);
          this.isLoading.set(false);
        }
      },
      error: () => {
        this._toastrService.error('Failed to add product to cart', 'Error');
        this.isLoading.set(false);
      }
    });
  }

  addToWishlist(id: string): void {
    this._wishlistService.addProductToWishlist(id).subscribe({
      next: (res) => {
        this._toastrService.success(res.message, 'Success');
        this._wishlistService.wishlistCount.set(res.data.length);
      },
    });
  }

  getRatingPercentage(stars: number): number {
    const avg = this.productDetails()?.ratingsAverage || 0;
    const diff = Math.abs(avg - stars);
    if (diff < 0.5) return 60;
    if (diff < 1.5) return 25;
    if (diff < 2.5) return 10;
    return 5;
  }
}
