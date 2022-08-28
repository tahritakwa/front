import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { PagerSettings } from '@progress/kendo-angular-grid';
import { DataResult, State } from '@progress/kendo-data-query';
import { BankAccountService } from '../../../administration/services/bank-account/bank-account.service';
import { BankAccountConstant } from '../../../constant/Administration/bank-account.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { TreasuryConstant } from '../../../constant/treasury/treasury.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { BankAccountTypeEnumerator } from '../../../models/enumerators/bank-account-type.enum';
import { BankAccount } from '../../../models/shared/bank-account.model';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { Filter, Operation, OrderBy, OrderByDirection, PredicateFormat, Relation } from '../../../shared/utils/predicate';
import {isUndefined} from 'ngx-bootstrap/chronos/utils/type-checks';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { LanguageService } from '../../../shared/services/language/language.service';
import {LocalStorageService} from '../../../login/Authentification/services/local-storage-service';

@Component({
  selector: 'app-bank-account',
  templateUrl: './bank-account.component.html',
  styleUrls: ['./bank-account.component.scss'],
})
export class BankAccountComponent implements OnInit {
  @Input() isCallFromTreasury = false;
  bankAccountType = BankAccountTypeEnumerator;
  BankAccountFiltred: any;
  // pager settings
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;

  formGroup: FormGroup;

