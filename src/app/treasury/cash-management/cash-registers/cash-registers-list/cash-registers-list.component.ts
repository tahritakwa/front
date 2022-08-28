import { AfterViewChecked, Component, OnInit, ViewContainerRef } from '@angular/core';
import {
  CashRegisterItemTypeEnumerator, CashRegisterTypeEnum
} from '../../../../models/enumerators/cash-managment-hierarchy-test-data.enum';
import { FormModalDialogService } from '../../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { CashRegisterConstant } from '../../../../constant/treasury/cash-register.constant';
import { CashRegistersAddComponent } from '../cash-registers-add/cash-registers-add.component';
import { SharedConstant } from '../../../../constant/shared/shared.constant';
import { CashRegisterService } from '../../../services/cash-register/cash-register.service';
import { CashRegisterItem } from '../../../../models/treasury/cash-register-item';
import { NumberConstant } from '../../../../constant/utility/number.constant';
import { SwalWarring } from '../../../../shared/components/swal/swal-popup';
import { AuthService } from '../../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../../Structure/permission-constant';
import { Filter, Operation, PredicateFormat, Relation } from '../../../../shared/utils/predicate';
import { TreasuryConstant } from '../../../../constant/treasury/treasury.constant';
import { LanguageService } from '../../../../shared/services/language/language.service';
import { Languages } from '../../../../constant/shared/services.constant';
import { TranslateService } from '@ngx-translate/core';
import { DocumentsGeneratedListComponent } from '../../../../sales/billing-session/documents-generated-list/documents-generated-list.component';
import { CompanyService } from '../../../../administration/services/company/company.service';
import { ActivitySectorsEnum, ActivitySectorsEnumerator } from '../../../../models/shared/enum/activitySectors.enum';

@Component({
  selector: 'app-cash-registers-list',
  templateUrl: './cash-registers-list.component.html',
  styleUrls: ['./cash-registers-list.component.scss']
})
export class CashRegistersListComponent implements OnInit, AfterViewChecked {
  // tree properties
  nodesData = [];
  data = [];
  selectedKeys = [];
  expandedKeys = ['0', '0_0', '0_0_0'];
  selectedData: any;
  // Enumerators
  cashRegisterItemTypeEnumerator = CashRegisterItemTypeEnumerator;
  cashRegisterTypeEnum = CashRegisterTypeEnum;
  activitySectorEnum = ActivitySectorsEnum;

  // Selected Cash register details
  cashRegisterItemSelected: any;
  cashRegisterItemSelectedId = null;
  cashRegisterDetails = null;

  // predicate
  predicate: PredicateFormat;

  // Permissions
  hasAddPermission: boolean;
  hasUpdatePermission: boolean;
  hasDeletePermission: boolean;
  hasShowPermission: boolean;

  VisiblesCashesIds = [];

