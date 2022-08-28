import { Component, OnInit } from '@angular/core';
import { ActivityAreaEnumerator } from '../../models/enumerators/activity-area.enum';
import { SearchItemService } from '../../sales/services/search-item/search-item.service';
import {LocalStorageService} from '../../login/Authentification/services/local-storage-service';
const { version: appVersion } = require('../../../../package.json');
@Component({
  selector: 'footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  public appVersion;
  copyRightYear = Date.now();
  isAutoVersion: boolean;
  constructor(public searchItemService: SearchItemService, private localStorageService : LocalStorageService) {
    this.isAutoVersion = this.localStorageService.getActivityArea() === ActivityAreaEnumerator.Auto;

  }

  ngOnInit() {
    this.appVersion = appVersion;
  }

}
