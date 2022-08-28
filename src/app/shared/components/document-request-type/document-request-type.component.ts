import { Component, OnInit, ComponentRef } from '@angular/core';
import { PagerSettings } from '@progress/kendo-angular-grid';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { PredicateFormat } from '../../utils/predicate';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { State } from '@progress/kendo-data-query';
import { ColumnSettings } from '../../utils/column-settings.interface';
import { GridSettings } from '../../utils/grid-settings.interface';
import { DocumentRequestTypeService } from '../../../payroll/services/document-request-type/document-request-type.service';
import { SwalWarring } from '../swal/swal-popup';
import { ValidationService } from '../../services/validation/validation.service';
import { DocumentRequestType } from '../../../models/payroll/document-request-type.model';
import { Subject } from 'rxjs/Subject';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { DocumentRequestConstant } from '../../../constant/payroll/document-request.constant';

@Component({
  selector: 'app-document-request-type',
  templateUrl: './document-request-type.component.html',
  styleUrls: ['./document-request-type.component.scss']
})
export class DocumentRequestTypeComponent implements OnInit {
// pager settings
pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
public predicate: PredicateFormat;
public documentRequestTypeFormGroup: FormGroup;
private editedRowIndex: number;
/**
 * Is modal or not
 */
public isModal = false;
/**
 * Data sent by the calling component
 */
private data: any;

/*
  * dialog subject
  */
 dialogOptions: Partial<IModalDialogOptions<any>>;
 reference: ComponentRef<IModalDialog>;
 public closeDialogSubject: Subject<any>;

public gridState: State = {
  skip: 0,
  take: 5,
  // Initial filter descriptor
  filter: {
    logic: 'and',
    filters: []
  }
};

public columnsConfig: ColumnSettings[] = [
  {
    field: DocumentRequestConstant.CODE,
    title: DocumentRequestConstant.CODE_UPPERCASE,
    filterable: true
  },
  {
    field: DocumentRequestConstant.LABEL,
    title: DocumentRequestConstant.LABEL_UPPERCASE,
    filterable: true
  }
];
public gridSettings: GridSettings = {
  state: this.gridState,
  columnsConfig: this.columnsConfig,
};

constructor(public documentRequestTypeService: DocumentRequestTypeService,
  private swalWarrings: SwalWarring, private validationService: ValidationService) { }

ngOnInit() {
  this.initGridDataSource();
}

  /**
  * Inialise Modal
  * @param reference
  * @param options
  */
 dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
  this.isModal = true;
  this.dialogOptions = options;
  this.data = options.data;
  this.closeDialogSubject = options.closeDialogSubject;
}

initGridDataSource() {
  this.documentRequestTypeService.reloadServerSideData(this.gridSettings.state, this.predicate)
    .subscribe(data => {
      this.gridSettings.gridData = data;
    }
    );
}

/**
 * Ann new row in grid for add new Cnss type
 * @param param0
 */
public addHandler({ sender }) {
  this.closeEditor(sender);
  this.documentRequestTypeFormGroup = new FormGroup({
    Code: new FormControl('', Validators.required),
    Label: new FormControl('', Validators.required)
  });
  sender.addRow(this.documentRequestTypeFormGroup);
}
/**
 * Cancel the add or update of new Cnss type
 * @param param0
 */
public cancelHandler({ sender, rowIndex }) {
  this.closeEditor(sender, rowIndex);
}

/**
 * Remove an item of Cnss type
 * @param param
 */
public removeHandler({ dataItem }) {
  this.swalWarrings.CreateSwal().then((result) => {
    if (result.value) {
      this.documentRequestTypeService.remove(dataItem).subscribe(() => {
        this.initGridDataSource();
      });
    }
  });
}
/**
 * Close the editor
 * @param grid
 * @param rowIndex
 */
private closeEditor(grid, rowIndex = this.editedRowIndex) {
  grid.closeRow(rowIndex);
  this.editedRowIndex = undefined;
  this.documentRequestTypeFormGroup = undefined;
}
/**
 * Save the new Cnss type
 * @param param
 */
public saveHandler({ sender, rowIndex, formGroup, isNew }) {
  if ((formGroup as FormGroup).valid) {
    const documentRequestType: DocumentRequestType = formGroup.value;
    this.documentRequestTypeService.save(documentRequestType, isNew, this.predicate).subscribe(() => {
      this.initGridDataSource();
    });
    sender.closeRow(rowIndex);
  } else {
    this.validationService.validateAllFormFields(formGroup as FormGroup);
  }
}
/**
 * Edit the column on which the user clicked
 * @param param
 */
public editHandler({ sender, rowIndex, dataItem }) {
  this.closeEditor(sender);
  this.documentRequestTypeFormGroup = new FormGroup({
    Id: new FormControl(dataItem.Id),
    Code: new FormControl(dataItem.Code, Validators.required),
    Label: new FormControl(dataItem.Label, Validators.required)
  });
  this.editedRowIndex = rowIndex;
  sender.editRow(rowIndex, this.documentRequestTypeFormGroup);
}

}
