import { Injectable } from '@angular/core';
import { MessageService } from '@progress/kendo-angular-l10n';
import { KendoKeysEn } from '../../../../assets/kendo-i18n/kendo-keys-en';
import { KendoKeysFr } from '../../../../assets/kendo-i18n/kendo-keys-fr';
import { UserCurrentInformationsService } from '../utility/user-current-informations.service';
const data = {
  fr: {
    messages: KendoKeysFr
  },
  en: {
    messages: KendoKeysEn
  }
};
@Injectable()
export class KendoGridTranslationService extends MessageService {
  
  private localeId: string;

  constructor() {
    super();
  }
  public set language(value: string) {
    const lang = data[value];
    if (lang) {
      this.localeId = value;
      this.notify();
    }
  }

  public get language(): string {
    this.localeId = 'fr';
    return this.localeId;
  }

  private get messages(): any {
    if (!this.localeId) {
        this.localeId = 'fr';
    }
    const lang = data[this.localeId];
    if (lang) {
      return lang.messages;
    }
  }

  public get(key: string): string {
    return this.messages ? this.messages[key] : undefined;
  }
}
