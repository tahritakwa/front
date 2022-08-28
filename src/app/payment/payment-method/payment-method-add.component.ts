import { Component, OnInit, ViewChild, ComponentRef, Input } from '@angular/core';
import { PagerSettings } from '@progress/kendo-angular-grid';
import { Router, ActivatedRoute } from '@angular/router';
import { SwalWarring } from '../../shared/components/swal/swal-popup';
import { PaymentConstant } from '../payment.constant';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ValidationService } from '../../shared/services/validation/validation.service';
import { GrowlService } from '../../../COM/Growl/growl.service';
import { TranslateService } from '@ngx-translate/core';
import { DetailsSettlementModeService } from '../services/payment-method/DetailsSettlementMode.service';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { PaymentMethodService } from '../services/payment-method/paymentMethod.service';
import { ModalDialogInstanceService } from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import { DataTransferService } from '../services/payment-method/data-transfer.service';

const ID = 'id';
const LOGIC_AND = 'and';
@Component({
  selector: 'app-add-payment-method',
  templateUrl: './payment-method-add.component.html',
  styleUrls: ['./payment-method-add.component.scss']
})
export class PaymentMethodAddComponent implements OnInit, IModalDialog {

  addPaymentFormGroup: FormGroup;
  isModal: boolean;

  // pager settings
  pagerSettings: PagerSettings = {
    buttonCount: 10, info: true, type: 'numeric', pageSizes: true, previousNext: true
  };

  constructor(private fb: FormBuilder, public paymentMethodService: PaymentMethodService, private swalWarrings: SwalWarring
    , private router: Router, private validationService: ValidationService, private translate: TranslateService,
    private growlService: GrowlService, private activatedRoute: ActivatedRoute, private dataTransferService: DataTransferService,
    private detailsSettlementModeService: DetailsSettlementModeService, private modalService: ModalDialogInstanceService) { }
  /**
   * create main form
   */
  private createAddForm(): void {
    this.addPaymentFormGroup = this.fb.group({
      Code: ['', Validators.required],
      MethodName: ['', [Validators.required]],
      Id: [0]
    });
  }

  ngOnInit() {
    this.createAddForm();
  }

  public save() {

    if (this.addPaymentFormGroup.valid) {
      // Add Mode
      this.paymentMethodService.save(this.addPaymentFormGroup.getRawValue(), true).subscribe(x => {
        this.modalService.closeAnyExistingModalDialog();
        this.dataTransferService.setStateStateModal(true);
      });
    } else {
      this.growlService.ErrorNotification(this.translate.instant(PaymentConstant.ERROR_SUM_PERCENTAGE));
    }
  }

  /**
 * mode modal init
 * @param reference
 * @param options
 */
  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.isModal = true;
  }
}
