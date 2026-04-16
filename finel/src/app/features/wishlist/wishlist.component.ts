import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { WishlistService } from '../../core/services/wishlist.service';
import { CartService } from '../../core/services/cart.service';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-wishlist',
  imports: [RouterLink],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css',
})
export class WishlistComponent implements OnInit {
  private readonly wishlistService = inject(WishlistService);
  private readonly cartService = inject(CartService);

  wishlistItems: WritableSignal<any[]> = signal([]);

  ngOnInit(): void {
    this.getWishlistItems();
  }

  getWishlistItems() {
    this.wishlistService.getLoggedUserWishlist().subscribe({
      next: (res) => {
        this.wishlistItems.set(res.data);
        this.wishlistService.wishlistCount.set(res.count || res.data.length);
      },
      error: (err) => {
        
      }
    });
  }

  removeItem(id: string) {
    this.wishlistService.removeProductFromWishlist(id).subscribe({
      next: (res) => {
        this.getWishlistItems();
      },
      error: (err) => {
        
      }
    });
  }

  addToCart(id: string) {
    this.cartService.addProductToCart(id).subscribe({
      next: (res) => {
        this.cartService.cartCount.set(res.numOfCartItems);
      },
      error: (err) => {
        
      }
    });
  }
}
