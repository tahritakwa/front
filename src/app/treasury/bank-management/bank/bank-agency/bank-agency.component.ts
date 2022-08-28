import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewContainerRef} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {isNumeric, ValidationService} from '../../../../shared/services/validation/validation.service';
import {SwalWarring} from '../../../../shared/components/swal/swal-popup';
import {TranslateService} from '@ngx-translate/core';
import {BankAccountConstant} from '../../../../constant/Administration/bank-account.constant';
import {isNotNullOrUndefinedAndNotEmptyValue} from '../../../../stark-permissions/utils/utils';
import {KeyboardConst} from '../../../../constant/keyboard/keyboard.constant';
import {NumberConstant} from '../../../../constant/utility/number.constant';
import { SharedConstant } from '../../../../constant/shared/shared.constant';
import { FormModalDialogService } from '../../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { EditAgencyComponent } from '../edit-agency/edit-agency.component';
import { CompanyConstant } from '../../../../constant/Administration/company.constant';
import { Bank } from '../../../../models/shared/bank.model';

const EMPTY_STRING = '';
@Component({
  selector: 'app-bank-agency',
  templateUrl: './bank-agency.component.html',
  styleUrls: ['./bank-agency.component.scss']
})
export class BankAgencyComponent implements OnChanges {
  /**
   * Decorator to identify the update mode
   */
  @Input() public isUpdateMode = false;
  /**
   * Decorator to send phone state
   */
  @Output() public phoneHasError = new EventEmitter<boolean>();
  public agencyCollapseOpened = true;
  @Input()  public hasUpdateAgencePermission ;
  public collapseContactOpened = true;
  public agencyLabelEditable = false;
  public isAgencyDeleteClick = false;
  public contactLabel = this.translate.instant(BankAccountConstant.MANAGER_AGENCY);
  /**
   *  Decorator to delete agency
   */
  @Output() public deleteAgency: EventEmitter<any> = new EventEmitter<any>();

  @Input() bankFormGroup : FormGroup;
  @Input() bankToUpdate : Bank;
  public agencyCollapsesOpened = new Array<boolean>();
  /**
   *
   * @param fb
   * @param validationService
   * @param swalWarring
   * @param translate
   */
  constructor(private fb: FormBuilder, private validationService: ValidationService,
              private swalWarring: SwalWarring, private translate: TranslateService, private formModalDialogService: FormModalDialogService,
              private viewContainerRef: ViewContainerRef) {
  }


  isContactPhoneHasError(isValidPhone) {
    this.phoneHasError.emit(isValidPhone);
  }

  editBankLabel(event, value) {
    this.agencyLabelEditable = value;
  }

  onAccordionClick() {
      this.agencyCollapseOpened = true;
  }
 
  onAccordionAgencyClick(){
    this.collapseContactOpened = true;
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (isNotNullOrUndefinedAndNotEmptyValue(this.bankToUpdate)) {
      if(!isNotNullOrUndefinedAndNotEmptyValue(this.bankToUpdate.BankAgency)){
        this.collapseContactOpened = false;
      }
      else {
        this.agencyCollapseOpened = true;
        this.collapseContactOpened = true;
        for (const bankAgency of this.bankToUpdate.BankAgency) {
          this.buildAgencyFormGroup(bankAgency);
        }
      }
    }
  }

  onBankAgencyLabelKeyEnter(event, value) {
    if (event.key === KeyboardConst.ENTER) {
      this.agencyLabelEditable = value;
    } else {
      event.stopPropagation();
    }
  }

  public onAgencyDelete(agency) {
    this.isAgencyDeleteClick = true;
    const agencyId = agency.value.Id;
    if (agencyId !== NumberConstant.ZERO) {
      this.swalWarring.CreateSwal(BankAccountConstant.AGENCY_DELETE_TEXT_MESSAGE,
        BankAccountConstant.AGENCY_DELETE_TITLE_MESSAGE).then((result) => {
        if (result.value) {
          this.removeAgency(agency);
        }
      });
    } else {
      this.sendDeleteEvent({Id: agencyId});
    }
  }

