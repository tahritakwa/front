import { FormGroup, FormControl } from '@angular/forms';
import {Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef} from '@angular/core';
import { SubModelService } from '../../../inventory/services/sub-model/sub-model.service';
import { SubModel } from '../../../models/inventory/sub-model.model';
import { PredicateFormat, Operation, Filter, OrderBy, OrderByDirection } from '../../utils/predicate';
import { ItemConstant } from '../../../constant/inventory/item.constant';
import { FormModalDialogService } from '../../services/dialog/form-modal-dialog/form-modal-dialog.service';
import { AddSubModelComponent } from '../../../inventory/components/add-sub-model/add-sub-model.component';
import { ReducedSubModel } from '../../../models/inventory/reduced-sub-model.model';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import {ComboBoxComponent} from '@progress/kendo-angular-dropdowns';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';

@Component({
  selector: 'app-sub-model-combo-box',
  templateUrl: './sub-model-combo-box.component.html',
  styleUrls: ['./sub-model-combo-box.component.scss']
})
export class SubModelComboBoxComponent implements OnInit {
  @Input() itemForm: FormGroup;
  @Input() allowCustom;
  @Input() disabled: boolean;
  isCardMode: boolean;
  predicate: PredicateFormat;
  isDisabledSubModel = true;
  public selectedSubModel: ReducedSubModel;
  public selectedSubModelSource: ReducedSubModel;
  public subModelDataSource: ReducedSubModel[];
  public subModelFiltredDataSource: ReducedSubModel[];
  @Input() forSearch: boolean;
  @Output() Selected = new EventEmitter<boolean>();
  @ViewChild(ComboBoxComponent)public subModelComboBoxComponent: ComboBoxComponent;
  idModel: number;
  /**
   * permissions
   */
  public hasAddSubModelPermission : boolean;
  constructor(private subModelService: SubModelService,
    private formModalDialogService: FormModalDialogService,
    private viewRef: ViewContainerRef, private authService: AuthService) { }

  ngOnInit() {
    this.subModelService.getResult().subscribe((data) => {
      if (data.value === true) {
        this.isCardMode = data.data === true;
      }
    });
  }
  preparePredicate(value): void {
    this.hasAddSubModelPermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.ADD_SUBMODEL);
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Filter.push(new Filter(ItemConstant.ID_MODEL, Operation.eq, value));
    this.predicate.OrderBy = new Array<OrderBy>();
    this.predicate.OrderBy.push(new OrderBy( ItemConstant.LABEL,OrderByDirection.asc));
  }
  initDataSource(value): void {
    if (!value && !this.idModel) {
      this.isDisabledSubModel = true;
    }
    else {
      // initialize filter value
      if (this.idModel && !value) {
        value = this.idModel;
      } else {
        this.idModel = value;
      }
      this.preparePredicate(value);
      this.subModelService.readDropdownPredicateData(this.predicate).subscribe(data => {
        this.isDisabledSubModel = false;
        this.subModelDataSource = data;
        this.subModelFiltredDataSource = this.subModelDataSource.slice(0);
      });
    }
    if (this.itemForm) {
      this.itemForm.get(ItemConstant.IdSubModel).reset();
    }
  }
  /**
   * filter by code and label
   * @param value
   */
  handleFilter(value: string): void {
    this.subModelFiltredDataSource = this.subModelDataSource.filter((s) =>
      s.Code.toLowerCase().includes(value.toLowerCase())
      || s.Label.toLocaleLowerCase().includes(value.toLowerCase()));
  }
  /**
  * on change
  * @param $event
  */
  handleChange($event): void {
    this.selectedSubModelSource = this.subModelFiltredDataSource.find(x => x.Id === $event);
    this.subModelFiltredDataSource = this.subModelDataSource.slice(0);
    this.Selected.emit($event);
  }
  // add new subModel
  addNew(): void {
    const modalTitle = ItemConstant.CREATE_SUB_MODEL;
    this.formModalDialogService.openDialog(modalTitle, AddSubModelComponent,
      this.viewRef, this.close.bind(this),
      this.idModel, true, SharedConstant.MODAL_DIALOG_SIZE_M);
  }
  get IdSubModel(): FormControl {
    return this.itemForm.get(ItemConstant.IdSubModel) as FormControl;
  }
  public close(data) {
    if (data && data.data) {
      this.subModelDataSource = data.data;
      this.subModelFiltredDataSource = this.subModelDataSource.slice(NumberConstant.ZERO);
      this.IdSubModel.setValue(data.data[data.total - NumberConstant.ONE].Id);
    }
  }
}
