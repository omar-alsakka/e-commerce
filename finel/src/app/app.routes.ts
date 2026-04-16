import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guards/auth-guard';

export const routes: Routes = [
  {
    path: 'settings',
    title: 'FreshCart',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/settings/settings.component').then((m) => m.SettingsComponent),
  },
  {
    path: '',
    title: 'FreshCart',
    loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'home',
    title: 'FreshCart',
    loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'shop',
    title: 'FreshCart',
    loadComponent: () => import('./features/shop/shop.component').then((m) => m.ShopComponent),
  },
  {
    path: 'search',
    title: 'FreshCart',
    loadComponent: () => import('./features/search/search.component').then((m) => m.SearchComponent),
  },
  {
    path: 'subcategory/:id',
    loadComponent: () =>
      import('./features/categories/features/pages/sub-categories/sub-categories.component').then(
        (m) => m.SubCategoriesComponent,
      ),
    title: 'FreshCart',
  },
  {
    path: 'brands',
    title: 'FreshCart',
    loadComponent: () =>
      import('./features/brands/brands.component').then((m) => m.BrandsComponent),
  },
  {
    path: 'brand-products/:id',
    loadComponent: () =>
      import('./features/brands/features/brands/features/pages/brand-products/brand-products.component').then(
        (m) => m.BrandProductsComponent,
      ),
    title: 'FreshCart',
  },
  {
    path: 'sub-category-products/:id',
    loadComponent: () =>
      import('./features/categories/features/categories/features/pages/sub-category-products/sub-category-products.component').then(
        (m) => m.SubCategoryProductsComponent,
      ),
    title: 'FreshCart',
  },
  {
    path: 'category-products/:id',
    loadComponent: () =>
      import('./features/categories/features/pages/category-products/category-products.component').then(
        (m) => m.CategoryProductsComponent,
      ),
    title: 'FreshCart',
  },
  {
    path: 'cart',
    canActivate: [authGuard],
    title: 'FreshCart',
    loadComponent: () => import('./features/cart/cart.component').then((m) => m.CartComponent),
  },
  {
    path: 'categories',
    title: 'FreshCart',
    loadComponent: () =>
      import('./features/categories/categories.component').then((m) => m.CategoriesComponent),
  },

  {
    path: 'checkout',
    canActivate: [authGuard],
    title: 'FreshCart',
    loadComponent: () =>
      import('./features/checkout/checkout.component').then((m) => m.CheckoutComponent),
  },
  {
    path: 'details/:slug/:id',
    title: 'FreshCart',
    loadComponent: () =>
      import('./features/details/details.component').then((m) => m.DetailsComponent),
  },
  {
    path: 'forgot',
    title: 'FreshCart',
    loadComponent: () =>
      import('./features/forgot/forgot.component').then((m) => m.ForgotComponent),
  },
  {
    path: 'login',
    title: 'FreshCart',
    loadComponent: () => import('./features/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'order',
    title: 'FreshCart',
    canActivate: [authGuard],
    loadComponent: () => import('./features/order/order.component').then((m) => m.OrderComponent),
  },
  {
    path: 'register',
    title: 'FreshCart',
    loadComponent: () =>
      import('./features/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'wishlist',
    title: 'FreshCart',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/wishlist/wishlist.component').then((m) => m.WishlistComponent),
  },
  {
    path: 'privacy-policy',
    title: 'FreshCart',
    loadComponent: () =>
      import('./features/privacy-policy/privacy-policy.component').then(
        (m) => m.PrivacyPolicyComponent,
      ),
  },
  {
    path: 'terms-of-service',
    title: 'FreshCart',
    loadComponent: () =>
      import('./features/terms-of-service/terms-of-service.component').then(
        (m) => m.TermsOfServiceComponent,
      ),
  },
  {
    path: 'support',
    title: 'FreshCart',
    loadComponent: () =>
      import('./features/support/support.component').then((m) => m.SupportComponent),
  },
  {
    path: 'not-found',
    title: 'FreshCart',
    loadComponent: () =>
      import('./features/notfound/notfound.component').then((m) => m.NotfoundComponent),
  },
  {
    path: '**',
    title: 'FreshCart',
    loadComponent: () =>
      import('./features/notfound/notfound.component').then((m) => m.NotfoundComponent),
  },
];
