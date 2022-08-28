import { Component, ComponentRef, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DataResult, State } from '@progress/kendo-data-query';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { ModalDialogInstanceService } from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import { Subject } from 'rxjs/Subject';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { TreasuryConstant } from '../../../constant/treasury/treasury.constant';
import { Currency } from '../../../models/administration/currency.model';
import { DocumentEnumerator } from '../../../models/enumerators/document.enum';
import { Settlement } from '../../../models/payment/settlement.model';
import { FileInfo } from '../../../models/shared/objectToSend';
import { DeadLineDocumentService } from '../../../sales/services/dead-line-document/dead-line-document.service';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { LanguageService } from '../../services/language/language.service';
import { UserCurrentInformationsService } from '../../services/utility/user-current-informations.service';
import {LocalStorageService} from '../../../login/Authentification/services/local-storage-service';

@Component({
  selector: 'app-pop-up-settlement-disposal',
  templateUrl: './pop-up-settlement-disposal.component.html',
  styleUrls: ['./pop-up-settlement-disposal.component.scss']
})
export class PopUpSettlementDisposalComponent implements OnInit {
  options: Partial<IModalDialogOptions<any>>;
  settlementHistory: any;
  settlement: Settlement;
  isModal: boolean;
  public closeDialogSubject: Subject<any>;
  tiersCurrency: Currency;
  language: string;
  public documentType = DocumentEnumerator;
  gridData: DataResult;
  public observationsFilesInfo: Array<FileInfo> = new Array<FileInfo>();
  public isFileInfo = true;
  companyWithholdingTax = false;
  columnsConfig: ColumnSettings[] = [
    {
      field: TreasuryConstant.FINANCIAL_COMMITMENT_TYPE,
      title: TreasuryConstant.TYPE,
      filterable: true,
    },
    {
      field: TreasuryConstant.CODE_DOCUMENT,
      title: TreasuryConstant.CODE_BILL_TITLE,
      filterable: true,
    },
    {
      field: TreasuryConstant.AMOUNT_WITH_CURRENCY,
      title: TreasuryConstant.TOTAL_AMOUNT_UPPERCASE_SETTLEMENT_COMMITMENT,
      filterable: true,
    },
    {
      field: TreasuryConstant.ASSIGNED_AMOUNT_WITH_CURRENCY,
      title: TreasuryConstant.ASSIGNED_AMOUNT,
      filterable: true,
    },
    {
      field: TreasuryConstant.WITHHOLDING_TAX,
      title: TreasuryConstant.TOTAL_WITHHOLDING_TAX,
      filterable: true,
    },
    {
      field: TreasuryConstant.ASSIGNED_WITHHOLDING_TAX_WITH_CURRENCY,
      title: TreasuryConstant.ASSIGNED_WITHHOLDING_TAX,
      filterable: true,
    },
  ];
  public gridState: State = {
    skip: 0,
    take: 10,
    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: []
    }
  };
  public formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);
  constructor(private modalService: ModalDialogInstanceService, private swalWarrings: SwalWarring, private translate: TranslateService,
    public settlementService: DeadLineDocumentService, private localStorageService : LocalStorageService) {
      this.language = this.localStorageService.getLanguage();
  }

  ngOnInit() {
    this.gridData = this.settlementHistory.SettlementCommitmentsAssociatedToSettlement;
    if (this.settlement.ObservationsFilesInfo && this.settlement.ObservationsFilesInfo.length > 0) {
      this.observationsFilesInfo = this.settlement.ObservationsFilesInfo;
    }
  }
  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.isModal = true;
    this.options = options;
    this.settlementHistory = Object.assign([], this.options.data);
    this.settlement = Object.assign([], this.options.data.Settlement);
    this.companyWithholdingTax = this.options.data.Settlement.companyWithholdingTax;
    this.tiersCurrency = this.settlement.IdUsedCurrencyNavigation;
    this.closeDialogSubject = options.closeDialogSubject;
  }

  closeModal() {
    this.options.onClose();
    this.modalService.closeAnyExistingModalDialog();
  }
  replace() {
    this.swalWarrings.CreateSwal(this.getSwalTexte(), null, TreasuryConstant.SETTLEMENT_DISPOSAL)
      .then((result) => {
        if (result.value) {
          // Replace settlement
          this.settlementService.replaceSettlement(this.settlement.Id).subscribe(() => {
            this.closeModal();
          });
        }
      });
  }

  getSwalTexte(): string {
    return TreasuryConstant.SETTLEMENT_DISPOSAL_MESSAGE;
  }
}
