import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { Filter, Operation, Operator, PredicateFormat, Relation } from '../../utils/predicate';
import { FormControl, FormGroup } from '@angular/forms';
import { TiersService } from '../../../purchase/services/tiers/tiers.service';
import { DropDownComponent } from '../../interfaces/drop-down-component.interface';
import { FormModalDialogService } from '../../services/dialog/form-modal-dialog/form-modal-dialog.service';
import { ComponentsConstant } from '../../../constant/shared/components.constant';
import { TranslationKeysConstant } from '../../../constant/shared/translation-keys.constant';
import { TiersConstants } from '../../../constant/purchase/tiers.constant';
import { AddTiersComponent } from '../add-tiers/add-tiers.component';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { ReducedTiers } from '../../../models/achat/reduced-tiers.model';
import { ProjectConstant } from '../../../constant/rh/project.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { ComboBoxComponent } from '@progress/kendo-angular-dropdowns';
import { OrderProjectService } from '../../../purchase/services/order-project/order-project.service';
import { isNullOrUndefined } from 'util';
import { TiersAccountsResolverService } from '../../../accounting/resolver/tiers-accounts-resolver.service';
import { isNotNullOrUndefinedAndNotEmptyValue } from '../../../stark-permissions/utils/utils';
import { TranslateService } from '@ngx-translate/core';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';

const SUPPLIER_COMBOBOX = 'supplierComboBox';
const ID_TIER = 'type';

@Component({
  selector: 'app-supplier-dropdown',
  templateUrl: './supplier-dropdown.component.html',
  styleUrls: ['./supplier-dropdown.component.scss']
})
export class SupplierDropdownComponent implements OnInit, OnChanges, DropDownComponent, AfterViewInit {

  // in / out puts
  @Input() itemForm: FormGroup;
  @Output() Selected = new EventEmitter<any>();
  @Output() selectedTiersId = new EventEmitter<any>();
  @Output() SelectedForPriceRequest = new EventEmitter<any>();
  @Input() type: number;
  @Input() selectedValue;
  @Input() allowCustom;
  @Input() isMultiSelect: boolean;
  @Input() idProject: number;
  @Input() getRelationCurrency: boolean;
  @Input() listSupllier: Array<number>;
  @Input() TecDocSupp: string;
  @Input() isSwhoOnlySelected: boolean;
  @Input() notWithNgModel: boolean;
  @Input() filterString: string;
  @Input() isInGrid: boolean;
  @Input() isDisabledDropDown: boolean;
  @Output() addClickedSupplier = new EventEmitter<any>();
  @Output() blurEmmitter = new EventEmitter<any>();
  @Input() hideAddBtn: boolean;
  @Input() disabled: boolean;
  @Input() focusElement: boolean;
  @Input() showDetails: boolean;
  @Input() isNewBe: boolean;
  @Input() focusElementOnInit: boolean;
  @Output() Focused = new EventEmitter<boolean>();
  @Input() forSearch: boolean;
  @Output() selectedValuesCheckbox = new EventEmitter<any>();
  @Input() Required: boolean;
  @Input() existDocument: boolean;
  public isChoosenSupplier: boolean;
  @ViewChild('IdTiersEl') IdTiersEl: ComboBoxComponent;
  public selectedValueMultiSelect = new Array<ReducedTiers>();
  // full data source
  @Input() supplierDataSource = new Array<any>();
  @Input() supplierFiltredDataSource = new Array<ReducedTiers>();
  // predicate filter
  private predicate: PredicateFormat;
  tecDocSupplierDetails = { Type: 2, Name: '', tiersAccount: TiersAccountsResolverService };
  public showModal: boolean;
  @Input() isFromDocControlStatus = false;
  tiersToShow;
  @Input() containerRef;
  @Input() withoutPlaceholder;
  @ViewChild(ComboBoxComponent) public supplierComboBox: ComboBoxComponent;
  @Input() public placeholder = SharedConstant.CHOOSESUPPLIER;

