import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import swal from 'sweetalert2';
import { UserConstant } from '../../../constant/Administration/user.constant';
import { JobConstant } from '../../../constant/payroll/job.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { Job } from '../../../models/payroll/job.model';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { JobService } from '../../services/job/job.service';
import { ShowJobComponent } from '../show-job/show-job.component';

@Component({
  selector: 'app-list-job',
  templateUrl: './list-job.component.html',
  styleUrls: ['./list-job.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ListJobComponent implements OnInit, OnDestroy {

  public searchText: string;
  public data: any[];
  public parsedData: any[];
  public selectedKeys: any[] = ['0'];
  public selectedItemToOpen: any = [];
  public isNewJob = false;
  public isToShow = true;
  @ViewChild(ShowJobComponent) childShowDetailsJob;
  disabledSearch: boolean;
  selectedJob: Job;
  isUpdateMode: boolean;
  isSuperAdmin = false;

  public hasAddPermission: boolean;
  public hasUpdatePermission: boolean;
  public hasShowPermission: boolean;
  public hasDeletePermission: boolean;
  public hasSynchronizeJobsPermission: boolean;
  private subscriptions: Subscription[] = [];

  constructor(private jobService: JobService, private swalWarrings: SwalWarring, private translate: TranslateService,
              private authService: AuthService, private validationService: ValidationService) {
  }

  /**
   * On key up in search input
   * @param value
   * @param isFromPopup
   */
  public onkeyup(value: string, isFromAddForm?: boolean): void {
    this.searchText = value;
    // Search value in treeview
    this.parsedData = this.search(this.data, value);
    /* If returned list not null ==> [If action from on close modal ==> select the edited or added element
     * else if action of search from input ==> select central element] */
    if (this.parsedData.length > 0) {
      document.getElementById(JobConstant.DIV_BUTTON_EDIT).setAttribute(JobConstant.CLASS, '');
      document.getElementById(JobConstant.DIV_BUTTON_ADD).setAttribute(JobConstant.CLASS, '');
      if (!isFromAddForm) {
        // Action of search from input ==> select central element
        this.selectedKeys = ['0'];
        this.showDetails(this.data[0]);

      } else {
        this.showDetails(this.selectedJob);
      }
      this.isToShow = true;
    } else {
      // Disable div of edit and add button
      document.getElementById(JobConstant.DIV_BUTTON_EDIT).setAttribute(JobConstant.CLASS, JobConstant.DISABLED_DIV);
      if (value !== '') {
        document.getElementById(JobConstant.DIV_BUTTON_ADD).setAttribute(JobConstant.CLASS, JobConstant.DISABLED_DIV);
      } else {
        document.getElementById(JobConstant.DIV_BUTTON_ADD).setAttribute(JobConstant.CLASS, '');
      }
      this.isToShow = false;
    }
  }

  /**
   * Search items
   * @param Items
   * @param term
   */
  public search(Items: any[], term: string): any[] {
    return Items.reduce((acc, item) => {
      if (this.contains(item.Text, term)) {
        acc.push(item);
      } else if (item.Items && item.Items.length > 0) {
        const newItems = this.search(item.Items, term);
        // Return list of details of elements
        if (newItems.length > 0) {
          acc.push({
            Id: item.Id,
            Text: item.Text,
            Items: newItems,
            IsParent: item.IdUpperJob == null,
            Designation: item.Designation,
            FunctionSheet: item.FunctionSheet,
            IdUpperJob: item.IdUpperJob,
            IdUpperJobNavigation: item.IdUpperJobNavigation,
            JobEmployee: item.JobEmployee,
            JobSkills: item.JobSkills
          });
        }
      }

      return acc;
    }, []);
  }

  /**
   * Show detail of selected element
   * @param selectedItem
   */
  showDetails(selectedItem): void {
    if (this.childShowDetailsJob) {
      this.childShowDetailsJob.showDetails(selectedItem);
    }
  }

  /**
   * Return if Text Contains term
   * @param Text
   * @param term
   */
  public contains(Text: string, term: string): boolean {
    if (term && Text) {
      return Text.toLowerCase().indexOf(term.toLowerCase()) >= 0;
    } else {
      return true;
    }
  }

  showDetailsItemFromListOfData(code: string, listOfData) {
    const ctrl = this;
    listOfData.forEach(function (value) {
      if (value.WarehouseCode === code) {
        ctrl.showDetails(value);
      } else {
        if (value.Items) {
          ctrl.showDetailsItemFromListOfData(code, value.Items);
        }
      }
    });
  }


  /**
   * Add new element
   * @param isUpdateMode
   */
  public addNew(isUpdateMode: boolean, tr) {
    this.isUpdateMode = isUpdateMode;
    this.isToShow = false;
    this.isNewJob = true;
    tr.element.nativeElement.setAttribute('disabled', true);
    document.getElementById(JobConstant.DIV_BUTTON_EDIT).setAttribute(JobConstant.CLASS, JobConstant.DISABLED_DIV);
    document.getElementById(JobConstant.DIV_BUTTON_ADD).setAttribute(JobConstant.CLASS, JobConstant.DISABLED_DIV);
    this.disabledSearch = true;
    if (!this.selectedJob) {
      this.selectedJob = this.parsedData[0];
    }
  }


  /**
   * Event on select
   * @param param0
   */
  public handleSelection({index, dataItem}: any): void {
    // Selected key
    this.selectedKeys = [index];
    this.selectedJob = dataItem;
    // If selected element is a warehouse ==> disable add button
    if ( document.getElementById(JobConstant.DIV_BUTTON_ADD)) {
      if (dataItem.IsWarehouse && !dataItem.IsCentral) {
        document.getElementById(JobConstant.DIV_BUTTON_ADD).setAttribute(JobConstant.CLASS, JobConstant.DISABLED_DIV);
      } else {
        document.getElementById(JobConstant.DIV_BUTTON_ADD).setAttribute(JobConstant.CLASS, '');
      }
    }
    // Show details of selected element
    this.showDetails(dataItem);
  }

  deleteWarehouse(dataItem) {
    this.swalWarrings.CreateSwal().then((result) => {
      if (result.value) {
        this.subscriptions.push(this.jobService.remove(dataItem).subscribe(() => {
          this.initGridDataSource(false, false);
        }));
      }
    });
  }

  /**
   * Retreive the data from the server
   */
  initGridDataSource(isToRefresh, pointedToSelectedJob?: boolean) {
    this.subscriptions.push(this.jobService.getJobList().subscribe(res => {
        this.data = res;
        this.parsedData = res;
        if (!pointedToSelectedJob) {
          this.selectedJob = res[0];
          this.selectedKeys = ['0'];
        }
        // if is not juste to refresh ==> select central element and show details of central
        if (res.length > 0 && !isToRefresh) {
          this.showDetails(res[0]);
        }
        // If list of warehouse empty
        if (res.length === 0) {
          // Disable edit button
          document.getElementById(JobConstant.DIV_BUTTON_EDIT).setAttribute(JobConstant.CLASS, JobConstant.DISABLED_DIV);
          // Do not show details
          this.isToShow = false;
        }
        // If is juste refresh ==> select last selected element
        if (isToRefresh) {
          this.onkeyup(this.searchText, true);
        }
        if (pointedToSelectedJob) {
          this.findSelectedJob(this.data);
          this.showDetails(this.selectedJob);
        }
      }
    ));
  }

  getAllItemsAsArray(result, items) {
    if (items.length) {
      items.forEach(item => {
        result.push(item);
      });
    }
    return result;
  }

  refreshTreeView(tr) {
    this.isToShow = true;
    this.isNewJob = false;
    tr.element.nativeElement.removeAttribute('disabled');
    document.getElementById(JobConstant.DIV_BUTTON_EDIT).setAttribute(JobConstant.CLASS, '');
    document.getElementById(JobConstant.DIV_BUTTON_ADD).setAttribute(JobConstant.CLASS, '');
    this.disabledSearch = false;
    this.initGridDataSource(true, true);
  }

  ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.ADD_JOB);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.UPDATE_JOB);
    this.hasDeletePermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.DELETE_JOB);
    this.hasShowPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.SHOW_JOB);
    this.hasSynchronizeJobsPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.SYNCHRONIZE_JOBS);
    this.initGridDataSource(false);
  }

  synchronizeJobs() {
    this.subscriptions.push(this.jobService.synchronizeJobs().subscribe(result => {
      if (result) {
        const message = this.translate.instant(UserConstant.SUCCESSFUL_SYNCHRONIZATION);
        swal.fire({
          icon: SharedConstant.SUCCESS,
          html: message,
          confirmButtonColor: SharedConstant.STARK_DEFAULT_COLOR
        });
      }
      this.initGridDataSource(false);
    }));
  }

  isFormChanged(): boolean {
    return !this.isToShow || this.isNewJob;

  }

  /**
   * this method will be called by CanDeactivateGuard service to check the leaving component possibility
   */
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.validationService.handleCanDeactivateToLeaveCurrentComponent(this.isFormChanged.bind(this));
  }

  ngOnDestroy(): void {
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }

  private findSelectedJob(job: any[]) {
    const jobFind = (job.find(x => x.Id === this.selectedJob.IdUpperJob || x.Id === this.selectedJob.Id));
    if (!jobFind) {
      const allItems = [];
      (job.filter(x => x.Items)).map(({Items}) => Items).reduce(this.getAllItemsAsArray, allItems);
      this.findSelectedJob(allItems);
    } else {
      if (jobFind.Id === this.selectedJob.IdUpperJob) {
        this.selectedJob = (jobFind.Items).find(x => x.Id === this.selectedJob.Id);
      } else {
        this.selectedJob = jobFind;
      }
    }
  }
}
