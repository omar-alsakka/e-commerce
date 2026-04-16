import { Component, inject, OnInit, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../core/services/products.service';
import { CategoriesService } from '../../core/services/categories.service';
import { HttpClient } from '@angular/common/http';
import { CardComponent } from '../../shared/ui/card/card.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, CardComponent, TranslateModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly httpClient = inject(HttpClient);
  readonly translate = inject(TranslateService);

  productList = signal<any[]>([]);
  categories = signal<any[]>([]);
  brands = signal<any[]>([]);
  total = signal(0);
  loading = signal(false);
  
  searchTerm = signal('');
  searchQuery = signal('');
  selectedCategories = signal<string[]>([]);
  selectedBrands = signal<string[]>([]);
  minPrice = signal<number | null>(null);
  maxPrice = signal<number | null>(null);
  currentSort = signal('relevance');
  currentPage = signal(1);
  pages = signal<number[]>([]);
  viewMode = signal<'grid' | 'list'>('grid');

  filteredProducts = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const items = this.productList();
    if (!term) return items;
    return items.filter(item => 
      item.title.toLowerCase().includes(term) || 
      item.category.name.toLowerCase().includes(term)
    );
  });

  filteredCount = computed(() => this.filteredProducts().length);

  private searchSubject = new Subject<string>();

  constructor() {
    effect(() => {
      this.fetchProducts();
    }, { allowSignalWrites: true });
  }

  ngOnInit(): void {
    this.loadInitialData();
    
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['q']) {
        this.searchTerm.set(params['q']);
        this.searchQuery.set(params['q']);
      }
    });

    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(query => {
      this.searchQuery.set(query);
      this.currentPage.set(1);
    });
  }

  loadInitialData(): void {
    this.categoriesService.getAllCategories().subscribe({
      next: (res) => this.categories.set(res.data)
    });

    this.httpClient.get(`${environment.baseUrl}/api/v1/brands`).subscribe({
      next: (res: any) => this.brands.set(res.data)
    });
  }

  onSearchInput(): void {
    this.searchSubject.next(this.searchTerm());
  }

  toggleCategory(id: string): void {
    const current = this.selectedCategories();
    if (current.includes(id)) {
      this.selectedCategories.set(current.filter(c => c !== id));
    } else {
      this.selectedCategories.set([...current, id]);
    }
    this.currentPage.set(1);
  }

  toggleBrand(id: string): void {
    const current = this.selectedBrands();
    if (current.includes(id)) {
      this.selectedBrands.set(current.filter(b => b !== id));
    } else {
      this.selectedBrands.set([...current, id]);
    }
    this.currentPage.set(1);
  }

  setPriceRange(min: number | null, max: number | null): void {
    this.minPrice.set(min);
    this.maxPrice.set(max);
    this.currentPage.set(1);
  }

  changeSort(sort: string): void {
    this.currentSort.set(sort);
    this.currentPage.set(1);
  }

  fetchProducts(): void {
    this.loading.set(true);
    let query = `limit=12&sort=${this.currentSort() === 'relevance' ? '' : this.currentSort()}`;
    
    if (this.searchQuery() && this.searchQuery().length >= 3) {
      query += `&keyword=${this.searchQuery()}`;
    }
    
    if (this.selectedCategories().length > 0) {
      query += `&category[in]=${this.selectedCategories().join(',')}`;
    }
    
    if (this.selectedBrands().length > 0) {
      query += `&brand[in]=${this.selectedBrands().join(',')}`;
    }
    
    if (this.minPrice() !== null) {
      query += `&price[gte]=${this.minPrice()}`;
    }
    
    if (this.maxPrice() !== null) {
      query += `&price[lte]=${this.maxPrice()}`;
    }

    this.productsService.getAllProducts(this.currentPage(), query).subscribe({
      next: (res) => {
        this.productList.set(res.data);
        this.total.set(res.results);
        const totalPages = Math.ceil(res.results / 12);
        this.pages.set(Array.from({ length: totalPages }, (_, i) => i + 1));
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  goToPage(page: number): void {
    this.currentPage.set(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  clearFilters(): void {
    this.selectedCategories.set([]);
    this.selectedBrands.set([]);
    this.minPrice.set(null);
    this.maxPrice.set(null);
    this.searchQuery.set('');
    this.currentPage.set(1);
  }
}