  public deleteAgencyContacts(agency) {
    agency.controls.Contact.controls.forEach((value) => {
      value.get(BankAccountConstant.IS_DELETED).setValue(true);
    });
  }

  public removeAgency(agency) {
    agency.get(BankAccountConstant.IS_DELETED).setValue(true);
    this.deleteAgencyContacts(agency);
  }

  public sendDeleteEvent(value) {
     this.deleteAgency.emit(value);
  }

  selectedChange() {
     this.collapseContactOpened = !this.collapseContactOpened;
  }

  selectedAgencyChange(){
    this.agencyCollapseOpened = !this.agencyCollapseOpened;
  }

  openEditAgencyDialog(agency){
    const data = {
      'Label' : agency.value.Label,
      'Id' : agency.value.Id
    }
    this.formModalDialogService.openDialog(BankAccountConstant.EDIT_AGENCY_LABEL,
      EditAgencyComponent,
      this.viewContainerRef, this.actionOnClose.bind(this), data, true, SharedConstant.MODAL_DIALOG_SIZE_XS, agency.controls[BankAccountConstant.LABEL].value);
  }

  actionOnClose(data) : any{
    let agency = this.BankAgency.controls.find(agency => agency.value.Id == data.Id) as FormGroup;
    agency.controls[BankAccountConstant.LABEL].setValue(data.Label);
  }
  
  get BankAgency(): FormArray {
    return this.bankFormGroup.controls[BankAccountConstant.BANK_AGENCY] as FormArray;
  }
  
  addAgency(bankAgencyToUpdate?) {
    this.BankAgency.push(this.buildAgencyFormGroup());
  }

  private buildAgencyFormGroup(agency?): FormGroup {
    let length = this.BankAgency.length;
    length++;
    this.collapseContactOpened = true;
    const agencyFormGroup = this.fb.group({
      Id: [agency ? agency.Id : NumberConstant.ZERO],
      Label: [agency ? agency.Label :`${this.translate.instant(CompanyConstant.AGENCE)} ${length}`, Validators.required],
      IsDeleted: [false],
      Contact: this.fb.array([])
    });
    let Contacts = agencyFormGroup.controls[BankAccountConstant.CONTACT] as FormArray;
    if(agency && agency.Contact && agency.Contact.lenght > 0){
      agency.Contact.foreach(contact => Contacts.push(this.buildContactForm(contact)));
    }
    else{
      Contacts.push(this.buildContactForm());
    }
    return agencyFormGroup;
  }

  private buildContactForm(tiersContact?): FormGroup {
    return this.fb.group({
      Id: [tiersContact ? tiersContact.Id : NumberConstant.ZERO],
      IdTiers: [tiersContact ? tiersContact.IdTiers : null],
      IdCompany: [tiersContact ? tiersContact.IdCompany : null],
      Label: [tiersContact ? tiersContact.Label : this.contactLabel],
      FirstName: [tiersContact ? tiersContact.FirstName : SharedConstant.EMPTY
        , Validators.required],
      LastName: [tiersContact ? tiersContact.LastName : SharedConstant.EMPTY, Validators.required],
      Phone: this.fb.array([]),
      Fax1: [tiersContact ? tiersContact.Fax1 : SharedConstant.EMPTY, isNumeric()],
      Email: [tiersContact ? tiersContact.Email : SharedConstant.EMPTY, Validators.pattern(SharedConstant.MAIL_PATTERN)],
      Fonction: [tiersContact ? tiersContact.Fonction : SharedConstant.EMPTY],
      Adress: [tiersContact ? tiersContact.Adress : SharedConstant.EMPTY],
      IsDeleted: [false],
      PictureFileInfo: [tiersContact ? tiersContact.PictureFileInfo : SharedConstant.EMPTY],
      UrlPicture: [tiersContact ? tiersContact.UrlPicture : SharedConstant.EMPTY],
      PictureToDelete: [false],
      CreationDate: [tiersContact? tiersContact.CreationDate : null],
      WasLead: ['false']
  });
}

public showAgency(agency) : boolean{
  return !agency.value.IsDeleted;
}
}