  @Input() isCheckboxMode: boolean;
  public limitSelection = NumberConstant.THREE;
  public ShowFilter = true;
  public dropdownSettings = {};
  public isMultiSelectTouched: boolean;
  public hasAddPermission: boolean;
  public hasEditPermission: boolean;
  public hasShowPermission: boolean;
  @Input() isForAddProduct: boolean;
  @Input() listTiers;
  public fromSwalWarningEvent;
  /**
   * contructor
   * @param supplierService
   * @param OrderService
   * @param viewRef
   * @param formModalDialogService
   */
  constructor(public supplierService: TiersService, public OrderService: OrderProjectService,
    private viewRef: ViewContainerRef, private formModalDialogService: FormModalDialogService,
    private translate: TranslateService, private authService: AuthService) {
  }

  public onSelect($event): void {
    if ($event.selectedValueMultiSelect) {
      if ($event.selectedValueMultiSelect.length === 0) {
        this.isChoosenSupplier = false;
      } else {
        this.isChoosenSupplier = true;
      }
      this.OrderService.show(this.isChoosenSupplier);
    }
    if (this.itemForm && $event) {
      const selectedTiers: ReducedTiers = this.supplierDataSource.find(x => x.Id === this.IdTiers.value);
      $event.selectedTiers = selectedTiers;
    } else if (!this.itemForm && $event) {
      const selectedTiers: ReducedTiers = this.supplierDataSource.find(x => x.Id === $event.selectedValue);
      $event.selectedTiers = selectedTiers;
    }
    this.Selected.emit($event);
    const idToEmit = $event.itemForm ? $event.itemForm.controls.IdTiers.value : $event.selectedValue;
    this.selectedTiersId.emit(idToEmit);
    this.SelectedForPriceRequest.emit($event);
  }

  ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_SUPPLIER);
    this.hasEditPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_CUSTOMER);
    this.hasShowPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_CUSTOMER);
    if (this.withoutPlaceholder) {
      this.placeholder = '';
    }
    if (!this.isSwhoOnlySelected || (this.isSwhoOnlySelected && this.listSupllier && this.listSupllier.length > 0)) {
      this.initDataSource();
    }
    if (this.selectedValue) {
      this.Selected.emit(this.selectedValue);
      this.selectedValueMultiSelect = this.selectedValue;
    }
    this.initCheckboxDropdownMode();
  }

  blur() {
    this.blurEmmitter.emit();
  }

  preparePredicate() {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    if (this.type) {
      this.predicate.Filter.push(new Filter(ComponentsConstant.ID_TYPE_TIERS, Operation.eq, this.type));
      this.predicate.Relation = new Array<Relation>();
      this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(TiersConstants.PHONE_NAVIGATION), new Relation(TiersConstants.VEHICLE)]);
      this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(TiersConstants.ADDRESS)]);
    }
    if (this.isSwhoOnlySelected) {
      if (this.listSupllier) {
        this.listSupllier.forEach(element => {
          this.predicate.Filter.push(new Filter(ComponentsConstant.ID, Operation.eq
            , element, false, true));
        });
      }
      this.predicate.Operator = Operator.or;
    }
    if (this.idProject && (this.idProject > NumberConstant.ZERO)) {
      this.predicate.Relation = new Array<Relation>();
      this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(ProjectConstant.PROJECT)]);
    }
  }

  public initDataSource(isFromClosingModal?): void {
    this.preparePredicate();
    this.supplierService.getSupplierDrodownList(this.predicate, this.idProject).subscribe((data: any) => {
      if (!this.TecDocSupp) {
        this.TecDocSupp = '';
      }
      if (this.TecDocSupp.length > 0) {
        this.tecDocSupplierDetails.Name = this.TecDocSupp;
      } else {
        if (this.tecDocSupplierDetails && this.tecDocSupplierDetails.Name && this.tecDocSupplierDetails.Name.length > 0) {
          this.TecDocSupp = this.tecDocSupplierDetails.Name;
        }
      }

      this.supplierDataSource = data.listData;
      this.supplierFiltredDataSource = this.supplierDataSource.slice(0);
      this.supplierFiltredDataSource = this.supplierDataSource.filter((s) =>
        s.Name.toLowerCase().includes(this.TecDocSupp.toLowerCase()));
      if (this.supplierDataSource.length === 0 && !(this.idProject && this.idProject > NumberConstant.ZERO)) {
        this.addNew();
        this.supplierFiltredDataSource = this.supplierDataSource.slice(0);
      }

      if (isFromClosingModal === true) {
        if (this.itemForm) {
          this.itemForm.controls[ComponentsConstant.ID_TIERS].setValue(this.selectedValue);
          this.Selected.emit(this);
        }
      }
      this.supplierFiltredDataSource = this.supplierDataSource.slice(0);
      if (this.isNewBe && !this.type && !this.itemForm.controls['IdTiers'].value) {
        const listOfTiers = this.supplierDataSource.filter(x => x.IdTypeTiers === 3);
        if (listOfTiers.length > 0) {
          if (listOfTiers && listOfTiers.length > 0) {
            this.itemForm.controls['IdTiers'].setValue(listOfTiers[0].Id);
            this.onSelect(this);
          }
        }
      }
      if (this.listTiers) {
        this.supplierFiltredDataSource = this.supplierFiltredDataSource.filter(x => this.listTiers.includes(x.Id));
      }
    });
  }

  /**
   * filter by name
   * @param value
   */
  handleFilter(value: string) {
    this.filterString = value;
    this.filterString = this.filterString ? this.filterString.replace(/\s+/g,'') : this.filterString;
    
    this.supplierFiltredDataSource = this.supplierDataSource.filter((s) =>
      s.Name.toLowerCase().includes(value.toLowerCase()) || s.CodeTiers.toLowerCase().includes(value.toLowerCase()) || ( s.IdPhoneNavigation != null && s.IdPhoneNavigation.Number.toString().includes(this.filterString.toLowerCase()) || (s.CIN != null && s.CIN.toString().includes(value.toLowerCase())))
      || (s.Vehicle.length > 0 && s.Vehicle.find(x=> x.RegistrationNumber.split(' ').join('').toLowerCase().includes(value.split(' ').join('').toLowerCase()))));
    if (this.listTiers) {
      this.supplierFiltredDataSource = this.supplierFiltredDataSource.filter(x => this.listTiers.includes(x.Id));
    }
  }

  addNew() {
    let modalTitle: string;
    switch (+this.type) {
      case TiersConstants.SUPPLIER_TYPE:
        modalTitle = TranslationKeysConstant.ADD_SUPPIER;
        break;
      case TiersConstants.CUSTOMER_TYPE:
        modalTitle = TranslationKeysConstant.ADD_CUSTOMER;
        break;
      default:
        modalTitle = TranslationKeysConstant.ADD_CUSTOMER_SUPPLIER;
        break;
    }
    this.tecDocSupplierDetails = {
      Type: this.type,
      Name: this.TecDocSupp ? this.TecDocSupp : this.filterString,
      tiersAccount: TiersAccountsResolverService
    };
    if (this.isInGrid) {
      // notice the grid to treat the add event
      this.addClickedSupplier.emit(this.tecDocSupplierDetails);
    } else {
      this.formModalDialogService.openDialog(modalTitle, AddTiersComponent,
        this.viewRef, this.closeModal.bind(this), this.tecDocSupplierDetails, null, SharedConstant.MODAL_DIALOG_SIZE_XXL);
    }
  }

  closeModal() {
    this.initDataSource(true);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes[ProjectConstant.TIERS_TO_ID_PROJECT]) {
      this.idProject = changes[ProjectConstant.TIERS_TO_ID_PROJECT].currentValue;
      this.initDataSource();
    } else if (changes[ID_TIER] && !this.isForAddProduct && !this.isSwhoOnlySelected) {
      this.initDataSource();
    }
  }

  get IdTiers(): FormGroup {
    return this.itemForm.get(ComponentsConstant.ID_TIERS) as FormGroup;
  }


  /**
   * focusOnTiersSelect
   */
  public focusOnTiersSelect() {
    this.IdTiersEl.focus();
  }

  private isDropDownExist(): any {
    let tiersDropDownDom: any;
    if (!this.focusElementOnInit) {
      tiersDropDownDom = document.getElementsByName('IdTiers')[0] as any;
    } else {
      tiersDropDownDom = document.getElementsByName('IdTiers')[1] as any;
    }
    if (tiersDropDownDom && this.focusElement) {
      return tiersDropDownDom;
    } else {
      return null;
    }
  }

  ngAfterViewInit(): void {
    const tiersDropDownDom = this.isDropDownExist();
    if (!isNullOrUndefined(tiersDropDownDom) &&
      (document.getElementsByClassName('k-dropdown-wrap k-state-default')[1])) {
      const tiersDropDown = tiersDropDownDom.getElementsByClassName('k-input')[0] as any;
      tiersDropDown.focus();
    }
  }

  public onFocus(event): void {
    this.Focused.emit(event);
    if (!this.fromSwalWarningEvent) {
      this.IdTiersEl.toggle(true);
    }
    this.fromSwalWarningEvent = false;
  }

  goToProfile() {
    let tiersUrl;
    if (isNotNullOrUndefinedAndNotEmptyValue(this.type)) {
      tiersUrl = this.getProfileUrlByType(this.type);
    } else if (isNotNullOrUndefinedAndNotEmptyValue(this.getSelectedValueType())) {
      tiersUrl = this.getProfileUrlByType(this.getSelectedValueType());
    }
    return tiersUrl;
  }

  public getProfileUrlByType(type) {
    switch (+type) {
      case TiersConstants.SUPPLIER_TYPE:
        return TiersConstants.SUPPLIER_PROFILE_URL;
      case TiersConstants.CUSTOMER_TYPE:
        return TiersConstants.CUSTOMER_PROFILE_URL;
      default:
        return;
    }
  }

  private getSelectedValueType() {
    if (this.supplierFiltredDataSource && this.IdTiers.value) {
      const selectedTier = this.supplierFiltredDataSource.find((tier) => tier.Id === this.IdTiers.value);
      if (isNotNullOrUndefinedAndNotEmptyValue(selectedTier)) {
        return selectedTier.IdTypeTiers;
      }
    }
  }

  public isCustomerOrSupplier(): boolean {
    const typeId = this.getSelectedValueType();
    if (isNotNullOrUndefinedAndNotEmptyValue(typeId)) {
      return (typeId && (typeId === TiersConstants.SUPPLIER_TYPE || typeId === TiersConstants.CUSTOMER_TYPE));
    }
  }

  public initCheckboxDropdownMode() {
    if (this.isCheckboxMode) {
      this.dropdownSettings = {
        singleSelection: !this.isMultiSelect,
        idField: ComponentsConstant.ID,
        textField: TiersConstants.NAME,
        selectAllText: this.translate.instant(ComponentsConstant.SELECT_ALL),
        unSelectAllText: this.translate.instant(ComponentsConstant.DESELECT_ALL),
        itemsShowLimit: this.limitSelection ? this.limitSelection : NumberConstant.THREE,
        allowSearchFilter: this.ShowFilter
      };
    }
  }
  onItemSelect($event) {
    const listSelected = this.supplierDataSource.filter((s) =>
      this.selectedValueMultiSelect.map(x => x.Id).includes(s.Id));
    this.selectedValuesCheckbox.emit(listSelected);
  }
  /**
   * select all items
   * @param $event
   */
  onSelectAll($event) {
    const listSelected = this.supplierDataSource;
    this.selectedValuesCheckbox.emit(listSelected);
  }
 
  onDeSelectAll($event) { 
    this.selectedValuesCheckbox.emit([]);
  }

  public resetTiersComboBox() {
    this.supplierComboBox.reset();
    this.supplierFiltredDataSource = this.supplierDataSource.slice(0);
  }

  get ListTiers(): FormControl {
    return this.itemForm.get(ComponentsConstant.LIST_TIERS) as FormControl;
  }
}
