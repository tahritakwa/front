import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Bank} from '../../../../models/shared/bank.model';
import {FileInfo} from '../../../../models/shared/objectToSend';
import {BankService} from '../../../services/bank.service';
import {unique, ValidationService} from '../../../../shared/services/validation/validation.service';
import {SharedConstant} from '../../../../constant/shared/shared.constant';
import {NumberConstant} from '../../../../constant/utility/number.constant';
import {TreasuryConstant} from '../../../../constant/treasury/treasury.constant';
import {PhoneConstants} from '../../../../constant/purchase/phone.constant';
import {Observable} from 'rxjs/Observable';
import {BankAccountConstant} from '../../../../constant/Administration/bank-account.constant';
import {CompanyConstant} from '../../../../constant/Administration/company.constant';
import {TranslateService} from '@ngx-translate/core';
import {ContactConstants} from '../../../../constant/crm/contact.constant';
import {SwalWarring} from '../../../../shared/components/swal/swal-popup';
import {isNotNullOrUndefinedAndNotEmptyValue} from '../../../../stark-permissions/utils/utils';
import {StyleConfigService} from '../../../../shared/services/styleConfig/style-config.service';
import { PermissionConstant } from '../../../../Structure/permission-constant';
import { AuthService } from '../../../../login/Authentification/services/auth.service';

const EMPTY_STRING = '';

@Component({
  selector: 'app-add-advenced-bank',
  templateUrl: './add-advenced-bank.component.html',
  styleUrls: ['./add-advenced-bank.component.scss'],
})

