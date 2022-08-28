import {Component, ComponentRef, OnDestroy, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {IModalDialog, IModalDialogOptions} from 'ngx-modal-dialog';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AccountsDropdownComponent} from '../../../shared/components/accounts-dropdown/accounts-dropdown.component';
import {GenericAccountingService} from '../../services/generic-accounting.service';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {FormModalDialogService} from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import {AddJournalComponent} from '../../journal/add-journal/add-journal.component';
import {Subscription} from 'rxjs/Subscription';
import {ValidationService} from '../../../shared/services/validation/validation.service';
import {SharedAccountingConstant} from '../../../constant/accounting/sharedAccounting.constant';
import {GrowlService} from '../../../../COM/Growl/growl.service';
import {TranslateService} from '@ngx-translate/core';
import {FiscalYearService} from '../../services/fiscal-year/fiscal-year.service';
import {FiscalYearConstant} from '../../../constant/accounting/fiscal-year.constant';
import {ModalDialogInstanceService} from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import {AccountingConfigurationService} from '../../services/configuration/accounting-configuration.service';
import {HttpErrorResponse} from '@angular/common/http';
import {ErrorHandlerService} from '../../../../COM/services/error-handler-service';
import {Operation} from '../../../../COM/Models/operations';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-closing-and-reopning-fiscal-year',
  templateUrl: './closing-and-reopning-fiscal-year.component.html',
  styleUrls: ['./closing-and-reopning-fiscal-year.component.scss']
})
export class ClosingAndReopningFiscalYearComponent implements OnInit, OnDestroy, IModalDialog {
  public resultAccounts = this.route.snapshot.data['resultAccounts'];
  /**
   * constructor
   * @param genericAccountingService
   * @param accountingConfigurationService
   * @param fiscalYearService
   * @param viewRef
   * @param formModalDialogService
   * @param translate
   * @param validationService
   * @param growlService
   * @param errorHandlerService
   * @param modalService
   **/
  constructor(private genericAccountingService: GenericAccountingService,
              private accountingConfigurationService: AccountingConfigurationService,
              private fiscalYearService: FiscalYearService, private viewRef: ViewContainerRef,
              private formModalDialogService: FormModalDialogService, private  translate: TranslateService,
              private validationService: ValidationService, private growlService: GrowlService, private errorHandlerService: ErrorHandlerService,
              private modalService: ModalDialogInstanceService, private route: ActivatedRoute) {
  }

  private subscription: Subscription = new Subscription();
  public optionDialog: Partial<IModalDialogOptions<any>>;
  public closeAndReopeningForm: FormGroup;
  public journalFiltredList: any;
  public currentFiscalYear: string;
  @ViewChild(AccountsDropdownComponent) accountsDropDownComponent;
  showSpinner = false;

  /**
   * initialize dialog
   * @param reference
   * @param options
   */
  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.optionDialog = options;
  }

  initCloseAndReopeningForm() {
    this.closeAndReopeningForm = new FormGroup({
        'transferOfDepreciationPeriod': new FormControl(true, Validators.requiredTrue),
        'transferOfReports': new FormControl(true, Validators.requiredTrue),
        'passEntryAccounting': new FormControl(true, Validators.requiredTrue),
        'literableAccounts': new FormControl(false),
        'journalANewId': new FormControl('', Validators.required),
        'resultAccount': new FormControl('', Validators.required),
        'currentFiscalYear': new FormControl(this.optionDialog.data.id),
        'targetFiscalYearId':  new FormControl('', Validators.required)
      }
    );
  }

  checkPassEntryAccounting($event: any) {
    this.setCheckboxValue($event.target.checked, 'passEntryAccounting');
  }

  checkTransferOfReports($event: any) {
    this.setCheckboxValue($event.target.checked, 'transferOfReports');
  }

  checkTransferOfDepreciationPeriod($event: any) {
    this.setCheckboxValue($event.target.checked, 'transferOfDepreciationPeriod');
  }

  checkLiterableAccounts($event: any) {
    this.setCheckboxValue($event.target.checked, 'literableAccounts');
  }

  initJournalFilteredList() {
    this.genericAccountingService.getJournalList().then((journalList: any) => {
      this.journalFiltredList = journalList.slice(0);
    });
  }

  receiveResultAccounts($event: boolean) {
    this.accountsDropDownComponent.initDataSource($event);
  }

  addNewJournal() {
    this.formModalDialogService.openDialog('ADD_NEW_JOURNAL', AddJournalComponent, this.viewRef, null
      , null, null, SharedConstant.MODAL_DIALOG_SIZE_M);
  }

  setCheckboxValue($event: boolean, checkboxType: string) {
    switch (checkboxType) {
      case 'passEntryAccounting' :
        this.closeAndReopeningForm.patchValue({'passEntryAccounting': $event});
        break;
      case 'transferOfReports' :
        this.closeAndReopeningForm.patchValue({'transferOfReports': $event});
        break;
      case 'transferOfDepreciationPeriod' :
        this.closeAndReopeningForm.patchValue({'transferOfDepreciationPeriod': $event});
        break;
      case 'literableAccounts' :
        this.closeAndReopeningForm.patchValue({'literableAccounts': $event});
        break;
      default:
        return;
    }
  }

  closeAndReOpen() {
    if (this.closeAndReopeningForm.valid) {
      this.showSpinner = true;
      let redirect = false;
      this.fiscalYearService.getJavaGenericService()
      .callService(Operation.POST,FiscalYearConstant.CLOSE_AND_REOPENING_FISCAL_YEAR, this.closeAndReopeningForm.getRawValue())
        .subscribe(()=>{
          redirect = true;
          this.growlService.successNotification(this.translate.instant(SharedAccountingConstant.SUCCESS_OPERATION));
        },error=>{
          if (error.body.errors) {
            this.errorHandlerService.handleError(new HttpErrorResponse({ status: error.body.errorCode }), error.body.errors);
          } else if (error.body.errorCode) {
            this.errorHandlerService.handleError(new HttpErrorResponse({ status: error.body.errorCode }));
          }else{
            this.growlService.ErrorNotification(this.translate.instant(SharedAccountingConstant.FAILURE_OPERATION));
          }
        },()=>{
          this.showSpinner = false;
          if(redirect){
            this.optionDialog.onClose();
            this.modalService.closeAnyExistingModalDialog();
          }
        });
    } else {
      this.validationService.validateAllFormFields(this.closeAndReopeningForm);
    }
  }
  disabledInputs() {
    this.closeAndReopeningForm.controls['transferOfDepreciationPeriod'].disable();
    this.closeAndReopeningForm.controls['transferOfReports'].disable();
    this.closeAndReopeningForm.controls['passEntryAccounting'].disable();
    this.closeAndReopeningForm.controls['journalANewId'].disable();
  }

  initLastUnConcludedFiscalYear() {
    this.fiscalYearService.getJavaGenericService().getEntityList(FiscalYearConstant.FIRST_FISCAL_YEAR_NOT_CONCLUDED)
      .subscribe((fiscalYear) => {
        if (fiscalYear.id) {
          this.currentFiscalYear = fiscalYear.name;
        }
      });
  }
  ngOnInit() {
    this.initJournalFilteredList();
    this.initCloseAndReopeningForm();
    this.disabledInputs();
    this.accountingConfigurationService.getJavaGenericService().getEntityList().subscribe(data => {
      this.closeAndReopeningForm.controls['journalANewId'].setValue(data.journalANewId);
    });
    this.initLastUnConcludedFiscalYear();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
