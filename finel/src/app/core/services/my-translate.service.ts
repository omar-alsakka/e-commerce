import { inject, Injectable, PLATFORM_ID, Renderer2, RendererFactory2, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class MyTranslateService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly translateService = inject(TranslateService);
  private readonly rendererFactory = inject(RendererFactory2);
  private readonly renderer: Renderer2;

  currentLang = signal<string>('en');

  constructor() {

    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  changeDirection(): void {
    if (isPlatformBrowser(this.platformId)) {
      const storedLang = localStorage.getItem('lang') ?? 'en';
      this.setLang(storedLang);
    }
  }

  changeLang(lang: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('lang', lang);
    }
    this.setLang(lang);
  }

  private setLang(lang: string): void {
    this.currentLang.set(lang);
    this.translateService.use(lang);

    const html = document.documentElement;
    if (lang === 'ar') {
      this.renderer.setAttribute(html, 'dir', 'rtl');
      this.renderer.setAttribute(html, 'lang', 'ar');
    } else {
      this.renderer.setAttribute(html, 'dir', 'ltr');
      this.renderer.setAttribute(html, 'lang', 'en');
    }
  }
}
