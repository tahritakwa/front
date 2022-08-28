import { Component, OnInit, Input, ComponentRef } from '@angular/core';
import { Settlement } from '../../../models/payment/settlement.model';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { TiersConstants } from '../../../constant/purchase/tiers.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { LanguageService } from '../../../shared/services/language/language.service';
import {LocalStorageService} from '../../../login/Authentification/services/local-storage-service';

@Component({
  selector: 'app-show-detail-settlement',
  templateUrl: './show-detail-settlement.component.html',
  styleUrls: ['./show-detail-settlement.component.scss']
})
export class ShowDetailSettlementComponent implements OnInit, IModalDialog {

  payment: any;
  format = 'dd/MM/yyyy';
  precision: number;
  language: string;
  constructor(private localStorageService : LocalStorageService) {
    this.language = this.localStorageService.getLanguage();

  }

  ngOnInit() {
  }
  /**
   * mode modal init
   * @param reference
   * @param options
   */
  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.payment = options.data;
    this.precision = this.payment.IdTiersNavigation.IdTypeTiers === TiersConstants.CUSTOMER_TYPE ?
      this.payment.IdUsedCurrencyNavigation.Precision :
      this.payment.IdUsedCurrencyNavigation.Precision;

  }
}
