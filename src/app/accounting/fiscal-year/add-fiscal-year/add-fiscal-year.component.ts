import {Component, ComponentRef, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FiscalYear} from '../../../models/accounting/fiscal-year.model';
import {ActivatedRoute, Router} from '@angular/router';
import {ValidationService} from '../../../shared/services/validation/validation.service';
import {GrowlService} from '../../../../COM/Growl/growl.service';
import {TranslateService} from '@ngx-translate/core';
import {FiscalYearService} from '../../services/fiscal-year/fiscal-year.service';
import {FiscalYearConstant} from '../../../constant/accounting/fiscal-year.constant';
import {DatePipe} from '@angular/common';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {SharedAccountingConstant} from '../../../constant/accounting/sharedAccounting.constant';
import {IModalDialog, IModalDialogOptions} from 'ngx-modal-dialog';
import {ModalDialogInstanceService} from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import {Observable} from 'rxjs/Observable';
import {GenericAccountingService} from '../../services/generic-accounting.service';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {FiscalYearStateEnumerator} from '../../../models/enumerators/fiscal-year-state-enumerator.enum';
import {AccountingConfigurationConstant} from '../../../constant/accounting/accounting-configuration.constant';
import {StarkRolesService} from '../../../stark-permissions/service/roles.service';
import {StyleConfigService} from '../../../shared/services/styleConfig/style-config.service';
import { RoleConfigConstant } from '../../../Structure/_roleConfigConstant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';

@Component({
  selector: 'app-add-fiscal-year',
  templateUrl: './add-fiscal-year.component.html',
  styleUrls: ['./add-fiscal-year.component.scss'],
})
export class AddFiscalYearComponent implements OnInit, IModalDialog {

  dialogOptions: Partial<IModalDialogOptions<any>>;

  public isSaveOperation: boolean;

  public isUpdateMode: boolean;

  public fiscalYearFormGroup: FormGroup;

  disableSaveButton = false;
  public fiscalYearId: number = null;

  @Input() dataOfGridLeave;
  public AccountingPermissions = PermissionConstant.SettingsAccountingPermissions;
  public formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);
  constructor(private fb: FormBuilder,
              public fiscalYearService: FiscalYearService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private validationService: ValidationService,
              private translate: TranslateService,
              private datePipe: DatePipe,
              private growlService: GrowlService,
              public  authService: AuthService,
              private genericAccountingService: GenericAccountingService,
              private styleConfigService: StyleConfigService) {
  }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.dialogOptions = options;
  }


  public initOnAddFiscalYear() {
    this.fiscalYearService.getJavaGenericService().sendData('start-date-fiscalyear').subscribe(startdate => {
      const endDate = this.datePipe.transform(new Date(new Date(startdate).getFullYear(), NumberConstant.ELEVEN,
        NumberConstant.THIRTY_ONE, NumberConstant.TWENTY_THREE,
        NumberConstant.FIFTY_NINE, NumberConstant.FIFTY_NINE), SharedAccountingConstant.YYYY_MM_DD_HH_MM_SS);

      this.fiscalYearFormGroup.controls['startDate'].setValue(new Date(startdate));
      this.fiscalYearFormGroup.controls['endDate'].setValue(new Date(endDate));
      this.fiscalYearFormGroup.controls['closingState'].setValue(FiscalYearStateEnumerator.Open);
    });
  }

  public initOnUpdateFiscalYear(id: number) {
    this.fiscalYearService.getJavaGenericService().getEntityById(id)
      .subscribe(
        data => {
          let fiscalYear = new FiscalYear(data.id, data.name, new Date(data.startDate), new Date(data.endDate), data.closingState);
          this.fiscalYearFormGroup.patchValue(fiscalYear);
          if (data.closingState !== FiscalYearStateEnumerator.Open) {
            this.fiscalYearFormGroup.controls['startDate'].disable();
            this.fiscalYearFormGroup.controls['endDate'].disable();
            if (data.closingState === FiscalYearStateEnumerator.Concluded) {
              this.disableSaveButton = true;
              this.fiscalYearFormGroup.disable();
            }
          } else {
            this.fiscalYearService.getJavaGenericService().getEntityList(FiscalYearConstant.ALL_FISCAL_YEARS_AFTER_CURRENT_FISCAL_YEAR
              + `?${FiscalYearConstant.CURRENT_FISCAL_YEAR_START_DATE}=${data.startDate}`)
              .subscribe(fiscalYears => {
                if (fiscalYears.length !== 0) {
                  this.fiscalYearFormGroup.controls['endDate'].disable();
                  this.fiscalYearFormGroup.controls['startDate'].disable();
                }
              });
          }
          if (!this.authService.hasAuthority(this.AccountingPermissions.UPDATE_FISCAL_YEARS)) {
            this.fiscalYearFormGroup.disable();
          }
        }
      );
  }

  private createAddForm(): void {
    this.fiscalYearFormGroup = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(AccountingConfigurationConstant.ENTITY_FIELD_MIN_LENGTH),
        Validators.maxLength(AccountingConfigurationConstant.ENTITY_FIELD_MAX_LENGTH)]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required],],
      closingState: [FiscalYearStateEnumerator.Open, [Validators.required]]
    });
  }

  save() {
    //TODO: send the data to the backend
    if (this.fiscalYearFormGroup.valid) {
      this.isSaveOperation = true;
      const item = this.fiscalYearFormGroup.getRawValue();
      item.startDate = this.datePipe.transform(item.startDate, SharedAccountingConstant.YYYY_MM_DD_HH_MM_SS);
      item.endDate = this.datePipe.transform(item.endDate, SharedAccountingConstant.YYYY_MM_DD_HH_MM_SS);
      item.id = this.fiscalYearId;
      this.fiscalYearService.getJavaGenericService().saveEntity(item).subscribe(data => {
        this.showSuccessMessage();
      }, err => {
        this.growlService.ErrorNotification(this.translate.instant(SharedAccountingConstant.FAILURE_OPERATION));
      });
    } else {
      this.validationService.validateAllFormFields(this.fiscalYearFormGroup);
    }
  }

  showSuccessMessage() {
    this.growlService.successNotification(this.translate.instant(SharedAccountingConstant.SUCCESS_OPERATION));
    if (this.dialogOptions === undefined) {
      this.router.navigateByUrl(FiscalYearConstant.LIST_FISCAL_YEARS_URL);
    } else {
      const elements = document.getElementsByTagName('modal-dialog');
      for (let i = 0; i < elements.length; i++) {
        if (elements.item(i).previousElementSibling.localName === 'app-fiscal-year-dropdown') {
          elements.item(i).setAttribute('style', 'display:none');
        }
      }
      this.dialogOptions.onClose();
    }
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.isSaveOperation) {
      this.isSaveOperation = false;
      return true;
    }
    return this.genericAccountingService.handleCanDeactivateToLeaveCurrentComponent(this.isFiscalYearFormChanged.bind(this));
  }

  private isFiscalYearFormChanged(): boolean {
    return this.fiscalYearFormGroup.touched;
  }

  ngOnInit() {
    this.createAddForm();
    this.activatedRoute.params.subscribe(params => {
      this.fiscalYearId = params[SharedConstant.ID_LOWERCASE] || null;
    });
    if (this.fiscalYearId) {
      this.isUpdateMode = true;
      this.initOnUpdateFiscalYear(this.fiscalYearId);
    } else {
      this.initOnAddFiscalYear();
    }
  }

  getFooterClass(): string {
    return this.styleConfigService.getFooterClassSettingLayoutAddComponent();
  }
}
