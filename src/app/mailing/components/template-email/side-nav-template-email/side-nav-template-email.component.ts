import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {TemplateEmail} from '../../../../models/mailing/template-email';
import {TranslateService} from '@ngx-translate/core';
import {SwalWarring} from '../../../../shared/components/swal/swal-popup';
import {AccountsConstant} from '../../../../constant/accounting/account.constant';
import {SharedConstant} from '../../../../constant/shared/shared.constant';
import {TemplateEmailSideNavService} from '../../../services/template-email-side-nav/template-email-side-nav.service';

@Component({
  selector: 'app-side-nav-template-email',
  templateUrl: './side-nav-template-email.component.html',
  styleUrls: ['./side-nav-template-email.component.scss']
})
export class SideNavTemplateEmailComponent implements OnInit, OnChanges {
  @Input() templateDataFromListTemplate;
  @Output() closeSidNav = new EventEmitter<any>();

  classDisplay = 'hidden collapse show';
  subscription: Subscription;
  templateDetail: TemplateEmail;
  largeSidNav = false;
  private templateDetailsIsInUpdateMode = false;

  constructor(private  sidNavService: TemplateEmailSideNavService, private translate: TranslateService,
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
    if (this.templateDetailsIsInUpdateMode === false) {
      this.closeSidNav.emit();
      this.sidNavService.hide();
    } else {
      this.openModalToConfirmClosingSidNav();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.templateDataFromListTemplate && this.templateDataFromListTemplate.value === true && this.templateDataFromListTemplate.data) {
      if (this.templateDetailsIsInUpdateMode) {
        this.openModalToConfirmOpeningOtherData();
      } else {
        this.templateDetail = null;
        this.classDisplay = 'hidden collapse show';
        this.templateDetail = this.templateDataFromListTemplate;
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
      this.templateDetailsIsInUpdateMode = true;
    } else if (event && event.isUpdate === false) {
      this.templateDetailsIsInUpdateMode = false;
    }
  }

  openModalToConfirmClosingSidNav() {
    const swalWarningMessage = `${this.translate.instant(AccountsConstant.CURRENT_OPERATION_HAS_NOT_BEEN_COMPLETED_YET)}`;
    this.swalWarring.CreateSwal(swalWarningMessage, AccountsConstant.ARE_YOU_SURE_TO_LEAVE_THE_OPERATION_WITHOUT_BEING_COMPLETED,
      SharedConstant.YES, SharedConstant.NO).then((result) => {
      if (result.value) {
        this.templateDetailsIsInUpdateMode = false;
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
        this.templateDetailsIsInUpdateMode = false;
        this.templateDetail = null;
        this.classDisplay = 'hidden collapse show';
        this.templateDetail = this.templateDataFromListTemplate;
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
