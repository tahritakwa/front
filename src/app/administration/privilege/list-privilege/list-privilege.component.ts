import { Component, OnInit } from '@angular/core';
import { State } from '@progress/kendo-data-query';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { PrivilegUserConstant } from '../../../constant/Administration/privilege-user.constant';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { PrivilegeService } from '../../services/privilege/privilege.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { Privilege } from '../../../models/administration/privilege.model';
import { DataStateChangeEvent } from '@progress/kendo-angular-grid';

@Component({
  selector: 'app-list-privilege',
  templateUrl: './list-privilege.component.html',
  styleUrls: ['./list-privilege.component.scss']
})
export class ListPrivilegeComponent implements OnInit {

  private editedRowIndex: number;
  formGroup: FormGroup;

  gridState: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TWENTY,
    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: []
    }
  };

  columnsConfig: ColumnSettings[] = [
    {
      field: PrivilegUserConstant.PRIVILEGE_LABEL,
      title: PrivilegUserConstant.PRIVILEGE_LABEL_TITLE,
      filterable: true
    },
    {
      field: PrivilegUserConstant.PRIVILEGE_DESCRIPTION,
      title: PrivilegUserConstant.PRIVILEGE_DESCRIPTION_TITLE,
      filterable: true
    }
  ];

  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };

  private closeEditor(grid, rowIndex = this.editedRowIndex) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
  }

  constructor(public privilegeService: PrivilegeService, private validationService: ValidationService) { }

  ngOnInit() {
    this.getPrivileges();
  }

  getPrivileges() {
    this.privilegeService.reloadServerSideData(this.gridSettings.state).subscribe(result => {
      this.gridSettings.gridData = result;
    });
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    this.gridSettings.state = state;
    this.getPrivileges();
    }

  cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }

 saveHandler({sender, rowIndex, formGroup, isNew}) {
    if ((formGroup as FormGroup).valid) {
      const privilege: Privilege = formGroup.value;
      this.privilegeService.save(privilege, false).subscribe(() => {
        this.getPrivileges();
      });
    sender.closeRow(rowIndex);
    } else {
      this.validationService.validateAllFormFields(formGroup as FormGroup);
    }
  }

  editHandler({sender, rowIndex, dataItem}) {
    this.closeEditor(sender);
    this.formGroup = new FormGroup({
      Id: new FormControl(dataItem.Id),
      Label: new FormControl(dataItem.Label,  Validators.required),
      Description: new FormControl(dataItem.Description),
      Reference: new FormControl(dataItem.Reference)
    });
    this.editedRowIndex = rowIndex;
    sender.editRow(rowIndex, this.formGroup);
  }
}
