import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {OrganisationConstant} from '../../../../constant/crm/organisation.constant';
import {OrganisationSideNavService} from '../../../services/sid-nav/organisation-side-nav.service';
import {AccountsConstant} from '../../../../constant/accounting/account.constant';
import {SharedConstant} from '../../../../constant/shared/shared.constant';
import {TranslateService} from '@ngx-translate/core';
import {SwalWarring} from '../../../../shared/components/swal/swal-popup';

@Component({
  selector: 'app-side-nav-organisation-details',
  templateUrl: './side-nav-organisation-details.component.html',
  styleUrls: ['./side-nav-organisation-details.component.scss']
})
export class SideNavOrganisationDetailsComponent implements OnInit, OnChanges {

  classDisplay = OrganisationConstant.HIDDEN_COLLAPSES;
  subscription: Subscription;
  prospectType: boolean;
  showContactDetails = false;
  idContactEvent;
  organisationDetailsData;
  largeSidNav = false;
  organizationDetailsIsInUpdateMode = false;
  @Input() organisationFromList;
  @Input() isArchivingMode = false;
  @Input() fromRelatedArchiving = false;
  @Output() sideNavUpdateMode = new EventEmitter<boolean>();

  constructor(private sideNavService: OrganisationSideNavService,
              private translate: TranslateService,
              private swalWarring: SwalWarring) {

  }

  ngOnInit() {
  }

  hideDisplay(): void {
    if (this.organizationDetailsIsInUpdateMode === true) {
      this.openModalToConfirmClosingSidNav();
    } else if (this.organizationDetailsIsInUpdateMode === false) {
      this.sideNavService.hide(this.prospectType);
    }
  }

  showContact(event) {
    if (event) {
      this.showContactDetails = true;
      this.idContactEvent = event.data.id;
    }
  }

  passeToUpdateMode(event) {
    if (event && event.isUpdate === true) {
      this.organizationDetailsIsInUpdateMode = true;
    } else if (event && event.isUpdate === false) {
      this.organizationDetailsIsInUpdateMode = false;
    }
    this.sideNavUpdateMode.emit(this.organizationDetailsIsInUpdateMode);
  }

  ngOnChanges(changes: SimpleChanges): void {


    if (this.organisationFromList && this.organisationFromList.value === true && this.organisationFromList.data) {
      if (this.organizationDetailsIsInUpdateMode === true) {
        this.openModalToConfirmOpeningOtherData();
      } else {
        this.organisationDetailsData = null;
        this.showContactDetails = false;
        this.prospectType = this.organisationFromList.prospectType;
        this.organisationDetailsData = this.organisationFromList.data;
        this.classDisplay = 'hidden collapse show';
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
        this.sideNavService.hide(this.prospectType);
        this.organizationDetailsIsInUpdateMode = false;
      }
    });
  }


  openModalToConfirmOpeningOtherData() {
    const swalWarningMessage = `${this.translate.instant(AccountsConstant.CURRENT_OPERATION_HAS_NOT_BEEN_COMPLETED_YET)}`;
    this.swalWarring.CreateSwal(swalWarningMessage, AccountsConstant.ARE_YOU_SURE_TO_LEAVE_THE_OPERATION_WITHOUT_BEING_COMPLETED,
      SharedConstant.YES, SharedConstant.NO).then((result) => {
      if (result.value) {
        this.organisationDetailsData = null;
        this.showContactDetails = false;
        this.prospectType = this.organisationFromList.prospectType;
        this.organisationDetailsData = this.organisationFromList.data;
        this.classDisplay = 'hidden collapse show';
        this.organizationDetailsIsInUpdateMode = false;
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
