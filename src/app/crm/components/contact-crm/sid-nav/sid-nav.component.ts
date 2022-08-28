import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {ContactCrm} from '../../../../models/crm/contactCrm.model';
import {SideNavService} from '../../../services/sid-nav/side-nav.service';
import {AccountsConstant} from '../../../../constant/accounting/account.constant';
import {SharedConstant} from '../../../../constant/shared/shared.constant';
import {TranslateService} from '@ngx-translate/core';
import {SwalWarring} from '../../../../shared/components/swal/swal-popup';
import {ClaimSideNavService} from '../../../services/sid-nav/claim-side-nav.service';

@Component({
  selector: 'app-sid-nav',
  templateUrl: './sid-nav.component.html',
  styleUrls: ['./sid-nav.component.scss']
})
export class SidNavComponent implements OnInit, OnChanges {

  classDisplay: String = 'hidden collapse';
  subscription: Subscription;
  contactDetail: ContactCrm;
  largeSidNav = false;

  @Input() source: string;
  @Input() contactFromContactList;
  @Output() closeSidNav = new EventEmitter<any>();
  @Input() isArchivingMode = false;
  @Input() isFromArchive = false;
  @Input() fromRelatedArchiving = false;
  @Output() sideNavUpdateMode = new EventEmitter<boolean>();

  private contactDetailsIsInUpdateMode = false;

  constructor(private  sidNavService: SideNavService, private translate: TranslateService,
              private claimSideNaveService: ClaimSideNavService,
              private swalWarring: SwalWarring) {
  }

  ngOnInit() {
    this.subscription = this.sidNavService.getResult().subscribe((_: any) => {
      if (_.value === false) {
        this.classDisplay = 'hidden collapse';
      }
    });
  }

  hideDisplay() {
    if (this.contactDetailsIsInUpdateMode === false) {
      this.closeSidNav.emit();
    } else {
      this.openModalToConfirmClosingSidNav();
    }
  }

  closeSideNaveAndUpdate() {
    if (this.contactDetailsIsInUpdateMode === false) {
      this.closeSidNav.emit();
      this.sidNavService.updateContactFromOrganizationDetails('organization-details');
    } else {
      this.openModalToConfirmClosingSidNav();
    }
  }

  passeToUpdateMode(event) {
    if (event && event.isUpdate === true) {
      this.contactDetailsIsInUpdateMode = true;
    } else if (event && event.isUpdate === false) {
      this.contactDetailsIsInUpdateMode = false;
    }
    this.sideNavUpdateMode.emit(this.contactDetailsIsInUpdateMode);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.contactFromContactList && this.contactFromContactList.value === true && this.contactFromContactList.data) {
      if (this.contactDetailsIsInUpdateMode === true) {
        this.openModalToConfirmOpeningOtherData();
      } else {
        this.contactDetail = null;
        this.classDisplay = 'hidden collapse show';
        this.contactDetail = this.contactFromContactList;
      }
    } else {
      this.classDisplay = 'hidden collapse';
    }
  }

  resizeSidNav(value) {
    this.largeSidNav = value;
  }

  openModalToConfirmClosingSidNav() {
    const swalWarningMessage = `${this.translate.instant(AccountsConstant.CURRENT_OPERATION_HAS_NOT_BEEN_COMPLETED_YET)}`;
    this.swalWarring.CreateSwal(swalWarningMessage, AccountsConstant.ARE_YOU_SURE_TO_LEAVE_THE_OPERATION_WITHOUT_BEING_COMPLETED,
      SharedConstant.YES, SharedConstant.NO).then((result) => {
      if (result.value) {
        this.contactDetailsIsInUpdateMode = false;
        this.closeSidNav.emit();
        this.sidNavService.updateContactFromOrganizationDetails('organization-details');
      }
    });
  }

  openModalToConfirmOpeningOtherData() {
    const swalWarningMessage = `${this.translate.instant(AccountsConstant.CURRENT_OPERATION_HAS_NOT_BEEN_COMPLETED_YET)}`;
    this.swalWarring.CreateSwal(swalWarningMessage, AccountsConstant.ARE_YOU_SURE_TO_LEAVE_THE_OPERATION_WITHOUT_BEING_COMPLETED,
      SharedConstant.YES, SharedConstant.NO).then((result) => {
      if (result.value) {
        this.contactDetailsIsInUpdateMode = false;
        this.contactDetail = null;
        this.classDisplay = 'hidden collapse show';
        this.contactDetail = this.contactFromContactList;
      }
    });
  }

  sidenavWidthStyle() {
    const sidNav = document.getElementsByClassName('sidebar-lg-show');
    const asideNav = document.getElementsByClassName(' aside-menu-lg-show');
    const marginLeft = sidNav.length === 0 ? '5px' : '200px';
    const marginRight = asideNav.length === 0 ? '0px' : '235px';
    return {'overflow-y': ' unset', 'margin-left': marginLeft, 'margin-right': marginRight};
  }
}
