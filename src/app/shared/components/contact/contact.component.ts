import { Component, OnInit, Input, ComponentRef } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { Subject } from 'rxjs';
import { FileInfo } from '../../../models/shared/objectToSend';
import { Contact } from '../../../models/shared/contact.model';
import { Tiers } from '../../../models/achat/tiers.model';
import { TiersService } from '../../../purchase/services/tiers/tiers.service';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { ValidationService, customEmailValidator, isNumeric } from '../../services/validation/validation.service';
import { DocumentConstant } from '../../../constant/sales/document.constant';
import { SwalWarring } from '../swal/swal-popup';
import { TranslateService } from '@ngx-translate/core';
import { ModalDialogInstanceService } from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import { TiersConstants } from '../../../constant/purchase/tiers.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  @Input() contactForm: FormGroup;
  contactAddForm: FormGroup;
  public idTiers: any;
  tiers: Tiers;
  contact: Contact;
  public isModal: boolean;
  public options: Partial<IModalDialogOptions<any>>;
  isUpdateMode: boolean;
  public closeDialogSubject: Subject<any>;
  public contactFileToUpload: Array<FileInfo>;
  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.isModal = true;
    this.options = options;
    this.idTiers = options.data;
    this.closeDialogSubject = options.closeDialogSubject;
    this.contactFileToUpload = new Array<FileInfo>();
    this.ngOnInit();
  }
  constructor(private modalService: ModalDialogInstanceService, private fb: FormBuilder, private tiersService: TiersService, public validationService: ValidationService,
    private swalWarrings: SwalWarring, private translate: TranslateService) {
    this.contactFileToUpload = new Array<FileInfo>();
    this.isUpdateMode = this.idTiers > NumberConstant.ZERO;

  }
  /**
   * on init
   */
  ngOnInit() {
    this.tiersService.getById(this.idTiers).subscribe(data => {
      this.tiers = data;
    });
    if (this.isModal) {
      this.createContactForm();
    }
  }
  createContactForm() {
    this.contactAddForm = this.fb.group({
      Id: [0],
      IdTiers: [0],
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      Tel1: ['', [isNumeric()]],
      Fax1: ['',[isNumeric()]],
      Email : ['', [Validators.pattern(SharedConstant.MAIL_PATTERN)]],
      Adress: [''],
      Fonction: [''],
      IsDeleted: [false],
    });
  }
  /**
   * FirstName getter
   */
  get FirstName(): FormGroup {
    if (this.contactForm) {
      return this.contactForm.get('FirstName') as FormGroup;
    } else {
      return this.contactAddForm.get('FirstName') as FormGroup;
    }
  }
  /**
   * LastName getter
   */
  get LastName(): FormGroup {
    if (this.contactForm) {
      return this.contactForm.get('LastName') as FormGroup;
    } else {
      return this.contactAddForm.get('LastName') as FormGroup;
    }
  }
  /**
   * Tel1 getter
   */
  get Tel1(): FormGroup {
    if (this.contactForm) {
      return this.contactForm.get('Tel1') as FormGroup;
    } else {
      return this.contactAddForm.get('Tel1') as FormGroup;
    }
  }
  /**
   * Fax1 getter
   */
  get Fax1(): FormGroup {
    if (this.contactForm) {
      return this.contactForm.get('Fax1') as FormGroup;
    } else {
      return this.contactAddForm.get('Fax1') as FormGroup;
    }
  }
  /**
   * Email getter
   */
  get Email(): FormGroup {
    if (this.contactForm) {
      return this.contactForm.get('Email') as FormGroup;
    } else {
      return this.contactAddForm.get('Email') as FormGroup;
    }
  }
  /**
   * Adress getter
   */
  get Adress(): FormGroup {
    if (this.contactForm) {
      return this.contactForm.get('Adress') as FormGroup;
    } else {
      return this.contactAddForm.get('Adress') as FormGroup;
    }
  }
  /**
   * Function getter
   */
  get Fonction(): FormGroup {
    if (this.contactForm) {
      return this.contactForm.get('Fonction') as FormGroup;
    } else {
      return this.contactAddForm.get('Fonction') as FormGroup;
    }
  }
  /**
   * IsDeleted getter
   */
  get IsDeleted(): FormGroup {
    if (this.contactForm) {
      return this.contactForm.get('IsDeleted') as FormGroup;
    } else {
      return this.contactAddForm.get('IsDeleted') as FormGroup;
    }
  }
  public save() {
    if (this.contactAddForm.valid) {
      this.swalWarrings.CreateSwal(TiersConstants.ADD_CONTACT_CONFIRMATION, TiersConstants.ADD_CONTACT_TO_TIERS,
        this.translate.instant(DocumentConstant.VALIDATION_CONFIRM),
        this.translate.instant(DocumentConstant.CANCEL)).then((result) => {
          if (result.value) {
            if (this.tiers) {
            this.contact = this.contactAddForm.value;
            this.contact.IdTiers = this.tiers.Id;
            this.tiers.Contact.push(this.contact);
            this.tiersService.save(this.tiers, this.isUpdateMode).subscribe();
            this.options.onClose();
            this.modalService.closeAnyExistingModalDialog();
          }
        }
        });
    } else {
      this.validationService.validateAllFormFields(this.contactAddForm as FormGroup);
    }
  }
}