export class AddAdvencedBankComponent implements OnInit {
  public bankToUpdate: Bank;
  public isUpdateMode: boolean;
  private id: number;
  public bankFormGroup: FormGroup;
  public logoFileInfo: FileInfo;
  public logoBankSrc: any;
  public contactCollapseOpened = false;
  public agencyCollapseOpened = false;
  public phonesHasError = false;
  public defaultPhoneCountryTn = PhoneConstants.DEFAULT_COUNTRY_TN;
  public defaultPhoneCountryFr = PhoneConstants.DEFAULT_COUNTRY_FR;
  public defaultPhoneCountryGb = PhoneConstants.DEFAULT_COUNTRY_GB;
  /**
   * attribute to use while verifying the route leave
   */
  private isSaveOperation = false;
  /**
   * Array to precise for each agency collapse if it's opened or not
   */
  public agencyCollapsesOpened = new Array<boolean>();
  public hasAddBankPermission: boolean;
  public hasUpdateBankPermission: boolean;
  /**
   *
   * @param fb
   * @param activatedRoute
   * @param router
   * @param bankService
   * @param validationService
   * @param styleConfigService
   * @param swalWarring
   * @param translate
   */
  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public bankService: BankService,
    private validationService: ValidationService,
    private styleConfigService: StyleConfigService,
    private swalWarring: SwalWarring,
    private authService: AuthService,
    private translate: TranslateService) {
    this.activatedRoute.params.subscribe(params => {
      this.id = +params[SharedConstant.ID_LOWERCASE] || 0;
    });
  }

  ngOnInit() {
    this.hasAddBankPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.ADD_BANK);
    this.hasUpdateBankPermission =
    this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.UPDATE_BANK);
    this.createAddForm();
    this.isUpdateMode = (this.id > 0);
    if (this.isUpdateMode) {
      this.getDataToUpdate();
    }
  }

  /*
    * Prepare Add form component
   */
  private createAddForm(bank?) {
    this.bankFormGroup = this.fb.group({
      Id: [bank ? bank.Id : 0],
      Name: [bank ? bank.Name : undefined,
        [Validators.required, Validators.maxLength(NumberConstant.ONE_HUNDRED)]],
      Address: [bank ? bank.Adress : undefined],
      Email: [bank ? bank.Email : undefined, [Validators.required, Validators.pattern(SharedConstant.MAIL_PATTERN)],
      unique(SharedConstant.EMAIL, this.bankService, String(this.id))],
      Phone: [bank ? bank.Phone : undefined],
      Fax: [bank ? bank.Fax : undefined,
        [Validators.maxLength(NumberConstant.ONE_HUNDRED)]],
      WebSite: [bank ? bank.WebSite : undefined,
        [Validators.maxLength(NumberConstant.ONE_HUNDRED)]],
      IdCountry: [undefined, Validators.required],
      AttachmentUrl: [undefined],
      BankAgency: this.fb.array([])
    });
  }


  /**
   * Get data to Update
   */
  private getDataToUpdate() {
    this.bankService.getById(this.id).subscribe((data) => {
      this.bankToUpdate = data;
      if (this.bankToUpdate) {
        if (this.bankToUpdate.AttachmentUrl) {
          this.bankService.getPicture(this.bankToUpdate.AttachmentUrl).subscribe((res: any) => {
            this.logoBankSrc = SharedConstant.PICTURE_BASE + res;
          });
        }
        if (isNotNullOrUndefinedAndNotEmptyValue(this.bankToUpdate.BankAgency)) {
          this.bankToUpdate.BankAgency.forEach(bankAgency => {
            this.addAgency(bankAgency);
          });
        } else {
          this.bankToUpdate.BankAgency = [];
        }
        this.bankFormGroup.patchValue(this.bankToUpdate);
      }
      if (!this.hasUpdateBankPermission) {
        this.bankFormGroup.disable();
        this.agencies.disable();
      }
    });
  }

  /**
   * bank Add
   */
  public save(): void {
    if (this.bankFormGroup.valid && !this.phonesHasError) {
      this.isSaveOperation = true;
      if (this.isUpdateMode) {
        Object.assign(this.bankToUpdate, this.bankFormGroup.value);
        this.bankToUpdate.LogoFileInfo = this.logoFileInfo;
        this.bankService.updateBank(this.bankToUpdate).subscribe(() => {
          this.backToList();
        });
      } else {
        const bank = this.bankFormGroup.value;
        bank.LogoFileInfo = this.logoFileInfo;
        this.bankService.addBank(bank).subscribe(() => {
          this.backToList();
        });
      }
    } else {
      this.validationService.validateAllFormFields(this.bankFormGroup);
    }
  }

  public onFileChanged(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      if(file.type.startsWith("image/")){
      reader.onload = (e: any) => {
        this.logoFileInfo = new FileInfo();
        this.logoFileInfo.Name = file.name;
        this.logoFileInfo.Extension = file.type;
        this.logoFileInfo.FileData = (<string>reader.result).split(',')[1];
        this.logoBankSrc = reader.result;
      };
    }
    }
  }

  DeleteImage() {
    this.logoBankSrc = undefined;
    this.logoFileInfo = undefined;
    this.bankFormGroup.get('AttachmentUrl').setValue(null);
  }

  public backToList() {
    this.router.navigateByUrl(SharedConstant.BANK_LIST_URL);
  }

  /**
   * this method will be called by CanDeactivateGuard service to check the leaving component possibility
   */
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.isSaveOperation) {
      this.isSaveOperation = false;
      return true;
    }
    return this.validationService.handleCanDeactivateToLeaveCurrentComponent(this.isFormGroupChanged.bind(this));
  }

  private isFormGroupChanged(): boolean {
    return this.bankFormGroup.touched;
  }

  get agencies(): FormArray {
    return this.bankFormGroup.get(BankAccountConstant.BANK_AGENCY) as FormArray;
  }

  addAgency(bankAgencyToUpdate?) {
    this.agencies.push(this.buildAgencyFormGroup(this.agencies.length, bankAgencyToUpdate));
  }

  private buildAgencyFormGroup(length, agency?): FormGroup {
    length++;
    this.agencyCollapsesOpened.push(true);
    return this.fb.group({
      Id: [agency ? agency.Id : NumberConstant.ZERO],
      Label: [agency ? agency.Label : `${this.translate.instant(CompanyConstant.AGENCE)} ${length}`, Validators.required],
      IsDeleted: [false],
      Contact: this.fb.array([])
    });
  }


  private buildContactForm(tiersContact?): FormGroup {
    return this.fb.group({
      Id: [tiersContact ? tiersContact.Id : NumberConstant.ZERO],
      IdTiers: [tiersContact ? tiersContact.IdTiers : null],
      IdCompany: [tiersContact ? tiersContact.IdCompany : null],
      Label: [tiersContact ? tiersContact.Label : EMPTY_STRING],
      FirstName: [tiersContact ? tiersContact.FirstName : EMPTY_STRING
        , Validators.required],
      LastName: [tiersContact ? tiersContact.LastName : EMPTY_STRING, Validators.required],
      Phone: this.fb.array([]),
      Fax1: [tiersContact ? tiersContact.FAX : EMPTY_STRING],
      Email: [tiersContact ? tiersContact.Email : EMPTY_STRING, [Validators.required, Validators.pattern(SharedConstant.MAIL_PATTERN)]],
      Fonction: [tiersContact ? tiersContact.Fonction : EMPTY_STRING],
      Adress: [tiersContact ? tiersContact.Adress : EMPTY_STRING],
      IsDeleted: [false],
      PictureFileInfo: [tiersContact ? tiersContact.PictureFileInfo : EMPTY_STRING]
    });
  }

  tiersAgenciesPhoneHasError(event) {
    this.phonesHasError = event.includes(true);
  }

  removeBankPicture(event) {
    event.preventDefault();
    this.swalWarring.CreateDeleteSwal(ContactConstants.PICTURE_ELEMENT, ContactConstants.PRONOUN_CETTE).then((result) => {
      if (result.value) {
        this.logoFileInfo = null;
        this.logoBankSrc = null;
        this.bankFormGroup.get('AttachmentUrl').setValue(null);
      }
    });
  }

  public deleteAgency(event) {
    const agencyId = event.Id;
    const index = this.agencies.controls.findIndex((formGroup) => formGroup.value.Id === agencyId);
    delete this.agencyCollapsesOpened[index];
    this.agencies.removeAt(index);
  }

  getFooterClass(): string {
    return this.styleConfigService.getFooterClassSettingLayoutAddComponent();
  }

}
