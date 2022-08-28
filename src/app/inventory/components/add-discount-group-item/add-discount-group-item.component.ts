import { Component, OnInit, ComponentRef } from '@angular/core';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { PagerSettings, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { PredicateFormat } from '../../../shared/utils/predicate';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { ItemConstant } from '../../../constant/inventory/item.constant';
import { DiscountGroupItemService } from '../../../administration/services/discount-group-item/discount-group-item-service';
import { DiscountGroupItem } from '../../../models/inventory/discount-group-item.model';


@Component({
  selector: 'app-add-discount-group-item',
  templateUrl: './add-discount-group-item.component.html',
  styleUrls: ['./add-discount-group-item.component.scss']
})
export class AddDiscountGroupItemComponent implements OnInit {

  /*
   * dialog subject
   */
  dialogOptions: Partial<IModalDialogOptions<any>>;
  public optionDialog: Partial<IModalDialogOptions<any>>;
  /**
   * Form Group
   */
  discountGroupItemFormGroup: FormGroup;
  // pager settings
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  // predicate
  public predicate: PredicateFormat;
  /**
  * Grid state
  */
  public gridState: DataSourceRequestState = {
    skip: 0,
    take: 10,
    filter: { // Initial filter descriptor
      logic: 'and',
      filters: []
    }
  };

  /**
   * Grid columns
   */
  public columnsConfig: ColumnSettings[] = [
    {
      field: ItemConstant.CODE,
      title: ItemConstant.CODE_UPPERCASE,
      filterable: true,
    },
    {
      field: ItemConstant.LABEL,
      title: ItemConstant.LABEL_UPPERCASE,
      filterable: false
    }
  ];

  // Grid settings
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };
  // Edited Row index
  private editedRowIndex: number;
  private editedRow: DiscountGroupItem;
  public rowIndex ;

  constructor(private discountGroupItemService: DiscountGroupItemService,
    private fb: FormBuilder,
    private validationService: ValidationService,
    private swalWarrings: SwalWarring) { }

  ngOnInit() {
    this.initGridDataSource();
  }


  /**
   * Inialise Modal
   * @param reference
   * @param options
   */
  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.dialogOptions = options;
  }
  /**
   * init grid data
   */
  initGridDataSource() {
    this.discountGroupItemService.reloadServerSideData(this.gridSettings.state, this.predicate)
      .subscribe(data => {
        this.gridSettings.gridData = data;
      });
  }

  /**
 * Prepare Predicate
 */
  public preparePredicate(): void {
    throw new Error('Method not implemented.');
  }
  /**
   * Remove handler
   * @param param0
   */
  public removeHandler({ dataItem }) {
    this.swalWarrings.CreateSwal().then((result) => {
      if (result.value) {
        this.discountGroupItemService.remove(dataItem).subscribe(() => {
          this.initGridDataSource();
        });
      }
    });
  }
  /**
  * Quick add
  * @param param0
  */
  public addHandler({ sender }) {
    this.closeEditor(sender);
    this.discountGroupItemFormGroup = new FormGroup({
      Code: new FormControl('', Validators.required),
      Label: new FormControl('', Validators.required)
    });
    sender.addRow(this.discountGroupItemFormGroup);
    this.rowIndex = -1 ;

  }
  /**
* Quick edit
* @param param0
*/
  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    this.discountGroupItemFormGroup = this.fb.group({
      Id: [dataItem.Id],
      Code: [dataItem.Code, Validators.required],
      Label: [dataItem.Label, Validators.required]
    });
    this.editedRowIndex = rowIndex;
    this.editedRow = dataItem;
    sender.editRow(rowIndex, this.discountGroupItemFormGroup);
  }
  /**
 * Save handler
 * @param param0
 */
  public saveHandler({ sender, rowIndex, formGroup, isNew }) {
    if ((formGroup as FormGroup).valid) {
      let discountGroupItem: DiscountGroupItem;
      if (this.editedRow) {
        Object.assign(this.editedRow, formGroup.getRawValue());
        discountGroupItem = this.editedRow;
      } else {
        discountGroupItem = formGroup.getRawValue();
      }
      this.discountGroupItemService.save(discountGroupItem, isNew).subscribe(() => {
        this.initGridDataSource();
      });
      sender.closeRow(rowIndex);
    } else {
      this.validationService.validateAllFormFields(formGroup as FormGroup);
    }
  }

  /**
 * Cancel
 * @param param0
 */
  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }

  /**
  * Close editor
  * @param grid
  * @param rowIndex
  */
  private closeEditor(grid, rowIndex = this.editedRowIndex) {
    if (rowIndex !== undefined) {
      grid.closeRow(rowIndex);
      this.editedRowIndex = undefined;
      this.editedRow = undefined;
      this.discountGroupItemFormGroup = undefined;
    }
    if (this.rowIndex !== undefined) {
      grid.closeRow(rowIndex);
      this.editedRowIndex = undefined;
      this.editedRow = undefined;
      this.discountGroupItemFormGroup = undefined;
      this.rowIndex = undefined ;
    }
  }
  /**
  * Data changed listener
  * @param state
  */
  public dataStateChange(state: DataStateChangeEvent): void {
    this.gridSettings.state = state;
    this.discountGroupItemService.reloadServerSideData(state).subscribe(data => this.gridSettings.gridData = data);

  }

}
