import {FormControl, FormGroup} from '@angular/forms';
import {Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef} from '@angular/core';
import {SubFamilyService} from '../../../inventory/services/sub-family/sub-family.service';
import {Filter, Operation, OrderBy, OrderByDirection, PredicateFormat} from '../../utils/predicate';
import {ItemConstant} from '../../../constant/inventory/item.constant';
import {AddSubFamilyComponent} from '../../../inventory/components/add-sub-family/add-sub-family.component';
import {FormModalDialogService} from '../../services/dialog/form-modal-dialog/form-modal-dialog.service';
import {ReducedSubFamily} from '../../../models/inventory/reduced-sub-family.model';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {ComboBoxComponent} from '@progress/kendo-angular-dropdowns';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';

const SUB_FAMILY_COMBOBOX = 'subfamily';

@Component({
  selector: 'app-sub-family-combo-box',
  templateUrl: './sub-family-combo-box.component.html',
  styleUrls: ['./sub-family-combo-box.component.scss']
})
export class SubFamilyComboBoxComponent implements OnInit {
  @Input() itemForm: FormGroup;
  @Input() allowCustom;
  @Input() disabled: boolean;
  predicate: PredicateFormat;
  isDisabledSubFamily = true;
  public selectedSubFamily: ReducedSubFamily;
  public selectedSubFamilySource: ReducedSubFamily;
  public subFamilyDataSource: ReducedSubFamily[];
  public subFamilyFiltredDataSource: ReducedSubFamily[];
  idFamily: number;
  @Input() forSearch: boolean;
  @ViewChild(SUB_FAMILY_COMBOBOX) public subfamilyComboBox: ComboBoxComponent;
  @Output() Selected = new EventEmitter<any>();
  /**
   * permissions
   */
  public hasAddSubFamilyPermission : boolean;
  constructor(private subFamilyService: SubFamilyService,
              private formModalDialogService: FormModalDialogService,
              private viewRef: ViewContainerRef, private authService: AuthService) {
  }

  ngOnInit() {
    this.hasAddSubFamilyPermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.ADD_SUBFAMILY);
  }

  preparePredicate(value): void {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    this.predicate.OrderBy = new Array<OrderBy>();
    this.predicate.Filter.push(new Filter(ItemConstant.IdFamily, Operation.eq, value));
    this.predicate.OrderBy.push(new OrderBy( ItemConstant.LABEL,OrderByDirection.asc));
  }

  initDataSource(value, isFromEditItem=false): void {
    if (!value && !this.idFamily) {
      this.isDisabledSubFamily = true;
    } else {
      // initialize filter value
      if (this.idFamily && !value) {
        value = this.idFamily;
      } else {
        this.idFamily = value;
      }
      this.idFamily = value;
      this.preparePredicate(value);
      this.subFamilyService.readDropdownPredicateData(this.predicate).subscribe(data => {
        this.isDisabledSubFamily = false;
        this.subFamilyDataSource = data;
        this.subFamilyFiltredDataSource = this.subFamilyDataSource.slice(0);
      });
    }
    if (this.itemForm && !isFromEditItem) {
      this.itemForm.get(ItemConstant.IdSubFamily).reset();
    }
  }

  /**
   * filter by code and label
   * @param value
   */
  handleFilter(value: string): void {
    this.subFamilyFiltredDataSource = this.subFamilyDataSource.filter((s) => s.Label.toLocaleLowerCase().includes(value.toLowerCase()));
  }

  /**
   * on change
   * @param $event
   */
  handleChange($event): void {
    this.selectedSubFamilySource = this.subFamilyFiltredDataSource.find(x => x.Id === $event);
    this.subFamilyFiltredDataSource = this.subFamilyDataSource.slice(0);
    this.Selected.emit($event);
  }

  /**
   * Save subFamily
   */
  addNew(): void {
    const modalTitle = ItemConstant.ADD_SUB_FAMILY;
    this.formModalDialogService.openDialog(modalTitle, AddSubFamilyComponent,
      this.viewRef, this.close.bind(this),
      this.idFamily, true, SharedConstant.MODAL_DIALOG_SIZE_M);
  }

  get IdSubFamily(): FormControl {
    return this.itemForm.get(ItemConstant.IdSubFamily) as FormControl;
  }

  public openComboBox() {
    this.subfamilyComboBox.toggle(true);
  }
  public close(data) {
    if (data && data.data) {
      this.subFamilyDataSource = data.data;
        this.subFamilyFiltredDataSource = this.subFamilyDataSource.slice(NumberConstant.ONE);
    this.IdSubFamily.setValue(data.data[data.total - NumberConstant.ONE].Id);
  }
    }
}
