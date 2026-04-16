import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment.development';
import { BannerComponent } from '../../shared/ui/banner/banner.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [RouterLink, BannerComponent, TranslatePipe],
  templateUrl: './brands.component.html',
})
export class BrandsComponent implements OnInit {
  private readonly _httpClient = inject(HttpClient);

  brandsList = signal<any[]>([]);

  ngOnInit(): void {
    this.getBrands();
  }

  getBrands(): void {
    this._httpClient.get(`${environment.baseUrl}/api/v1/brands`).subscribe({
      next: (res: any) => {
        this.brandsList.set(res.data);
      },
      error: (err) => {
        
      },
    });
  }
}
