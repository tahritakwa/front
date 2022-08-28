import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {Action} from '../../../../models/crm/action.model';
import {AccountsConstant} from '../../../../constant/accounting/account.constant';
import {SharedConstant} from '../../../../constant/shared/shared.constant';
import {TranslateService} from '@ngx-translate/core';
import {SwalWarring} from '../../../../shared/components/swal/swal-popup';
import {ActionSidNavService} from '../../../services/sid-nav/action-sid-nav.service';

@Component({
  selector: 'app-side-nav-action',
  templateUrl: './side-nav-action.component.html',
  styleUrls: ['./side-nav-action.component.scss']
})
export class SideNavActionComponent implements OnInit, OnChanges {
  classDisplay: String = 'hidden collapse show';
  subscription: Subscription;
  actionDetail: Action;
  largeSidNav = false;

  @Input() isArchivingMode = false;
  @Input() isFromArchive = false;
  @Input() actionFromActionsList;
  @Output() closeSidNav = new EventEmitter<any>();
  @Output() sideNavUpdateMode = new EventEmitter<boolean>();
  private actionDetailsIsInUpdateMode = false;

  constructor(private  sidNavService: ActionSidNavService,
              private translate: TranslateService,
              private swalWarring: SwalWarring) {
  }

  ngOnInit() {
  }

  hideDisplay() {
    if (this.actionDetailsIsInUpdateMode === false) {
      this.closeSidNav.emit();
      this.sidNavService.hide();
    } else {
      this.openModalToConfirmClosingSidNav();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.actionFromActionsList &&
      this.actionFromActionsList.value === true && this.actionFromActionsList.data) {
      if (this.actionDetailsIsInUpdateMode) {
        this.openModalToConfirmOpeningOtherData();
      } else {
        this.actionDetail = null;
        this.classDisplay = 'hidden collapse show';
        this.actionDetail = this.actionFromActionsList;
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
      this.actionDetailsIsInUpdateMode = true;
    } else if (event && event.isUpdate === false) {
      this.actionDetailsIsInUpdateMode = false;
    }
    this.sideNavUpdateMode.emit(this.actionDetailsIsInUpdateMode);
  }

  openModalToConfirmClosingSidNav() {
    const swalWarningMessage = `${this.translate.instant(AccountsConstant.CURRENT_OPERATION_HAS_NOT_BEEN_COMPLETED_YET)}`;
    this.swalWarring.CreateSwal(swalWarningMessage, AccountsConstant.ARE_YOU_SURE_TO_LEAVE_THE_OPERATION_WITHOUT_BEING_COMPLETED,
      SharedConstant.YES, SharedConstant.NO).then((result) => {
      if (result.value) {
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
        this.actionDetail = null;
        this.classDisplay = 'hidden collapse show';
        this.actionDetail = this.actionFromActionsList;
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
