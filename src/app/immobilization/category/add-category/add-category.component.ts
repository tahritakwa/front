import { Component, OnInit, ComponentRef, Injector } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { IModalDialog, IModalDialogOptions, ModalDialogService } from 'ngx-modal-dialog';

import { ModalDialogInstanceService } from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { Category } from '../../../models/immobilization/category.model';
import { CategoryService } from '../../services/category/category.service';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { ImmobilizationType } from '../../../models/enumerators/immobilization-type.enum';
import { KeyboardConst } from '../../../constant/keyboard/keyboard.constant';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent implements OnInit, IModalDialog {
  /*
 * Form Group
 */
  categoryFormGroup: FormGroup;
  public categoryData: Category[];

  // Edited Row index
  private editedRowIndex: number;

  public optionDialog: Partial<IModalDialogOptions<any>>;

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
      field: 'Code',
      title: 'CODE',
      filterable: true,
    },
    {
      field: 'Label',
      title: 'LABEL',
      filterable: true
    },
    {
      field: 'ImmobilisationType',
      title: 'IMMOBILIZATION_TYPE',
      filterable: true
    }
  ];

  // Grid settings
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };

  public selectedCategory: number;
  public isFromActif = true;

  constructor(private categoryService: CategoryService, private validationService: ValidationService,
    private swalWarrings: SwalWarring, private modalService: ModalDialogInstanceService,
    private injector: Injector) {

    document.addEventListener('keydown', (event) => {
      const keyName = event.key;
      /*escape keyboard click */
      if (keyName === KeyboardConst.ENTER) {
      }
    });
  }
  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.optionDialog = options;
  }
  /**
* Data changed listener
* @param state
*/
  public dataStateChange(state: DataStateChangeEvent): void {
    this.gridSettings.state = state;
    this.initGridDataSource();
  }
  /**
* Quick add
* @param param0
*/
  public addHandler({ sender }) {
    this.closeEditor(sender);
    this.categoryFormGroup = new FormGroup({
      Code: new FormControl('', Validators.required),
      Label: new FormControl('', Validators.required),
      ImmobilisationType: new FormControl(undefined, Validators.required)
    });
    sender.addRow(this.categoryFormGroup);

  }

  /**
* Remove handler
* @param param0
*/
  public removeHandler({ dataItem }) {
    this.swalWarrings.CreateSwal().then((result) => {
      if (result.value) {
        this.categoryService.remove(dataItem).subscribe(() => {
          this.initGridDataSource();
          const dynamicDepreciationAassetsConfigurationService = require('../../../accounting/services/configuration/accounting-configuration.service');
          this.injector.get(dynamicDepreciationAassetsConfigurationService.AccountingConfigurationService).getJavaGenericService()
            .deleteEntity(dataItem.Id).subscribe(() => {
             }, err => {
             });
        });
      }
    });
  }

  initGridDataSource() {
    this.categoryService.reloadServerSideData(this.gridSettings.state)
      .subscribe(data => {
        data.data.forEach(obj => {
          obj.ImmobilisationType = ImmobilizationType[obj.ImmobilisationType];
        });
        this.gridSettings.gridData = data;
      });
  }

  /**
 * Save handler
 * @param param0
 */
  public saveHandler({ sender, rowIndex, formGroup, isNew }) {
    if ((formGroup as FormGroup).valid) {
      const item: Category = formGroup.value;
      this.categoryService.save(item, isNew).subscribe(() => {
        this.initGridDataSource();
        sender.closeRow(rowIndex);
      });
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
      this.categoryFormGroup = undefined;
    }
  }

  /**
 * Quick edit
 * @param param0
 */
  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);

    this.categoryFormGroup = new FormGroup({
      Id: new FormControl(dataItem.Id),
      Code: new FormControl(dataItem.Code, Validators.required),
      Label: new FormControl(dataItem.Label, Validators.required),
      ImmobilisationType: new FormControl(dataItem.ImmobilisationType, Validators.required)
    });

    this.editedRowIndex = rowIndex;

    sender.editRow(rowIndex, this.categoryFormGroup);
  }

  /**
   * @param event
   */
  public selectRow(event: any) {
    this.selectedCategory = event.selectedRows[0].dataItem.Id;
  }

  public dbCellClick(): void {
    if (this.optionDialog) {
      this.optionDialog.data = this.selectedCategory;
      this.optionDialog.onClose();
    }
    this.modalService.closeAnyExistingModalDialog();
  }

  ngOnInit() {
    this.initGridDataSource();
  }

}
