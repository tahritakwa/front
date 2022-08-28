import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PagerSettings, RowArgs } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { Subscription } from 'rxjs/Subscription';
import { InterviewConstant } from '../../../constant/rh/interview.constant';
import { RecruitmentConstant } from '../../../constant/rh/recruitment.constant';
import { ReviewConstant } from '../../../constant/rh/review.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { FormValidationState } from '../../../models/enumerators/FormValidationState.enum';
import { InterviewEnumerator } from '../../../models/enumerators/interview.enum';
import { ReviewState } from '../../../models/enumerators/review-state.enum';
import { Employee } from '../../../models/payroll/employee.model';
import { Interview } from '../../../models/rh/interview.model';
import { Review } from '../../../models/rh/Review.model';
import { EmployeeService } from '../../../payroll/services/employee/employee.service';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { UserCurrentInformationsService } from '../../../shared/services/utility/user-current-informations.service';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { Filter, Operation, PredicateFormat, Relation } from '../../../shared/utils/predicate';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { AddInterviewComponent } from '../../interview/add-interview/add-interview.component';
import { ReviewService } from '../../services/review/review.service';

@Component({
  selector: 'app-list-review',
  templateUrl: './list-review.component.html',
  styleUrls: ['./list-review.component.scss']
})
export class ListReviewComponent implements OnInit, OnDestroy {

  public reviewFilterFormGroup: FormGroup;
  startDateFilter: Date;
  endDateFilter: Date;
  predicate: PredicateFormat;
  listReview: Array<Review>;
  public postponeMode: any = [];
  public inteviewEnumerator = InterviewEnumerator;
  public formValidationState = FormValidationState;
  public reviewState = ReviewState;
  public interviewOfCurrentEmail: Interview;
  hasAllRights: boolean;
  selectedReview: Review;
  public reviewMode: any = [];
  public connectedEmployeeId: number;
  private subscriptions: Subscription[]= [];

