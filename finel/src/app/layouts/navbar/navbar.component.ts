import { Component, computed, inject, PLATFORM_ID, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FlowbiteService } from '../../core/services/flowbite.service';
import { initFlowbite } from 'flowbite';
import { AuthService } from '../../core/auth/services/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { MyTranslateService } from '../../core/services/my-translate.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  host: { class: 'contents' }
})
export class NavbarComponent {
  private readonly authService = inject(AuthService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);
  readonly myTranslateService = inject(MyTranslateService);
  private readonly router = inject(Router);

  logged = computed(() => this.authService.isLogged());
  userName = computed(() => this.authService.userName());
  userEmail = computed(() => this.authService.userEmail());
  count = computed(() => this.cartService.cartCount());
  wishlistCount = computed(() => this.wishlistService.wishlistCount());
  isDarkMode = signal(false);

  constructor(private FlowbiteService: FlowbiteService) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (localStorage.getItem('freshToken')) {
        this.authService.isLogged.set(true);
        this.authService.decodeUserName();
        this.getCartCount();
        this.getWishlistCount();
      } else {
        this.cartService.cartCount.set(0);
        this.wishlistService.wishlistCount.set(0);
        this.wishlistService.wishlistItems.set([]);
      }

      const savedLang = localStorage.getItem('lang') ?? 'en';
      this.myTranslateService.currentLang.set(savedLang);

      const theme = localStorage.getItem('theme');
      if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        this.isDarkMode.set(true);
        document.documentElement.classList.add('dark');
      } else {
        this.isDarkMode.set(false);
        document.documentElement.classList.remove('dark');
      }
    }
    this.FlowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });
  }

  toggleDarkMode(): void {
    if (this.isDarkMode()) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      this.isDarkMode.set(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      this.isDarkMode.set(true);
    }
  }

  logOut(): void {
    this.authService.signOut();
  }

  getCartCount(): void {
    this.cartService.getCartData().subscribe({
      next: (res) => {
        const count =
          res?.numOfCartItems ??
          res?.data?.numOfCartItems ??
          res?.data?.products?.length ??
          res?.products?.length ??
          0;
        this.cartService.cartCount.set(count);
      },
      error: () => {
        this.cartService.cartCount.set(0);
      },
    });
  }

  getWishlistCount(): void {
    this.wishlistService.getLoggedUserWishlist().subscribe({
      next: (res) => {
        const items = res?.data || [];
        this.wishlistService.wishlistCount.set(items.length);
        this.wishlistService.wishlistItems.set(items.map((item: any) => item._id));
      },
      error: () => {
        this.wishlistService.wishlistCount.set(0);
        this.wishlistService.wishlistItems.set([]);
      },
    });
  }

  toggleMenu(): void {

  }

  onSearch(query: string): void {
    if (query.trim()) {
      this.router.navigate(['/search'], { queryParams: { q: query } });
    }
  }
}
