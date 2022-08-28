import { Component, Output, EventEmitter, SimpleChanges, OnChanges, Input, OnInit } from '@angular/core';
import { TreasuryConstant } from '../../../constant/treasury/treasury.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { BankService } from '../../services/bank.service';
import { isNull } from 'util';
import { isNotNullOrUndefinedAndNotEmptyValue } from '../../../stark-permissions/utils/utils';
import { LanguageService } from '../../../shared/services/language/language.service';
import {LocalStorageService} from '../../../login/Authentification/services/local-storage-service';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';

@Component({
  selector: 'app-card-view-bank-account',
  templateUrl: './card-view-bank-account.component.html',
  styleUrls: ['./card-view-bank-account.component.scss']
})
export class CardViewBankAccountComponent implements OnInit, OnChanges {

  @Input() BankAccountFiltred;
  @Input() data: any[] = [];
  @Input() isCallFromTreasury = false;
  @Output() sendBankAccountToDelete = new EventEmitter<any>();
  @Output() sendBankAccountToSave = new EventEmitter<any>();
  @Output() pageChangeEvent = new EventEmitter<any>();

  pictureBase = TreasuryConstant.PICTURE_BASE;
  defaultPictureUrl = TreasuryConstant.DEFAULT_BANk_PICTURE;
  private currentPage: number = NumberConstant.ONE;
  language: string;
  public gridState: DataSourceRequestState = {
    skip: (this.currentPage * NumberConstant.TEN) - NumberConstant.TEN,
    take: NumberConstant.TEN,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: []
    }
  };
  public gridSettings: GridSettings = {
    state: this.gridState
  };
  public showed = false;

  private picturesSrc = [];
/** Permissions */
public hasShowPermission: boolean;
public hasDeletePermission = false;
public hasUpdatePermission = false;
  constructor(public bankService: BankService,
              private localStorageService : LocalStorageService,public authService: AuthService) {
    this.language = this.localStorageService.getLanguage();
  }

  /**
     * ng init
     */
  ngOnInit() {
    this.hasShowPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.SHOW_BANKACCOUNT);
    this.hasDeletePermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.DELETE_BANKACCOUNT);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.UPDATE_BANKACCOUNT);
    this.loadPictureSrc();
  }
  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges.BankAccountFiltred) {
      this.gridSettings = simpleChanges.BankAccountFiltred.currentValue;
      this.showed = true;
    }
    this.loadPictureSrc();
  }

  viewDetails(account?) {
    this.sendBankAccountToSave.emit(account);
  }

  deleteAccount(account) {
    this.sendBankAccountToDelete.emit(account);
  }

  getPictureSrc(account): string {
    if (account.LogoFileInfo) {
      return this.pictureBase.concat(account.LogoFileInfo.Data);
    } else {
      return this.defaultPictureUrl;
    }
  }


  onPageChange(currentpage) {
    this.currentPage = currentpage;
    this.onPageChangeFiltredBankAccount();
  }

  dataStateChange(state: DataStateChangeEvent) {
    this.gridSettings.state = state;
  }

  private onPageChangeFiltredBankAccount() {
    this.pageChangeEvent.emit(this.currentPage);
  }

  /**get picture */
  loadPictureSrc(): any {
    const paths = this.getPathsUrl();
    const indexDefaultPicutures = this.getIndexDefaultPicture();
    this.getPictures(paths, indexDefaultPicutures);
  }

  getPictureItem(itemPicture) {
    if (isNotNullOrUndefinedAndNotEmptyValue(itemPicture)) {
      if (this.defaultPictureUrl === itemPicture) {
        return itemPicture;
      } else {
        return SharedConstant.PICTURE_BASE + itemPicture;
      }
    }
  }

  getPathsUrl() {
    return this.data.map(account => account.BankAttachmentUrl);
  }

  getIndexDefaultPicture() {
    const indexDefaultPicutures = [];
    this.data.forEach((account, index) => {
      if (isNull(account.BankAttachmentUrl)) {
        indexDefaultPicutures.push(index);
      }
    });
    return indexDefaultPicutures;
  }

  getPictures(paths, indexDefaultPicutures) {
    if (paths.length > NumberConstant.ZERO) {
      this.bankService.getPictures(paths, false).subscribe((res: any) => {
        for (const pic of res.objectData) {
          this.picturesSrc.push(pic.Data);
        }
      });
    }
    indexDefaultPicutures.forEach(indexDefaultPicuture => this.picturesSrc.splice(NumberConstant.ONE, NumberConstant.ZERO, this.defaultPictureUrl));
  }
}
