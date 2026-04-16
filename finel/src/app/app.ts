import { TranslateService } from '@ngx-translate/core';
import { MyTranslateService } from './core/services/my-translate.service';
import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { NgxSpinnerComponent } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, NgxSpinnerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly myTranslateService = inject(MyTranslateService);
  private readonly translate = inject(TranslateService);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.myTranslateService.changeDirection();
    }
    this.storeNameIfBrowser();
  }

  private storeNameIfBrowser(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('name', 'ali');
    }
  }

  constructor() {
    this.translate.addLangs(['en', 'ar']);
    if (isPlatformBrowser(this.platformId)) {
      const savedLang = localStorage.getItem('lang') ?? 'en';
      this.translate.setFallbackLang('en');
      this.translate.use(savedLang);
    }
  }
}
