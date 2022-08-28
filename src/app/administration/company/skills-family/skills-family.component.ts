import { Component, OnInit, ComponentRef } from '@angular/core';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { PagerSettings, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { SkillsFamily } from '../../../models/payroll/skills-family.model';
import { SkillsFamilyService } from '../../../payroll/services/skills-family/skills-family.service';
import { ValidationService, unique } from '../../../shared/services/validation/validation.service';
import { ModalDialogInstanceService } from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { SkillsFamilyConstant } from '../../../constant/payroll/skills-family.constant';

@Component({
  selector: 'app-skills-family',
  templateUrl: './skills-family.component.html',
  styleUrls: ['./skills-family.component.scss']
})
export class SkillsFamilyComponent implements OnInit {

  /*
   * dialog subject
   */
  dialogOptions: Partial<IModalDialogOptions<any>>;
  public optionDialog: Partial<IModalDialogOptions<any>>;
  /**
   * Form Group
   */
  skillsFamilyFormGroup: FormGroup;
  // pager settings
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
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
      field: SkillsFamilyConstant.CODE,
      title: SkillsFamilyConstant.CODE_UPPERCASE,
      filterable: true,
    },
    {
      field: SkillsFamilyConstant.LABEL,
      title: SkillsFamilyConstant.LABEL_UPPERCASE,
      filterable: true
    }
  ];

  // Grid settings
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };

  // Edited Row index
  private editedRowIndex: number;
  private editedRow: SkillsFamily;

  constructor(private skillsFamilyService: SkillsFamilyService,
    private fb: FormBuilder,
    private validationService: ValidationService,
    private modalService: ModalDialogInstanceService,
    private swalWarrings: SwalWarring) { }

  ngOnInit() {
    this.initGridDataSource();
  }
   /**
   * init grid data
   */
  initGridDataSource() {
    this.skillsFamilyService.reloadServerSideData(this.gridSettings.state)
      .subscribe(data => {
        this.gridSettings.gridData = data;
      });
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
   * Remove handler
   * @param param0
   */
  public removeHandler({ dataItem }) {
    this.swalWarrings.CreateSwal().then((result) => {
      if (result.value) {
        this.skillsFamilyService.remove(dataItem).subscribe(() => {
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
    this.skillsFamilyFormGroup = new FormGroup({
      Code: new FormControl('', Validators.required, unique(SkillsFamilyConstant.CODE, this.skillsFamilyService, String(0))),
      Label: new FormControl('', Validators.required , unique(SkillsFamilyConstant.LABEL, this.skillsFamilyService, String(0)))

    });
    sender.addRow(this.skillsFamilyFormGroup);

  }
  /**
* Quick edit
* @param param0
*/
  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    this.skillsFamilyFormGroup = this.fb.group({
      Id: [dataItem.Id],
      Code: [dataItem.Code, Validators.required, unique(SkillsFamilyConstant.CODE, this.skillsFamilyService, String(dataItem.Id))],
      Label: [dataItem.Label, Validators.required, unique(SkillsFamilyConstant.LABEL, this.skillsFamilyService, String(dataItem.Id))],
    });
    this.editedRowIndex = rowIndex;
    this.editedRow = dataItem;
    sender.editRow(rowIndex, this.skillsFamilyFormGroup);
  }
  /**
 * Save handler
 * @param param0
 */
  public saveHandler({ sender, rowIndex, formGroup, isNew }) {
    if ((formGroup as FormGroup).valid) {
      let skillsFamily: SkillsFamily;
      if (this.editedRow) {
        Object.assign(this.editedRow, formGroup.getRawValue());
        skillsFamily = this.editedRow;
      } else {
        skillsFamily = formGroup.getRawValue();
      }
      this.skillsFamilyService.save(skillsFamily, isNew).subscribe(() => {
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
      this.skillsFamilyFormGroup = undefined;
    }
  }
  /**
  * Data changed listener
  * @param state
  */
  public dataStateChange(state: DataStateChangeEvent): void {
    this.gridSettings.state = state;
    this.skillsFamilyService.reloadServerSideData(state).subscribe(data => this.gridSettings.gridData = data);

  }
}
