import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { settlementStatusCode } from '../../../models/enumerators/settlement.enum';
import { DeadLineDocumentService } from '../../services/dead-line-document/dead-line-document.service';
import { SettlementConstant } from '../../../constant/payment/settlement.constant';
import { Settlement } from '../../../models/payment/settlement.model';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { FileInfo } from '../../../models/shared/objectToSend';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { DocumentEnumerator } from '../../../models/enumerators/document.enum';

@Component({
  selector: 'app-settlement',
  templateUrl: './settlement.component.html',
  styleUrls: ['./settlement.component.scss']
})
export class SettlementComponent implements OnInit {
  @Input() idTiers: number;
  @Input()  documentType: string;
  @Input() settlementAmount: number;
  @Input() formatOptions;
  @Output() settlementToSaveChange = new EventEmitter();

  public settlementAddFormGroup: FormGroup;
  public settlementToSave: Settlement;
  // Observation Files
  public attachmentFilesToUpload: Array<FileInfo>;
  constructor(private formBuilder: FormBuilder, private validationService: ValidationService,
    public deadLineDocumentService: DeadLineDocumentService) {
    this.attachmentFilesToUpload = new Array<FileInfo>();
  }

  ngOnInit() {
    // Prepare Add form component
    this.createAddForm();
    this.settlementAddFormGroup.patchValue({
      AmountWithCurrency: this.settlementAmount
    });

  }
  private createAddForm(): any {
    // Prepare the formGroup [purchaseRequestAddFormGroup]
    this.settlementAddFormGroup = this.formBuilder.group({
      Id: [0],
      IdTiers: [this.idTiers],
      SettlementDate: [new Date(), Validators.required],
      IdPaymentMethod: [undefined, Validators.required],
      AmountWithCurrency: [{ value: this.settlementAmount, disabled: true }, Validators.compose([Validators.required, Validators.min(0)])],
      ResidualAmountWithCurrency: [0],
      IdStatus: [settlementStatusCode.Provisional],
      SettlementReference: ['', Validators.maxLength(NumberConstant.FIFTY)],
      Direction: [1],
      IdBankAccount: [undefined]
    });
  }

  /**
   * Add settlement
   */
  public onAddSettlementClick(): void {
    if (this.settlementAddFormGroup.valid) {
      this.settlementToSave = new Settlement();
      this.settlementToSave.Id = this.settlementAddFormGroup.get(SettlementConstant.id).value;
      this.settlementToSave.IdTiers = this.settlementAddFormGroup.get(SettlementConstant.idTiers).value;
      this.settlementToSave.SettlementDate = this.settlementAddFormGroup.get(SettlementConstant.settlementDate).value;
      this.settlementToSave.IdPaymentMethod = this.settlementAddFormGroup.get(SettlementConstant.idPaymentMethod).value;
      this.settlementToSave.AmountWithCurrency = this.settlementAddFormGroup.get(SettlementConstant.amountWithCurrency).value;
      this.settlementToSave.IdStatus = this.settlementAddFormGroup.get(SettlementConstant.idStatus).value;
      this.settlementToSave.SettlementReference = this.settlementAddFormGroup.get(SettlementConstant.settlementReference).value;
      // Set settlment direction
      if (this.documentType ===  DocumentEnumerator.SalesInvoices) {
        this.settlementToSave.Direction = NumberConstant.ONE;
      } else {
        this.settlementToSave.Direction = NumberConstant.TWO;
      }
      this.settlementToSave.ObservationsFilesInfo = this.attachmentFilesToUpload;
      // event emitter
      this.settlementToSaveChange.emit(this.settlementToSave);
    } else {
      this.validationService.validateAllFormFields(this.settlementAddFormGroup);
    }
  }

}