  // State
  public state: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.NINE,
    // Initial filter descriptor
    filter: {
      logic: SharedConstant.LOGIC_AND,
      filters: [],
    },
  };

  public gridState: State = {
    skip: 0,
    take: 10,
    // Initial filter descriptor
    filter: {
      logic: SharedConstant.LOGIC_AND,
      filters: [],
    },
  };

  isCardView = false;
  public predicate: PredicateFormat;
  // Data to diplay in cards
  data: any[] = [];
  dataResult: DataResult;
  // Number of cards to display in the page
  totalCards = NumberConstant.NINE;
  pictureBase = TreasuryConstant.PICTURE_BASE;
  // Number of the total trainings
  totalAccounts = NumberConstant.ZERO;
  countryChecked = false;
  searchByCountryString: string;
  searchByBankString: string;
  bankAccountToShowInSideNav;
  defaultPictureUrl = TreasuryConstant.DEFAULT_PICTURE;
  language: string;
  public columnsConfig: ColumnSettings[] = [
    {
      field: TreasuryConstant.NAME_BANK_FROM_ID_BANK_NAVIGATION,
      title: TreasuryConstant.BANK_TITLE,
      tooltip: TreasuryConstant.BANK_NAME,
      filterable: true,
    },
    {
      field: TreasuryConstant.AGENCY,
      title: TreasuryConstant.AGENCE_AND_CODE,
      tooltip: TreasuryConstant.AGENCE_AND_CODE,
      filterable: true,
    },
    {
      field: TreasuryConstant.RIB,
      title: TreasuryConstant.RIB_TITLE,
      tooltip: TreasuryConstant.RIB_TITLE,
      filterable: true,
    },
    {
      field: TreasuryConstant.CURRENT_BALANCE,
      title: TreasuryConstant.CURRENT_BALANCE_TITLE,
      tooltip: TreasuryConstant.CURRENT_BALANCE_TITLE,
      filterable: true,
    },
    {
      field: TreasuryConstant.TYPE_ACCOUNT,
      title: TreasuryConstant.TYPE_TITLE,
      tooltip: TreasuryConstant.TYPE_TITLE,
      filterable: true,
    },
  ];

  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };

  public bankAccount;
  public hasAddPermission: boolean;
  public hasShowPermission: boolean;
  public hasListPermission: boolean;
  public hasDeletePermission: boolean;
  public hasUpdatePermission: boolean;

  constructor(
    private bankaccountService: BankAccountService,
    private router: Router,
      private swalWarrings: SwalWarring, private authService: AuthService,
    private fb: FormBuilder, private localStorageService : LocalStorageService) {
    this.language = this.localStorageService.getLanguage();

  }

  ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.ADD_BANKACCOUNT);
    this.hasShowPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.SHOW_BANKACCOUNT);
    this.hasListPermission = this.authService.hasAuthority(PermissionConstant.TreasuryPermissions.LIST_TREASURY_BANK_ACCOUNT);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.UPDATE_BANKACCOUNT);
    this.hasDeletePermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.DELETE_BANKACCOUNT);
    this.initDataSource();
    this.formGroup = this.fb.group({
      IdCountry: undefined,
      IdBank: undefined,
    });
  }

  removeHandler(dataItem) {
    this.swalWarrings
      .CreateSwal(TreasuryConstant.BANK_ACCOUNT_TEXT_MESSAGE, TreasuryConstant.BANK_ACCOUNT_SUPPRESSION)
      .then((result) => {
        if (result.value) {
          this.bankaccountService.removeBankAccount(dataItem).subscribe((res) => {
            this.initDataSource();
          });
        }
      });
  }

  deleteAccount(event) {
    event = { dataItem: event };
    this.removeHandler(event);
  }

  public initDataSource() {
    if (isUndefined(this.predicate)) {
      this.predicate = this.getPredicate();
    }
    this.bankaccountService
      .reloadServerSideData(this.gridSettings.state, this.predicate, BankAccountConstant.GET_BANK_ACCOUNT_LIST)
      .subscribe((res) => {
        this.dataResult = res;
        this.data = res.data;
        this.totalAccounts = res.total;
        this.gridSettings.gridData = res;
        this.BankAccountFiltred = this.gridSettings;
      });
  }

  public getPredicate() {
    const myPredicate = new PredicateFormat();
    myPredicate.Filter = new Array<Filter>();
    myPredicate.Relation = new Array<Relation>();
    myPredicate.Relation.push.apply(myPredicate.Relation, [
      new Relation(TreasuryConstant.ID_BANK_NAVIGATION),
    ]);
    myPredicate.Relation.push.apply(myPredicate.Relation, [
      new Relation(TreasuryConstant.ID_CURRENCY__NAVIGATION),
    ]);
    myPredicate.OrderBy = new Array<OrderBy>();
    myPredicate.OrderBy.push(new OrderBy(BankAccountConstant.ID, OrderByDirection.desc));
    return myPredicate;
  }

  receiveCountryStatus($event) {
    this.searchByCountryString = $event;
    this.formGroup.value.IdCountry = $event;
  }

  receiveBankStatus($event) {
    this.searchByBankString = $event ? $event.Id : undefined;
    this.formGroup.value.IdBank = $event ? $event.Id : undefined;
  }

  filter() {
    this.predicate = this.getPredicate();
    this.predicate.Filter.push(new Filter(TreasuryConstant.NAME_BANK_FROM_ID_BANK_NAVIGATION, Operation.contains, this.bankAccount, false, true));
    this.predicate.Filter.push(new Filter(TreasuryConstant.RIB, Operation.contains, this.bankAccount, false, true));
    this.predicate.Filter.push(new Filter(TreasuryConstant.CURRENT_BALANCE, Operation.contains, this.bankAccount, false, true));
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.initDataSource();
  }

  getPictureSrc(account): string {
    if (account.IdBankNavigation.LogoFileInfo) {
      return this.pictureBase.concat(
        account.IdBankNavigation.LogoFileInfo.Data
      );
    }
  }

  changeViewToCard(x) {
    this.isCardView = true;
  }

  changeViewToList(e) {
    this.isCardView = false;
  }

  public dataStateChange(state: State): void {
    if (!state.sort[NumberConstant.ZERO] || (state.sort[NumberConstant.ZERO] && !state.sort[NumberConstant.ZERO].dir)) {
      state.sort = [];
    }
    this.gridSettings.state = state;
    this.initDataSource();
  }

  onPageChange(event, card?) {
    this.gridSettings.state.skip =
      card !== undefined
        ? event * NumberConstant.TEN - NumberConstant.TEN
        : this.gridSettings.state.skip;
    this.initDataSource();
  }

  public goToAdvancedEdit(dataItem: BankAccount) {
    if (this.isCallFromTreasury) {
      this.router.navigateByUrl(BankAccountConstant.NAVIGATE_TO_BANK_ACCOUNT_RECONCILIATION.concat(String(dataItem.Id)));
    } else {
      this.router.navigateByUrl(BankAccountConstant.NAVIGATE_TO_EDIT_BANK_ACCOUNT.concat(String(dataItem.Id)));
    }
  }

  showDetails(account: BankAccount) {
    if (this.isCallFromTreasury) {
      this.router.navigateByUrl(BankAccountConstant.NAVIGATE_TO_BANK_ACCOUNT_RECONCILIATION.concat(String(account.Id)));
    } else {
      this.router.navigateByUrl(BankAccountConstant.NAVIGATE_TO_EDIT_BANK_ACCOUNT.concat(String(account.Id)));
    }
  }

  btnCardListVisibility() {
    return !this.isCardView && this.data.length > NumberConstant.ZERO;
  }
}
