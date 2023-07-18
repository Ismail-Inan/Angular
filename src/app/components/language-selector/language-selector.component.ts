import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { TranslationService } from 'src/app/services/translation/translation.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  template: `
    <select [(ngModel)]="language" (change)="onChange()">
      <option *ngFor="let lang of supportedLanguages" [value]="lang.code">
        {{ lang.label }}
      </option>
    </select>
  `,
  imports: [CommonModule, HttpClientModule, FormsModule],
})
export class LanguageSelectorComponent {
  public language: string;
  public supportedLanguages = [
    { code: 'en', label: 'English' },
    { code: 'de', label: 'Deutsch' }
  ];

  constructor(private translationService: TranslationService) {
    this.language = 'de';
  }

  public onChange(): void {
    this.translationService.use(this.language);
  }
}