import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, TranslatePipe],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);

  flag = signal<string>('');

  cartId = signal<string>('');
  submitted = signal<boolean>(false);

  changeFlag(el: HTMLInputElement): void {
    this.flag.set(el.value);
  }

  get city() {
    return this.checkOut.get('shippingAddress.city');
  }

  get address() {
    return this.checkOut.get('shippingAddress.address');
  }

  get phone() {
    return this.checkOut.get('shippingAddress.phone');
  }

  get details() {
    return this.checkOut.get('shippingAddress.details');
  }

  submitForm(): void {
    this.submitted.set(true);
    if (this.checkOut.valid) {
      if (this.flag() === 'cash') {
      } else {
      }
    }
  }

  checkOut: FormGroup = this.fb.group({
    shippingAddress: this.fb.group({
      details: ['', [Validators.required]],
      address: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      city: ['', [Validators.required]],
    }),
  });

  ngOnInit(): void {
    this.getCartId();
  }

  getCartId(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.cartId.set(params.get('id')!);
    });
  }
}