  statusFilter: Array<any> = [{ 'id': ReviewState.ToPlan, 'name': this.translateService.instant(ReviewConstant.TO_PLAN) },
    { 'id': ReviewState.InProgress, 'name': this.translateService.instant(ReviewConstant.IN_PROGRESS_REVIEW) },
    { 'id': ReviewState.Completed, 'name': this.translateService.instant(ReviewConstant.COMPLETED) },
    { 'id': ReviewState.NotPlanned, 'name': this.translateService.instant(ReviewConstant.NOT_PLANNED) }
  ];
  defaultStatus: any = {
    'id': NumberConstant.ZERO,
    'name': this.translateService.instant(RecruitmentConstant.ALL_RECRUITMENT)
  };
  statusSelected: number;
  idSelectedEmployee: number;
  /**
   * permissions
   */
  public hasAddInterviewPermission: boolean;
  public hasShowReviewPermission: boolean;
  public hasShowInterviewPermission: boolean;
  public hasAddReviewPermission: boolean;
  public connectedEmployee: Employee;
  // pager settings for review
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  hideEmployeeDropDown = false;
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
      field: ReviewConstant.FULL_NAME,
      title: ReviewConstant.FULL_NAME_TITLE,
      filterable: true,
      tooltip: ReviewConstant.FULL_NAME_TITLE,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: ReviewConstant.REVIEW_DATE,
      title: ReviewConstant.WORK_ANNIVERSARY,
      filterable: true,
      filter: 'date',
      format: this.translateService.instant(SharedConstant.DATE_FORMAT),
      tooltip: ReviewConstant.WORK_ANNIVERSARY,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: ReviewConstant.ID_MANAGER_NAVIGATION_FULL_NAME,
      title: ReviewConstant.MANAGER_NAME,
      filterable: true,
      tooltip: ReviewConstant.MANAGER_NAME,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: ReviewConstant.STATE,
      title: ReviewConstant.STATE_TITLE,
      filterable: true,
      filter: 'numeric',
      tooltip: ReviewConstant.STATE_TITLE,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: ReviewConstant.FORM_MANAGER,
      title: ReviewConstant.FORM_MANAGER,
      filterable: true,
      tooltip : ReviewConstant.FORM_MANAGER,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: ReviewConstant.FORM_EMPLOYEE,
      title: ReviewConstant.FORM_EMPLOYEE,
      filterable: true,
      tooltip: ReviewConstant.FORM_EMPLOYEE,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    }
  ];

  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };


  @Output() actionSelected = new EventEmitter<boolean>();
  @Input() reviewId: number;
  // select first row by default
  public mySelection: any[] = [0];
  public isRowSelected = (e: RowArgs) => this.mySelection.indexOf(e.index) >= 0;
  public formatDate = this.translateService.instant(SharedConstant.DATE_FORMAT);
  constructor(public reviewService: ReviewService,
    private router: Router,
    private translateService: TranslateService,
    private formModalDialogService: FormModalDialogService,
    private viewRef: ViewContainerRef,
    private swalWarrings: SwalWarring,
    private fb: FormBuilder,
      private userCurrentInformationsService: UserCurrentInformationsService, public authService: AuthService, private employeeService: EmployeeService) { }

  ngOnInit() {
    this.hasAddInterviewPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.ADD_INTERVIEW);
    this.hasShowReviewPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.SHOW_REVIEW);
    this.hasShowInterviewPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.SHOW_INTERVIEW);
    this.hasAddReviewPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.ADD_REVIEW);
    this.userCurrentInformationsService.getConnectedEmployeeId().subscribe(idEmployee => {
      this.connectedEmployeeId = idEmployee;
    });
    this.startDateFilter = new Date();
    this.endDateFilter = new Date();
    this.endDateFilter.setMonth(this.endDateFilter.getMonth() + NumberConstant.ONE);
    this.statusSelected = NumberConstant.ZERO;
    this.createReviewFilterFormGroup();
    this.employeeService.getConnectedEmployee().subscribe(result => {
      this.connectedEmployee = result;
      this.initGridDataSource();
    });
  }

  public createReviewFilterFormGroup() {
    this.reviewFilterFormGroup = this.fb.group({
      startDate: [this.startDateFilter, [Validators.required] ],
      endDate: [this.endDateFilter, [Validators.required]]
    });
  }

  public initGridDataSource(isFromSearch?: boolean): void {
    this.listReview = new Array<Review>();
    if (isFromSearch) {
      this.gridSettings.state.skip = NumberConstant.ZERO;
    }
    this.preparePredicate();
    this.subscriptions.push(this.reviewService.reloadServerSideData(this.gridSettings.state, this.predicate).subscribe(data => {
        this.selectedReview = data.data[NumberConstant.ZERO];
        this.gridSettings.gridData = data;
        this.mySelection = [0];
      }
    ));
  }

  private preparePredicate() {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Filter.push(new Filter(ReviewConstant.REVIEW_DATE, Operation.gte, this.startDateFilter));
    this.predicate.Filter.push(new Filter(ReviewConstant.REVIEW_DATE, Operation.lte, this.endDateFilter));
    this.predicate.Relation.push.apply(this.predicate.Relation,
      [new Relation(ReviewConstant.INTERVIEW)]);
    this.predicate.Relation.push.apply(this.predicate.Relation,
      [new Relation(ReviewConstant.ID_EMPLOYEE_COLLABORATOR_NAVIGATION)]);
    this.predicate.Relation.push.apply(this.predicate.Relation,
      [new Relation(ReviewConstant.ID_MANAGER_NAVIGATION)]);
    if (this.statusSelected > NumberConstant.ZERO) {
      this.predicate.Filter.push(new Filter(RecruitmentConstant.STATE, Operation.eq, this.statusSelected));
    }
    if (this.idSelectedEmployee) {
      this.predicate.Filter.push(new Filter(ReviewConstant.ID_EMPLOYEE_COLLABORATOR, Operation.eq, this.idSelectedEmployee));
    }
  }

  public goToAdvancedEdit(id) {
    this.router.navigateByUrl(ReviewConstant.REVIEW_EDIT_URL.concat(id));
  }

  public changeStartDate(selectedDate: Date) {
    this.selectedReview = undefined;
    this.startDateFilter = selectedDate;
    if (this.startDateFilter && this.startDateFilter > this.endDateFilter) {
      this.endDateFilter = this.startDateFilter;
    }
    if (this.reviewFilterFormGroup.valid) {
      this.initGridDataSource(true);
    }
  }

  public changeEndDate(selectedDate: Date) {
    this.selectedReview = undefined;
    this.endDateFilter = selectedDate;
    if (this.endDateFilter && this.endDateFilter < this.startDateFilter) {
      this.startDateFilter = this.endDateFilter;
    }
    if (this.reviewFilterFormGroup.valid) {
      this.initGridDataSource(true);
    }
  }

  public onStatusFilterChanged($event: any) {
    this.selectedReview = undefined;
    this.statusSelected = $event.id;
    if (this.reviewFilterFormGroup.valid) {
      this.initGridDataSource(true);
    }
  }

  onDropdownEmployeeSelected($event) {
    this.selectedReview = undefined;
    this.idSelectedEmployee = $event.selectedEmployee;
    if (this.reviewFilterFormGroup.valid) {
      this.initGridDataSource(true);
    }
  }
  openPhysicalReviewModal(review: Review) {
    this.reviewMode[InterviewConstant.REVIEW_MODE] = true;
    this.reviewMode[InterviewConstant.REVIEW_ID] = review.Id;
    this.reviewMode[InterviewConstant.ID_EMPLOYEE_COLLABORATOR] = review.IdEmployeeCollaborator;
    this.reviewMode[InterviewConstant.ID_EMPLOYEE_NAVIGATION] = review.IdEmployeeCollaboratorNavigation;
    this.formModalDialogService.openDialog(ReviewConstant.ADD_PHYSICAL_INTERVIEW,
      AddInterviewComponent, this.viewRef, this.onCloseInterviewModal.bind(this),
      this.reviewMode, true, SharedConstant.MODAL_DIALOG_SIZE_M);
  }

  private onCloseInterviewModal(data: any): void {
    this.actionSelected.emit();
    this.initGridDataSource();
  }

  public formatTime(): string {
    return SharedConstant.PIPE_FORMAT_TIME;
  }

  public timeZone(): string {
    return SharedConstant.GMT_TIMEZONE;
  }

  public hideTheEmployeeDropdown(): void {
    this.hideEmployeeDropDown = true;
  }

  public dataStateChange(state: State): void {
    this.gridSettings.state = state;
    this.initGridDataSource();
  }

  public addReview(review: Review) {
    this.swalWarrings.CreateSwal(ReviewConstant.ADD_REVIEW_TEXT, ReviewConstant.ADD_REVIEW_TITLE,
      SharedConstant.VALIDATION_CONFIRM).then((result) => {
      if (result.value) {
        review.IdEmployeeCollaboratorNavigation = null;
        review.State = ReviewState.ToPlan;
        this.subscriptions.push(this.reviewService.save(review, true).subscribe(res => {
          this.initGridDataSource();
        }));
      }
    });
  }

  setSelectedReview(review) {
    this.selectedReview = review.dataItem;
  }


  selectRow(event: any) {
    if (event && event.selectedRows[0]) {
      this.mySelection = [event.selectedRows[0].index];
    }
  }

  ngOnDestroy(): void {
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }
}
