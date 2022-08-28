import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SecureType} from '../../../../models/mailing/enums/SecureType';
import {EnumValues} from 'enum-values';
import {TranslateService} from '@ngx-translate/core';
import {AccountType} from '../../../../models/mailing/enums/AccountType';
import {ValidationService} from '../../../../shared/services/validation/validation.service';
import {OutgoingServerSettings} from '../../../../models/mailing/OutgoingServerSettings';
import {MailingConstant} from '../../../../constant/mailing/mailing.constant';
import {GrowlService} from '../../../../../COM/Growl/growl.service';
import {ServerSettingsService} from '../../../services/settings-server/server-settings.service';
import {NumberConstant} from '../../../../constant/utility/number.constant';
import {Observable} from 'rxjs/Observable';
import {GenericMailingService} from '../../../services/generic-mailing.service';


@Component({
  selector: 'app-mailing-settings',
  templateUrl: './mailing-settings.component.html',
  styleUrls: ['./mailing-settings.component.scss']
})
export class MailingSettingsComponent implements OnInit {
  public mailsettingsForm: FormGroup;
  public typeAccountListIn = [];
  public typeSecureListOut = [];
  public isUpdate = false;
  public showButtonModify = true;
  public saveOrUpdateBtnText = 'SAVE';
  private isOperationSaved: boolean;

  /**
   *
   * @param fb
   * @param translate
   * @param validationService
   * @param serverSettingsService
   * @param growlService
   * @param genericMailingService
   */
  constructor(private fb: FormBuilder, private translate: TranslateService, private validationService: ValidationService,
              private serverSettingsService: ServerSettingsService, private growlService: GrowlService,
              private genericMailingService: GenericMailingService) {
  }

  ngOnInit() {
    this.createmailSettingsForm();
    this.initSecureTypesDropDown();
    this.initAccountTypesDropDown();
    this.checkIfExists();
  }

  checkIfExists() {
    this.serverSettingsService.getJavaGenericService().getEntityList().subscribe(data => {
      if (data.length > NumberConstant.ZERO) {
        this.mailsettingsForm.patchValue(data[NumberConstant.ZERO]);
        this.saveOrUpdateBtnText = 'UPDATE';
      } else {
        this.saveOrUpdateBtnText = 'SAVE';
      }
    });
  }

  changeModeToUpdate() {
    this.showButtonModify = false;
    this.isUpdate = true;
  }

  initUpdateMode() {
    this.showButtonModify = true;
    this.isUpdate = false;
  }

  private createmailSettingsForm(): void {
    this.mailsettingsForm = this.fb.group({
      secureTypeOut: ['', [Validators.required]],
      hostOut: ['', [Validators.required, Validators.minLength(NumberConstant.THREE), Validators.maxLength(NumberConstant.TWENTY), Validators.pattern(MailingConstant.hostPattern)]],
      portOut: ['', [Validators.required, Validators.min(NumberConstant.ONE)]]
    });
  }

  valider() {
    if (this.mailsettingsForm.valid) {
      this.isOperationSaved = true;
      this.serverSettingsService.getJavaGenericService().saveEntity(this.convertMailFormToOutgoingServerSettings(this.mailsettingsForm)).subscribe(
        data => {
          if (data != null) {
            this.growlService.successNotification(this.translate.instant(MailingConstant.SUCCESS_OPERATION));
            this.initUpdateMode();
          }
        }
      );
    } else {
      this.validationService.validateAllFormFields(this.mailsettingsForm);
    }
  }

  convertMailFormToOutgoingServerSettings(form: FormGroup): OutgoingServerSettings {
    let settingsOut = new OutgoingServerSettings();
    let formValue = form.value;
    settingsOut.hostOut = form.value.hostOut;
    settingsOut.portOut = formValue.portOut;
    settingsOut.secureTypeOut = formValue.secureTypeOut;
    return settingsOut;
  }

  initSecureTypesDropDown() {
    const secureTypesEnum = EnumValues.getNames(SecureType);
    const secureTypesMapped = secureTypesEnum.map((secureType: any) => {
      return secureType = {enumValue: secureType, enumText: this.translate.instant(secureType)};
    });
    this.typeSecureListOut = secureTypesMapped;
  }

  initAccountTypesDropDown() {
    const accountTypeEnum = EnumValues.getNames(AccountType);
    const accountTypeMapped = accountTypeEnum.map((accountType: any) => {
      return accountType = {enumValue: accountType, enumText: this.translate.instant(accountType)};
    });
    this.typeAccountListIn = accountTypeMapped;
  }

  initPortOut(event) {
    switch (event) {
      case SecureType.TLS:
        this.mailsettingsForm.controls['portOut'].setValue(587);
        break;
      case SecureType.SSL:
        this.mailsettingsForm.controls['portOut'].setValue(465);
        break;
      case SecureType.WITHOUT:
        this.mailsettingsForm.controls['portOut'].setValue(25);
        break;
      default :
        break;
    }
  }

  initPortIn(event) {
    switch (event) {
      case AccountType.IMAP:
        this.mailsettingsForm.controls['portIn'].setValue(143);
        break;
      case AccountType.POP3:
        this.mailsettingsForm.controls['portIn'].setValue(110);
        break;
      default :
        break;
    }
  }

  public canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.isOperationSaved) {
      this.isOperationSaved = false;
      return true;
    }
    return this.genericMailingService.handleCanDeactivateToLeaveCurrentComponent(this.isMailFormChanged.bind(this));
  }

  public isMailFormChanged(): boolean {
    return this.mailsettingsForm.touched;
  }

  private isFormGroupDataChanged(isFormGroupDataChanged: Function): boolean {
    return isFormGroupDataChanged();
  }

}
