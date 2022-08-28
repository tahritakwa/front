import { Component, OnInit, ComponentRef } from '@angular/core';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { ValidationService } from '../../services/validation/validation.service';
import { ModalDialogInstanceService } from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import { GridSettings } from '../../utils/grid-settings.interface';
import { ColumnSettings } from '../../utils/column-settings.interface';
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { PagerSettings, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { PredicateFormat, Relation } from '../../utils/predicate';
import { SwalWarring } from '../swal/swal-popup';
import { ComponentsConstant } from '../../../constant/shared/components.constant';
import { DiscountGroupTiersService } from '../../../administration/services/discount-group-tiers/discount-group-tiers.service';
import {DiscountGroupTiers} from '../../../models/administration/discount-group-tiers.model';


@Component({
  selector: 'app-add-discount-group-tiers',
  templateUrl: './add-discount-group-tiers.component.html',
  styleUrls: ['./add-discount-group-tiers.component.scss']
})
export class AddDiscountGroupTiersComponent implements OnInit {

  /*
   * dialog subject
   */
  dialogOptions: Partial<IModalDialogOptions<any>>;
  public optionDialog: Partial<IModalDialogOptions<any>>;
  /**
   * Form Group
   */
  discountGroupTiersFormGroup: FormGroup;
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
      field: ComponentsConstant.CODE,
      title: ComponentsConstant.CODE_UPPERCASE,
      filterable: true,
    },
    {
      field: ComponentsConstant.LABEL,
      title: ComponentsConstant.LABEL_UPPERCASE,
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
    private editedRow: DiscountGroupTiers;
    public rowIndex ;
    constructor(private discountGroupTiersService: DiscountGroupTiersService, private fb: FormBuilder, private validationService: ValidationService,
        private modalService: ModalDialogInstanceService, private swalWarrings: SwalWarring) { }

    ngOnInit() {
      //this.preparePredicate();
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
      this.discountGroupTiersService.reloadServerSideData(this.gridSettings.state, this.predicate)
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
            this.discountGroupTiersService.remove(dataItem).subscribe(() => {
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
          this.discountGroupTiersFormGroup = new FormGroup({
            Code: new FormControl('', Validators.required),
            Label: new FormControl('', Validators.required)
          });
          sender.addRow(this.discountGroupTiersFormGroup);
          this.rowIndex = -1 ; 

      }
        /**
   * Quick edit
   * @param param0
   */
  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    this.discountGroupTiersFormGroup = this.fb.group({
      Id: [dataItem.Id],
      Code: [dataItem.Code, Validators.required],
      Label: [dataItem.Label, Validators.required]
    });
    this.editedRowIndex = rowIndex;
    this.editedRow = dataItem;
    sender.editRow(rowIndex, this.discountGroupTiersFormGroup);
  }
      /**
     * Save handler
     * @param param0
     */
      public saveHandler({ sender, rowIndex, formGroup, isNew }) {
        if ((formGroup as FormGroup).valid) {
          let discountGroupTiers: DiscountGroupTiers;
          if (this.editedRow) {
            Object.assign(this.editedRow, formGroup.getRawValue());
            discountGroupTiers = this.editedRow;
          } else {
            discountGroupTiers = formGroup.getRawValue();
          }
          this.discountGroupTiersService.save(discountGroupTiers, isNew).subscribe(() => {
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
        this.discountGroupTiersFormGroup = undefined;
      }
      if (this.rowIndex !== undefined) {
        grid.closeRow(rowIndex);
        this.editedRowIndex = undefined;
        this.editedRow = undefined;
        this.discountGroupTiersFormGroup = undefined;
        this.rowIndex = undefined ;
      }
  }
  /**
  * Data changed listener
  * @param state
  */
    public dataStateChange(state: DataStateChangeEvent): void {
      this.gridSettings.state = state;
      this.discountGroupTiersService.reloadServerSideData(state).subscribe(data => this.gridSettings.gridData = data);

    }

}