  translatedCashRegisterType = '';
  canRefreshTree: boolean;
  public currentCompanyActivityArea: number;
  constructor(private modalDialogService: FormModalDialogService, private languageService: LanguageService,
    private viewContainerRef: ViewContainerRef, private cashRegisterService: CashRegisterService,
    private translateService: TranslateService, private swalWarrings: SwalWarring,
    private authService: AuthService, private companyService: CompanyService) { }
  ngAfterViewChecked(): void {
    if (this.canRefreshTree && document.getElementsByClassName("k-in k-state-selected").length == NumberConstant.TWO) {
      document.getElementsByClassName("k-in k-state-selected")[1].className = "k-in";
      this.canRefreshTree = false;
    }
  }

  ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.TreasuryPermissions.ADD_CASH_MANAGEMENT);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.TreasuryPermissions.UPDATE_CASH_MANAGEMENT);
    this.hasDeletePermission = this.authService.hasAuthority(PermissionConstant.TreasuryPermissions.DELETE_CASH_MANAGEMENT);
    this.hasShowPermission = this.authService.hasAuthority(PermissionConstant.TreasuryPermissions.SHOW_HIERARCHY_CASH_MANAGEMENT);
    this.getCashRegisterHierarchy();
    this.getCurrentCompanyActivityArea();
  }

  getCountryName() {
    return this.languageService.selectedLang === Languages.EN.value ? this.cashRegisterItemSelected.IdCountryNavigation.NameEn :
      this.cashRegisterItemSelected.IdCountryNavigation.NameFr;
  }


  getCashRegisterHierarchy() {
    this.cashRegisterService.getCashRegisterHierarchy().subscribe(data => {
      this.nodesData = data.listObject.listData;
      this.data = data.listObject.listData;
      if (this.nodesData && this.nodesData.length > NumberConstant.ZERO) {
        // Make the cash resgister associated to the connected user Selected By default
        this.cashRegisterService.getCashRegisterVisibility().subscribe(data => {
          if (Object.keys(data).length > NumberConstant.ZERO) {
            if (data.ConnectedCashRegister != null) {
              this.selectedKeys.push(data.ConnectedCashRegister);
              this.getCashDetail(data.ConnectedCashRegister);
            }
            this.VisiblesCashesIds = data.VisibleCashes;
          }
        });
      }
    });
  }


  handleSelection($event) {
    if ($event && $event.dataItem && ($event.dataItem.Type !== this.cashRegisterItemTypeEnumerator.Zone)) {
      this.selectedData = $event.dataItem;
    }
  }

  removeHandler(dataItem) {
    this.swalWarrings.CreateSwal().then((result) => {
      if (result.value) {
        this.cashRegisterService.remove(dataItem).subscribe(() => {
          this.getCashRegisterHierarchy();
        });
      }
    });

  }

  addCashRegister(cashRegister?: CashRegisterItem): void {
    if (cashRegister) {
      this.cashRegisterService.getById(cashRegister.Id).subscribe(result => {
        this.modalDialogService.openDialog(CashRegisterConstant.EDIT_CASH_REGISTER, CashRegistersAddComponent,
          this.viewContainerRef, this.refreshTree.bind(this), result, false, SharedConstant.MODAL_DIALOG_SIZE_ML);
      });
    } else {
      this.modalDialogService.openDialog(CashRegisterConstant.ADD_CASH_REGISTER, CashRegistersAddComponent,
        this.viewContainerRef, this.refreshTree.bind(this), null, false, SharedConstant.MODAL_DIALOG_SIZE_ML);
    }
  }
  
  receiveSelectedCashRegister($event) {
   this.initialiseCashRegisterTab();
    const cashRegisterDataItem = $event.dataItem;
    if (cashRegisterDataItem && this.VisiblesCashesIds.indexOf($event.dataItem.Id) !== -1) {
      this.getCashDetail(cashRegisterDataItem.Id);
    }
  }

  getCashDetail(id) {
    this.preparePredicate(id);
    this.cashRegisterService.getModelByCondition(this.predicate).subscribe(res => {
      if (res) {
        this.cashRegisterItemSelected = res;
        this.cashRegisterItemSelectedId = res.Id;
        this.translateService.get(CashRegisterTypeEnum[res.Type].toUpperCase())
          .subscribe(trans => this.translatedCashRegisterType = trans);
      }
    });
  }

  preparePredicate(id?: number) {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Filter.push(new Filter(TreasuryConstant.ID, Operation.eq, id));
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(CashRegisterConstant.ID_RESPONSIBLE_NAVIGATION)]);
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(CashRegisterConstant.ID_PARENT_CASH_NAVIGATION)]);
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(CashRegisterConstant.ID_CITY_NAVIGATION)]);
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(CashRegisterConstant.ID_COUNTRY_NAVIGATION)]);
  }

  refreshTree() {
    this.canRefreshTree = true;
    this.getCashRegisterHierarchy();
  }

  public onkeyup(value: string): void {
    // Search value in treeview
    this.nodesData = this.search(this.data, value);
    this.selectedKeys = ['0'];
  }

  public search(Items: any[], term: string): any[] {
    return Items.reduce((acc, item) => {
      if (this.contains(item.Text, term)) {
        acc.push(item);
      } else if (item.Items && item.Items.length > 0) {
        const newItems = this.search(item.Items, term);
        // Return list of details of elements
        if (newItems.length > 0) {
          acc.push({
            Id: item.Id,
            Text: item.Text,
            Items: newItems,
            IdCity: item.IdCity,
            IdParentCash: item.IdParentCash,
            Type: item.Type
          });
        }
      }

      return acc;
    }, []);
  }

  public contains(Text: string, term: string): boolean {
    if (term && Text) {
      return Text.toLowerCase().indexOf(term.toLowerCase()) >= 0;
    } else {
      return true;
    }
  }
  getCurrentCompanyActivityArea() {
    this.companyService.getCurrentCompanyActivityArea().subscribe(x => {
      this.currentCompanyActivityArea = x;
    });
  }
  initialiseCashRegisterTab(){
    var navSession = document.getElementById('tabListCounterSales').getElementsByTagName('a')[0];
    var navTicket = document.getElementById('tabListCounterSales').getElementsByTagName('a')[1]
    var navSettlement = document.getElementById('tabListCounterSales').getElementsByTagName('a')[2];
    if (navSession && navTicket && navSettlement) {
      navTicket.className = 'nav-link pb-0 pt-1';
      navSettlement.className = 'nav-link pb-0 pt-1';
      navSession.className = 'nav-link  pb-0 pt-1 active';
      document.getElementById('session').className = 'nav-style tab-pane section-style pt-0 show active';
      document.getElementById('ticket').className = 'nav-style tab-pane ng-star-inserted';
      document.getElementById('settlement').className = 'nav-style tab-pane ng-star-inserted';
    }
  }

}
