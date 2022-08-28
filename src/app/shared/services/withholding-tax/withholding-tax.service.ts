import { Injectable, Inject } from '@angular/core';
import { ResourceService } from '../resource/resource.service';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../../COM/config/app.config';
import { WithholdingTax } from '../../../models/payment/withholding-tax.model';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { TranslateService } from '@ngx-translate/core';
import { SwalWarring } from '../../components/swal/swal-popup';
import { AccountsConstant } from '../../../constant/accounting/account.constant';
@Injectable()
export class WithholdingTaxService extends ResourceService<WithholdingTax> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig,private translate: TranslateService,
  private swalWarrings: SwalWarring) {
    super(httpClient, appConfig, 'withholdingTax', 'WithholdingTax', 'Payment');
  }
  handleCanDeactivateToLeaveCurrentComponent(checkIfFormGroupComponentHasChanged: Function) {
    if (this.isOperationInProgress(checkIfFormGroupComponentHasChanged)) {
      return this.getModalResponseToLeaveCurrentComponent();
    }
    return true;
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
  openModalToConfirmSwitchingToAnotherOperationType(): any {
    const swalWarningMessage = `${this.translate.instant(AccountsConstant.CURRENT_OPERATION_HAS_NOT_BEEN_COMPLETED_YET)}`;
    return this.swalWarrings.CreateSwal(swalWarningMessage, AccountsConstant.ARE_YOU_SURE_TO_LEAVE_THE_OPERATION_WITHOUT_BEING_COMPLETED,
      SharedConstant.YES, SharedConstant.NO);
  }
  }
