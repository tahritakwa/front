import {Component, OnInit, Input, Output, EventEmitter, ViewContainerRef, ViewChild} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {CurrencyService} from '../../../administration/services/currency/currency.service';
import {DropDownComponent} from '../../interfaces/drop-down-component.interface';
import {ReducedCurrency} from '../../../models/administration/reduced-currency.model';
import {FormModalDialogService} from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {RoleConfigConstant} from '../../../Structure/_roleConfigConstant';
import {CurrencyConstant} from '../../../constant/Administration/currency.constant';
import {AddCurrencyComponent} from '../../../administration/currency/add-currency/add-currency.component';
import {isNullOrUndefined} from 'util';
import {notEmptyValue} from '../../../stark-permissions/utils/utils';
import {StarkRolesService} from '../../../stark-permissions/service/roles.service';
import {TiersService} from '../../../purchase/services/tiers/tiers.service';
import {CompanyService} from '../../../administration/services/company/company.service';
import {ComboBoxComponent} from '@progress/kendo-angular-dropdowns';
import { OrderBy, OrderByDirection, PredicateFormat } from '../../utils/predicate';
import { NumberConstant } from '../../../constant/utility/number.constant';

@Component({
  selector: 'app-currency-dropdown',
  templateUrl: './currency-dropdown.component.html',
  styleUrls: ['./currency-dropdown.component.scss']
})
export class CurrencyDropdownComponent implements OnInit, DropDownComponent {
  @ViewChild(ComboBoxComponent) public comboboxComponent: ComboBoxComponent;

  @Input() allowCustom;
  @Input() group: FormGroup;
  @Input() disabled: boolean;
  @Output() Selected = new EventEmitter<any>();
  @Input() readonly = false;
  public currentCurrency: string;
  public selectedValue;
  public isUpdateMode: boolean;
  @Input() isFromCrm = false;
  // Currency List
  public currencyDataSource: Array<ReducedCurrency>;
  public currencyFiltredDataSource: Array<ReducedCurrency>;
  public showAddButton = false;
  @Input() disable = false;
  public predicate: PredicateFormat;

  constructor(private tiersService: TiersService, private currencyService: CurrencyService, private viewRef: ViewContainerRef,
              private companyService: CompanyService, private formModalDialogService: FormModalDialogService,
              private roleService: StarkRolesService) {
    this.getCurrentCompanyCurrency();
    this.tiersService.getResult().subscribe((data) => {
      if (data.value === true) {
        this.isUpdateMode = data.data;
      }
    });
  }

  ngOnInit() {
    this.initDataSource();
    this.roleService.ListRoleConfigsAsObservable().subscribe((roledata: Array<any>) => {
      if (!isNullOrUndefined(roledata) && notEmptyValue(roledata)) {
        this.roleService.hasOnlyRoles([RoleConfigConstant.Resp_RhConfig,
          RoleConfigConstant.Resp_PayConfig, RoleConfigConstant.ManagerConfig]).then(y => {
          this.showAddButton = y;
        });
      }
    });

  }

  public onSelect(event): void {
    if (this.currencyFiltredDataSource) {
      const selected = this.currencyFiltredDataSource.filter(currency => currency.Id === event)[NumberConstant.ZERO];
      this.Selected.emit(selected);
    }
  }

  public getCurrentCompanyCurrency() {
    this.companyService.getCurrentCompany().subscribe(result => {
      this.currencyService.getById(result.IdCurrency).subscribe(data => {
        this.currentCurrency = data;
        if (this.isUpdateMode === false) {
          this.selectedValue = this.currentCurrency;
          this.onSelect(this.selectedValue.Id);
        }
      });
    });
  }

  initDataSource(): void {
    this.preparePredicate();
    this.currencyService.listdropdownWithPerdicate(this.predicate).subscribe((data: any) => {
      this.currencyDataSource = data.listData;
      this.currencyFiltredDataSource = this.currencyDataSource.slice(NumberConstant.ZERO);
    });
  }

  public preparePredicate() {
    this.predicate = new PredicateFormat();
    this.predicate.OrderBy = new Array<OrderBy>();
    this.predicate.OrderBy.push(new OrderBy(SharedConstant.CODE, OrderByDirection.asc));
  }


  handleFilter(value: string): void {
    this.currencyFiltredDataSource = this.currencyDataSource.filter((s) =>
      s.Code.toLowerCase().includes(value.toLowerCase())
      || s.Symbole.toLowerCase().includes(value.toLowerCase()));
  }

  addNew(): void {
    this.formModalDialogService.openDialog(CurrencyConstant.ADD_CURRENCY, AddCurrencyComponent,
      this.viewRef, this.initDataSource.bind(this), null, true, SharedConstant.MODAL_DIALOG_SIZE_L);
  }

  public openDropDown() {
    if (!this.readonly && !this.disabled) {
      this.comboboxComponent.toggle(true);
    }
  }
}
