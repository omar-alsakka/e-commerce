import { Component, computed, inject, Input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { Product } from '../../../core/models/product.interface';
import { StarsComponent } from '../stars/stars.component';

import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [RouterLink, StarsComponent, TranslatePipe],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent {
  @Input() product!: Product;

  currentImageIndex = signal(0);

  nextImage(event: MouseEvent): void {
    event.stopPropagation();
    if (this.product.images && this.product.images.length > 0) {
      this.currentImageIndex.update(index => (index + 1) % this.product.images.length);
    }
  }

  private readonly toastrService = inject(ToastrService);
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);

  addToCart(id: string): void {
    if (localStorage.getItem('freshToken')) {
      this.cartService.addProductToCart(id).subscribe({
        next: (res) => {
          const count =
            res?.numOfCartItem ?? res?.data?.numOfCartItem ?? res?.numOfCartItems ?? res?.data?.numOfCartItems ?? 0;
          this.cartService.cartCount.set(count);

          this.toastrService.success(res?.message || 'Added to cart', 'FreshCart', {
            progressBar: true,
            closeButton: true,
          });
        },
        error: (err) => {
          
          this.toastrService.error('Failed to add product to cart', 'FreshCart', {
            progressBar: true,
            closeButton: true,
          });
        },
      });
    } else {
      this.toastrService.warning('login First', 'FreshCart', {
        progressBar: true,
        closeButton: true,
      });
    }
  }

  isInWishlist = computed(() => this.wishlistService.wishlistItems().includes(this.product._id));

  toggleWishlist(): void {
    if (localStorage.getItem('freshToken')) {
      if (this.isInWishlist()) {
        this.wishlistService.removeProductFromWishlist(this.product._id).subscribe({
          next: (res) => {
            if (res?.data && Array.isArray(res.data)) {
              this.wishlistService.wishlistItems.set(res.data);
              this.wishlistService.wishlistCount.set(res.data.length);
            }
            this.toastrService.success(res?.message || 'Removed from wishlist', 'FreshCart', {
              progressBar: true,
              closeButton: true,
            });
          },
          error: (err) => {
            
            this.toastrService.error('Failed to remove product from wishlist', 'FreshCart', {
              progressBar: true,
              closeButton: true,
            });
          },
        });
      } else {
        this.wishlistService.addProductToWishlist(this.product._id).subscribe({
          next: (res) => {
            if (res?.data && Array.isArray(res.data)) {
              this.wishlistService.wishlistItems.set(res.data);
              this.wishlistService.wishlistCount.set(res.data.length);
            }
            this.toastrService.success(res?.message || 'Added to wishlist', 'FreshCart', {
              progressBar: true,
              closeButton: true,
            });
          },
          error: (err) => {
            
            this.toastrService.error('Failed to add product to wishlist', 'FreshCart', {
              progressBar: true,
              closeButton: true,
            });
          },
        });
      }
    } else {
      this.toastrService.warning('login First', 'FreshCart', {
        progressBar: true,
        closeButton: true,
      });
    }
  }

  getDiscountPercent(): number {
    if (!this.product.price || !this.product.priceAfterDiscount) {
      return 0;
    }
    const discount =
      ((this.product.price - this.product.priceAfterDiscount) / this.product.price) * 100;
    return Math.round(discount);
  }
}
