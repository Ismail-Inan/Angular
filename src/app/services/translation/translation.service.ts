import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import de from '../../../assets/translations/de.json';
import en from '../../../assets/translations/en.json';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {

  constructor(private translate: TranslateService) {
  }

  init(): void {
    this.translate.setTranslation('en', en);
    this.translate.setTranslation('de', de);
    this.translate.setDefaultLang('de');
    this.translate.use('de');
  }

  public use(lang: string): void {
    this.translate.use(lang);
  }

}