import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {AccountsConstant} from '../../../../constant/accounting/account.constant';
import {SharedConstant} from '../../../../constant/shared/shared.constant';
import {TranslateService} from '@ngx-translate/core';
import {SwalWarring} from '../../../../shared/components/swal/swal-popup';
import {ClaimSideNavService} from '../../../services/sid-nav/claim-side-nav.service';

@Component({
  selector: 'app-side-nav-claim',
  templateUrl: './side-nav-claim.component.html',
  styleUrls: ['./side-nav-claim.component.scss']
})
export class SideNavClaimComponent implements OnInit, OnChanges {
  classDisplay: String = 'hidden collapse show';
  subscription: Subscription;
  claimDetail;
  largeSidNav = false;
  @Input() source;
  @Input() claimFromClaimsList;
  @Output() closeSidNav = new EventEmitter<any>();
  @Input() isArchivingMode = false;
  @Input() fromRelatedArchiving = false;
  @Output() sideNavUpdateMode = new EventEmitter<boolean>();
  private claimDetailsIsInUpdateMode = false;

  constructor(private  sidNavService: ClaimSideNavService, private translate: TranslateService,
              private swalWarring: SwalWarring) {
  }

  ngOnInit() {
    this.subscription = this.sidNavService.getResult().subscribe((result: any) => {
      if (result.value === false || result === false) {
        this.classDisplay = 'hidden collapse';
      }
    });
  }

  hideDisplay() {
    if (this.claimDetailsIsInUpdateMode === false) {
      this.closeSidNav.emit();
      this.sidNavService.hide();
    } else {
      this.openModalToConfirmClosingSidNav();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.claimFromClaimsList && this.claimFromClaimsList.value === true && this.claimFromClaimsList.data) {

      if (this.claimDetailsIsInUpdateMode) {
        this.openModalToConfirmOpeningOtherData();
      } else {
        this.claimDetail = null;
        this.classDisplay = 'hidden collapse show';
        this.claimDetail = this.claimFromClaimsList;
      }
    } else {
      this.classDisplay = 'hidden collapse';
    }
  }

  resizeSidNav(value) {
    this.largeSidNav = value;
  }

  passeToUpdateMode(event) {
    if (event && event.isUpdate === true) {
      this.claimDetailsIsInUpdateMode = true;
    } else if (event && event.isUpdate === false) {
      this.claimDetailsIsInUpdateMode = false;
    }
    this.sideNavUpdateMode.emit(this.claimDetailsIsInUpdateMode);
  }

  openModalToConfirmClosingSidNav() {
    const swalWarningMessage = `${this.translate.instant(AccountsConstant.CURRENT_OPERATION_HAS_NOT_BEEN_COMPLETED_YET)}`;
    this.swalWarring.CreateSwal(swalWarningMessage, AccountsConstant.ARE_YOU_SURE_TO_LEAVE_THE_OPERATION_WITHOUT_BEING_COMPLETED,
      SharedConstant.YES, SharedConstant.NO).then((result) => {
      if (result.value) {
        this.claimDetailsIsInUpdateMode = false;
        this.closeSidNav.emit();
        this.sidNavService.hide();
      }
    });
  }

  openModalToConfirmOpeningOtherData() {
    const swalWarningMessage = `${this.translate.instant(AccountsConstant.CURRENT_OPERATION_HAS_NOT_BEEN_COMPLETED_YET)}`;
    this.swalWarring.CreateSwal(swalWarningMessage, AccountsConstant.ARE_YOU_SURE_TO_LEAVE_THE_OPERATION_WITHOUT_BEING_COMPLETED,
      SharedConstant.YES, SharedConstant.NO).then((result) => {
      if (result.value) {
        this.claimDetailsIsInUpdateMode = false;
        this.claimDetail = null;
        this.classDisplay = 'hidden collapse show';
        this.claimDetail = this.claimFromClaimsList;
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
