import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {SwalWarring} from '../../shared/components/swal/swal-popup';
import {MailingConstant} from '../../constant/mailing/mailing.constant';
import {SharedConstant} from '../../constant/shared/shared.constant';

@Injectable()
export class GenericMailingService {

  /**
   * @param translate
   * @param swalWarrings
   */
  constructor(private translate: TranslateService, private swalWarrings: SwalWarring) {
  }


  handleCanDeactivateToLeaveCurrentComponent(checkIfFormGroupComponentHasChanged: Function) {
    if (this.isOperationInProgress(checkIfFormGroupComponentHasChanged)) {
      return this.getModalResponseToLeaveCurrentComponent();
    }
    return true;
  }

  openModalToConfirmSwitchingToAnotherOperationType(): any {
    const swalWarningMessage = `${this.translate.instant(MailingConstant.CURRENT_OPERATION_HAS_NOT_BEEN_COMPLETED_YET)}`;
    return this.swalWarrings.CreateSwal(swalWarningMessage, MailingConstant.ARE_YOU_SURE_TO_LEAVE_THE_OPERATION_WITHOUT_BEING_COMPLETED,
      SharedConstant.YES, SharedConstant.NO);
  }

  isOperationInProgress(checkIfFormGroupComponentHasChanged: Function): boolean {
    return this.isFormGroupDataChanged(checkIfFormGroupComponentHasChanged);
  }

  private isFormGroupDataChanged(isFormGroupDataChanged: Function): boolean {
    return isFormGroupDataChanged();
  }

  getModalResponseToLeaveCurrentComponent(): Promise<boolean> {
    return new Promise(resolve => {
      let canDeactivate = false;
      this.openModalToConfirmSwitchingToAnotherOperationType().then((result) => {
        if (result.value) {
          canDeactivate = true;
        }
        resolve(canDeactivate);
      });
    });
  }
}
