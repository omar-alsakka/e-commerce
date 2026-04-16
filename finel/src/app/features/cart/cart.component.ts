import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { RouterLink } from "@angular/router";
import { Cart } from './models/cart.interface';
import { isPlatformBrowser } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-cart',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit{
  private readonly cartService = inject(CartService);
  private readonly pLATFORM_ID = inject(PLATFORM_ID);

  private readonly emptyCart: Cart = {
    _id: '',
    cartOwner: '',
    products: [],
    createdAt: '',
    updatedAt: '',
    __v: 0,
    totalCartPrice: 0,
  };

  cartDetails = signal<Cart>(this.emptyCart);

  ngOnInit(): void {
    if (isPlatformBrowser(this.pLATFORM_ID)) {
      this.getCartData();
    }
  }

  getCartData(): void {
    this.cartService.getLoggedUserCart().subscribe({
      next: (res) => {
        this.cartDetails.set(res?.data ?? this.emptyCart);
      },
      error: () => {
        this.cartDetails.set(this.emptyCart);
      },
    });
  }

  removeItem(id:string):void{
    this.cartService.removeProductItem(id).subscribe({
      next:(res) =>{
        this.cartService.cartCount.set(res.numOfCartItems)
        this.cartDetails.set(res?.data ?? this.emptyCart);
      },
      error: () => {
        this.cartDetails.set(this.emptyCart);
      },
    });
  }

  update(id:string, count:number):void{
    this.cartService.updateCartCount(id, count).subscribe({
      next:(res) =>{
        this.cartDetails.set(res?.data ?? this.emptyCart);
      },
      error: () => {
        this.cartDetails.set(this.emptyCart);
      }
    });
  }

  clearItem():void{
    this.cartService.clearCart().subscribe({
      next:(res) =>{
        this.cartDetails.set(res?.data ?? this.emptyCart);
      },
      error: () => {
        this.cartDetails.set(this.emptyCart);
      }
    });
  }
}
