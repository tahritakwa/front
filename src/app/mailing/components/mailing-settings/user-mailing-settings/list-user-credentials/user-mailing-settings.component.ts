import {Component, Input, OnInit, ViewContainerRef} from '@angular/core';
import {ColumnSettings} from '../../../../../shared/utils/column-settings.interface';
import {GridSettings} from '../../../../../shared/utils/grid-settings.interface';
import {State} from '@progress/kendo-data-query';
import {NumberConstant} from '../../../../../constant/utility/number.constant';
import {PredicateFormat} from '../../../../../shared/utils/predicate';
import {EmployeeService} from '../../../../../payroll/services/employee/employee.service';
import {PagerSettings} from '@progress/kendo-angular-grid';
import {MailingConstant} from '../../../../../constant/mailing/mailing.constant';
import {SwalWarring} from '../../../../../shared/components/swal/swal-popup';
import {TranslateService} from '@ngx-translate/core';
import {GrowlService} from '../../../../../../COM/Growl/growl.service';
import {FormModalDialogService} from '../../../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import {TemplateEmailSideNavService} from '../../../../services/template-email-side-nav/template-email-side-nav.service';
import {UserService} from '../../../../../administration/services/user/user.service';
import {el} from '@angular/platform-browser/testing/src/browser_util';
import {AddActionComponent} from '../../../../../crm/components/action/add-action/add-action.component';
import {SharedConstant} from '../../../../../constant/shared/shared.constant';
import {DetailsUserCredentialsComponent} from '../details-user-credentials/details-user-credentials.component';
import {RoleConstant} from '../../../../../constant/Administration/role.constant';
import {LocalStorageService} from '../../../../../login/Authentification/services/local-storage-service';

@Component({
  selector: 'app-user-mailing-settings',
  templateUrl: './user-mailing-settings.component.html',
  styleUrls: ['./user-mailing-settings.component.scss']
})
export class UserMailingSettingsComponent implements OnInit {
  public showDetail = false;
  public usersList: any;
  private connectedUserId;

  public isAdminConnected = false;

  public predicate: PredicateFormat = new PredicateFormat();
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  private pageSize = NumberConstant.TEN;

  constructor(private employeeService: EmployeeService, private swalWarring: SwalWarring, private translate: TranslateService,
              private growlService: GrowlService, private formModalDialogService: FormModalDialogService,
              private userService: UserService, private localStorageService : LocalStorageService,
              private viewRef: ViewContainerRef) {
  }

  public gridState: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TEN,
    filter: {
      logic: 'and',
      filters: []
    }
  };
  public columnsConfig: ColumnSettings[] = [
    {
      field: 'FirstName',
      title: 'FIRST_NAME',
      filterable: true
    },
    {
      field: 'LastName',
      title: 'LAST_NAME',
      filterable: true
    },
    {
      field: 'Email',
      title: 'EMAIL',
      filterable: true
    }
  ];
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };

  ngOnInit() {
    this.initGridDataSource();
  }

  onPageChange(event) {
    this.pageSize = event.take;
    this.gridState = event;
    this.initGridDataSource();
  }

  public getAllUsersList() {
    this.userService.listdropdownWithPerdicate(this.predicate).subscribe((dataEmp: any) => {
      if (dataEmp) {
        this.gridSettings.gridData = {
          data: dataEmp.listData,
          total: dataEmp.total
        };
      }
    });
  }

  private preparePredicate(pageNumber?, predicate?) {
    if (pageNumber) {
      this.gridState.skip = pageNumber;
    }
    if (predicate) {
      this.predicate = predicate;
    } else {
      this.predicate = this.userService.preparePrediacteFormat(this.gridState);
    }
  }

  private checkUserCredential() {
    this.getConnectedUser();
    let userRoles = [];
    const currentUser = this.usersList.find(user => user.Id === this.connectedUserId);
    if (currentUser && currentUser.UserRole.length > 0) {
      userRoles = currentUser.UserRole;
      const searchedUser = userRoles.find(userRole => userRole.IdRoleNavigation.Code === RoleConstant.ADMIN_CODE);
      this.isAdminConnected = !!searchedUser;
    }
  }

  private fillListWithOwnData() {
    const employee = this.localStorageService.getUser();
    employee.Id = this.localStorageService.getUserId();
    const employeeList = [];
    employeeList.push(employee);
    if (employee) {
      this.gridSettings.gridData = {
        data: employeeList,
        total: 1
      };
    }
  }

  private initListByCredentials() {
    this.checkUserCredential();
    if (!this.isAdminConnected) {
      this.fillListWithOwnData();
    } else {
      this.getAllUsersList();
    }
  }

  public receiveData(event: any) {
    const predicate: PredicateFormat = Object.assign({}, null, event.predicate);
    this.preparePredicate(NumberConstant.ZERO, predicate);
    this.initGridDataSource(predicate);
  }

  private getConnectedUser() {
    this.connectedUserId = this.localStorageService.getUserId();
  }

  public initGridDataSource(predicate?) {
    this.preparePredicate(undefined, predicate);
    this.userService.getAllUserWithoutState()
      .subscribe(data => {
        this.usersList = data.data;
        this.initListByCredentials();
      });
  }


  public dataStateChange(state: State): void {
    this.gridSettings.state = state;
  }


  public onCellClick(event) {
    if (event.columnIndex || event.columnIndex === 0) {
      if (event.columnIndex !== event.sender.columns.length - 1) {
        this.prepareDataForPopUp(event.dataItem);
      }
    }
  }

  public onDetailsClick(event) {
    this.prepareDataForPopUp(event);
  }

  private prepareDataForPopUp(data) {
    this.formModalDialogService.openDialog(null, DetailsUserCredentialsComponent, this.viewRef,
      this.afterClose.bind(this), {data: data},
      false, SharedConstant.MODAL_DIALOG_SIZE_S);
  }

  private afterClose() {

  }

  SidNavEvent() {
    this.showDetail = false;
  }
}
