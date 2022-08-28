import {Component, ComponentRef, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {IModalDialog, IModalDialogOptions} from 'ngx-modal-dialog';
import {ModalDialogInstanceService} from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import {MarkingEventItemsService} from '../../../services/markingEventsItems/marking-event-items.service';
import {HttpCrmErrorCodes} from '../../../http-error-crm-codes';
import {StatusConstant} from '../../../../constant/crm/status.constant';
import {CrmConstant} from '../../../../constant/crm/crm.constant';

@Component({
  selector: 'app-add-date-to-remember',
  templateUrl: './add-date-to-remember.component.html',
  styleUrls: ['./add-date-to-remember.component.scss']
})
export class AddDateToRememberComponent implements OnInit, IModalDialog {
  public addFormGroup: FormGroup;
  public optionDialog: Partial<IModalDialogOptions<any>>;
  public isUniqueName = true;

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.optionDialog = options;

  }


  /***
   *
   * @param fb
   * @param markingEventItemsService
   * @param modalService
   */
  constructor(private fb: FormBuilder,
              private markingEventItemsService: MarkingEventItemsService,
              private modalService: ModalDialogInstanceService) {
  }

  ngOnInit() {
    this.creatAddFormGroup();
  }

  private creatAddFormGroup() {
    this.addFormGroup = this.fb.group({
      name: new FormControl('', Validators.required),
      description: new FormControl('')
    });
  }

  public onInputAddLeave() {
    const value = this.addFormGroup.controls['name'].value;
    this.checkNameUnicity(value);
  }

  private checkNameUnicity(name: string) {
    this.markingEventItemsService.getUnicity('name', name, CrmConstant.INSERTED_ELEMENT).subscribe((data: any) => {
      if (data.errorCode === HttpCrmErrorCodes.EVENT_ITEM_ALREADY_USED) {
        this.isUniqueName = false;
        this.addFormGroup.controls['name'].setErrors({'incorrect': true});
      } else if (data === true) {
        this.isUniqueName = true;
        this.addFormGroup.controls['name'].setErrors(null);
      }
    });
  }

  public setNameFCDefaultValidator() {
    this.isUniqueName = true;
  }

  public onBackToListOrCancel(name?) {
    this.optionDialog.data = name;
    this.optionDialog.onClose();
    this.modalService.closeAnyExistingModalDialog();
  }

  public save() {
    if (this.addFormGroup.valid) {
      const dateToRem = this.addFormGroup.value;
      this.markingEventItemsService.getJavaGenericService().saveEntity(dateToRem).subscribe((data) => {
        if (data && data.id) {
          this.onBackToListOrCancel(data.name);
        }
      });
    }
  }
}
