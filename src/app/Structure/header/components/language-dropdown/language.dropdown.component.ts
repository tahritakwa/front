import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../../../../shared/services/language/language.service';
import {LocalStorageService} from '../../../../login/Authentification/services/local-storage-service';

@Component({
  selector: 'app-language-dropdown',
  templateUrl: './language.dropdown.component.html',
  styleUrls: ['./language.dropdown.component.scss']
})
export class LanguageDropdownComponent implements OnInit {
  languages;
  public currentLanguage: string;
  constructor(private languageService: LanguageService , private localStorageService : LocalStorageService) {
    this.languages = languageService.languages;
  }
  ngOnInit() {
    this.currentLanguage = this.localStorageService.getLanguage();
    this.languageService.checkSelectedLang();
  }
}
