import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewContainerRef} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {ContactCrmService} from '../../../services/contactCrmService/contact-crm.service';
import {NumberConstant} from '../../../../constant/utility/number.constant';
import {SharedConstant} from '../../../../constant/shared/shared.constant';
import {DataSourceRequestState} from '@progress/kendo-data-query';
import {GridSettings} from '../../../../shared/utils/grid-settings.interface';
import {ContactConstants} from '../../../../constant/crm/contact.constant';
import {TiersService} from '../../../../purchase/services/tiers/tiers.service';
import {ContactService} from '../../../../purchase/services/contact/contact.service';
import {GenericCrmService} from '../../../generic-crm.service';
import {PopupSendMailComponent} from '../../../../mailing/components/template-email/popup-send-mail/popup-send-mail.component';
import {FormModalDialogService} from '../../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import {OpportunityConstant} from '../../../../constant/crm/opportunityConstant';
import {Router} from '@angular/router';
import {isNullOrUndefined} from 'util';
import {isNotNullOrUndefinedAndNotEmptyValue} from '../../../../stark-permissions/utils/utils';
import {AuthService} from '../../../../login/Authentification/services/auth.service';
import {PermissionConstant} from '../../../../Structure/permission-constant';

@Component({
  selector: 'app-contact-card-view',
  templateUrl: './contact-card-view.component.html',
  styleUrls: ['./contact-card-view.component.scss']
})
export class ContactCardViewComponent implements OnChanges {
  arrayBase64: any [];
  @Output() contactFromCard = new EventEmitter<any>();
  @Output() sendContactToDelete = new EventEmitter<any>();
  @Output() sendContactToArchive = new EventEmitter<any>();
  @Output() sendContactToRestore = new EventEmitter<any>();
  @Input() contactFiltred;
  @Input() contactType;
  @Input() isArchivingMode;
  @Output() prospectPageChangeEvent = new EventEmitter<any>();
  @Output() clientPageChangeEvent = new EventEmitter<any>();
  @Output() prospectStateChangeEvent = new EventEmitter<any>();
  @Output() clientStateChangeEvent = new EventEmitter<any>();
  @Input() prospectType;
  private currentPage: number = NumberConstant.ONE;
  pagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;

  public gridState: DataSourceRequestState = {
    skip: (this.currentPage * NumberConstant.TEN) - NumberConstant.TEN,
    take: NumberConstant.TEN,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: []
    }
  };
  public gridSettings: GridSettings = {
    state: this.gridState
  };
  public showed = false;
  dataToSendToPoPUp: any;
  public CRMPermissions = PermissionConstant.CRMPermissions;

  /**
   * @param contactService
   * @param contactCrmService
   * @param tiersService
   * @param sanitizer
   * @param genericCrmService
   * @param formModalDialogService
   * @param viewRef
   */
  constructor(private contactService: ContactService,
              private contactCrmService: ContactCrmService,
              private router: Router,
              private tiersService: TiersService,
              public sanitizer: DomSanitizer,
              private genericCrmService: GenericCrmService,
              private formModalDialogService: FormModalDialogService,
              private viewRef: ViewContainerRef,
              public authService: AuthService) {
    this.showed = true;
  }


  checkExisteData() {
    if (this.contactFiltred !== undefined && this.contactFiltred.gridData.data.length > 0) {
      return true;
    }
    return false;
  }

  goToDetails(contact) {
    this.router.navigateByUrl(ContactConstants.CONTACT_DETAILS_URL
      .concat(this.prospectType ? String(contact.id) : String(contact.Id)).concat('/' + !this.prospectType), {skipLocationChange: true});
  }

  deleteContact(contact, e) {
    e.stopPropagation();
    this.sendContactToDelete.emit(contact);
  }

  archiveContact(contact, e) {
    e.stopPropagation();
    this.sendContactToArchive.emit(contact);
  }

  restoreContact(contact, e) {
    e.stopPropagation();
    this.sendContactToRestore.emit(contact);
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges.contactFiltred) {
      this.arrayBase64 = [];
      this.getBase64File();
      this.gridSettings = simpleChanges.contactFiltred.currentValue;
    }
  }

  checkMail(c) {
    return c.IdTiers ? c.Email !== null && c.Email !== undefined : c.mail !== null && c.mail !== undefined;

  }

  checkPhone(c) {
    return c.IdTiers ? c.Tel1 !== null && c.Tel1 !== undefined : c.telephone !== null && c.telephone !== undefined;

  }

  checkFax(c) {
    return c.IdTiers ? c.Fax1 !== null && c.Fax1 !== undefined : c.fax !== null && c.fax !== undefined;

  }

  getBase64File() {
    this.contactFiltred.gridData.data.forEach((a, index) => {
      if (isNotNullOrUndefinedAndNotEmptyValue(a.photo)) {
        this.contactCrmService.getJavaGenericService().getFile('getpicture?fileName=' + a.photo).subscribe(response => {
          if (response.base64File !== '') {
            this.arrayBase64[index] = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/' + (response.name)
              .split('?')[0].split('.').pop() + ';base64,' + response.base64File);
          }
        });
      }
    });
  }

  checkArrayPicture(index) {
    if (this.arrayBase64) {
      return this.arrayBase64.length > 0 && this.arrayBase64[index];
    }
  }

  onPageChange(currentPage) {
    if (this.contactType === ContactConstants.PROSPECT_TYPE) {
      this.currentPage = currentPage - 1;
      this.prospectPageChangeEvent.emit(this.currentPage);
    } else if (this.contactType === ContactConstants.CLIENT_TYPE) {
      this.clientPageChangeEvent.emit((currentPage * NumberConstant.TEN) - NumberConstant.TEN);
    }
  }

  dataStateChange(state) {
    this.gridSettings.state = state;
    if (this.contactType === ContactConstants.PROSPECT_TYPE) {
      this.prospectStateChangeEvent.emit(state);
    } else if (this.contactType === ContactConstants.CLIENT_TYPE) {
      this.clientStateChangeEvent.emit(state);
    }
  }

  sendMail(contact, event) {
    event.stopPropagation();
    this.dataToSendToPoPUp = {
      listMails: [contact.IdTiers ? contact.Email : contact.mail]
    };
    this.showSendMailPopup();
  }

  showSendMailPopup() {
    this.formModalDialogService.openDialog(
      'Send Mail', PopupSendMailComponent, this.viewRef, null, this.dataToSendToPoPUp,
      false, SharedConstant.MODAL_DIALOG_SIZE_ML);
  }
}
