import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { isNullOrUndefined } from 'util';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { ReviewConstant } from '../../../constant/rh/review.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { ReviewState } from '../../../models/enumerators/review-state.enum';
import { Employee } from '../../../models/payroll/employee.model';
import { ReviewForm } from '../../../models/rh/review-form.model';
import { Review } from '../../../models/rh/Review.model';
import { EmployeeService } from '../../../payroll/services/employee/employee.service';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { UserCurrentInformationsService } from '../../../shared/services/utility/user-current-informations.service';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { Filter, Operation, PredicateFormat, Relation } from '../../../shared/utils/predicate';
import { StarkRolesService } from '../../../stark-permissions/service/roles.service';
import { notEmptyValue } from '../../../stark-permissions/utils/utils';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { ReviewService } from '../../services/review/review.service';
import { ReviewFormComponent } from '../review-form/review-form.component';

@Component({
  selector: 'app-add-review',
  templateUrl: './add-review.component.html',
  styleUrls: ['./add-review.component.scss']
})
export class AddReviewComponent implements OnInit, OnDestroy {

  @ViewChild('reviewFormChild') reviewFormChild: ReviewFormComponent;
  reviewFormGroup: FormGroup;
  reviewToUpdate: Review;
  isUpdateMode = false;
  idReview = NumberConstant.ZERO;
  public connectedEmployee: Employee;
  /**
   * permissions
   */
  public hasUpdateReviewPermission: boolean;
  public hasShowReviewPermission: boolean;
  public hasCloseReviewPermission: boolean;
  IsUserInSuperHierarchicalEmployeeList = false;
  isCollaboratorConnected: boolean;
  isFormInitialled = false;
    formatDate: string = this.translate.instant(SharedConstant.DATE_FORMAT);
    reviewState = ReviewState;
  private isSaveOperation = false;  
  private subscriptions: Subscription[]= [];
 


  constructor(private fb: FormBuilder, private activatedRoute: ActivatedRoute, private reviewService: ReviewService,
              private translate: TranslateService, private employeeService: EmployeeService,
              private validationService: ValidationService, private swalWarrings: SwalWarring,
               private authService: AuthService, private userCurrentInformationsService: UserCurrentInformationsService  ) {
    this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
      this.idReview = +params[SharedConstant.ID_LOWERCASE] || NumberConstant.ZERO;
    }));
  }

  get IdEmployeeCollaborator(): FormControl {
    return this.reviewFormGroup.get(ReviewConstant.ID_EMPLOYEE_COLLABORATOR) as FormControl;
  }

  get ReviewDate(): FormControl {
    return this.reviewFormGroup.get(ReviewConstant.REVIEW_DATE) as FormControl;
  }

  get JobEmployee(): FormControl {
    return this.reviewFormGroup.get(ReviewConstant.JOB_EMPLOYEE) as FormControl;
  }

  get Seniority(): FormControl {
    return this.reviewFormGroup.get(ReviewConstant.SENIORITY) as FormControl;
  }

  ngOnInit() {
    this.hasUpdateReviewPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.UPDATE_ANNUALINTERVIEW);
    this.hasShowReviewPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.SHOW_REVIEW);
    this.hasCloseReviewPermission  = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.CLOSE_REVIEW);
    this.isUpdateMode = this.idReview > NumberConstant.ZERO;
    this.createAddForm();
    this.employeeService.getConnectedEmployee().subscribe(data => {
      this.connectedEmployee = data;
      if (this.isUpdateMode) {
        this.checkRightsAndInitTheReviewForm();
        this.getReviewToUpdate();
      }
    });
  }
  /**
   * Check role of connected user
   */
  checkRightsAndInitTheReviewForm() {
    this.subscriptions.push(this.reviewService.getModelByCondition(this.preparePredicate()).subscribe((data) => {
      // HasRole equals true if is the review of the connected employee or if the connected employee is an superHierarchic or is manager
      this.subscriptions.push(this.userCurrentInformationsService.getConnectedEmployeeId().subscribe(idEmployee => {
        this.isCollaboratorConnected = idEmployee === data.IdEmployeeCollaborator;
        this.isFormInitialled = true;
      }));
    }));
  }


  preparePredicate(): PredicateFormat {
    const predicate: PredicateFormat = new PredicateFormat();
    predicate.Filter = new Array<Filter>();
    predicate.Filter.push(new Filter(ReviewConstant.ID, Operation.eq, this.idReview));
    predicate.Relation = new Array<Relation>();
    predicate.Relation.push.apply(predicate.Relation, [new Relation(ReviewConstant.ID_EMPLOYEE_COLLABORATOR_NAVIGATION)]);
    return predicate;
  }

  /**
   * Save the review Form
   */
  save() {
    if (this.reviewFormGroup.valid && this.reviewFormChild) {
      const reviewFormAssign: ReviewForm = this.reviewFormChild.getReviewFormRows();
      if (reviewFormAssign) {
        reviewFormAssign.Review = this.reviewFormGroup.getRawValue();
        reviewFormAssign.Review.Id = this.idReview;
        reviewFormAssign.Review.State = this.reviewToUpdate.State;
        reviewFormAssign.Review.IdManager = this.reviewToUpdate.IdManager;
        if (reviewFormAssign) {
          this.isSaveOperation = true;
          this.subscriptions.push(this.reviewService.saveReviewForm(reviewFormAssign).subscribe(() => {
            this.reviewFormChild.ngOnInit();
          }));
        }
      }
    } else {
      this.validationService.validateAllFormFields(this.reviewFormGroup);
    }
  }

  getReviewToUpdate() {
    this.subscriptions.push(this.reviewService.getReviewWithHisNavigations(this.idReview).subscribe((data) => {
      this.reviewToUpdate = data;
      this.IdEmployeeCollaborator.patchValue(this.reviewToUpdate.IdEmployeeCollaborator);
      this.ReviewDate.patchValue(new Date(this.reviewToUpdate.ReviewDate));
      this.Seniority.patchValue(this.getSeniority(this.reviewToUpdate.IdEmployeeCollaboratorNavigation.HiringDate));
      if (this.reviewToUpdate && this.reviewToUpdate.IdEmployeeCollaboratorNavigation
        && this.reviewToUpdate.IdEmployeeCollaboratorNavigation.JobEmployee) {
        const result = new Array<number>();
        this.reviewToUpdate.IdEmployeeCollaboratorNavigation.JobEmployee.forEach((job) => {
          result.push(job.IdJob);
        });
        this.JobEmployee.patchValue(result);
      }
    }));
  }

  /**
   * Get seniority from the hiring date
   * @param date
   */
  getSeniority(date: Date) {
    const months = new Date().getMonth() - new Date(date).getMonth() +
      NumberConstant.TWELVE * ((new Date()).getFullYear() - (new Date(date)).getFullYear());
    return months >= NumberConstant.TWELVE ? ((months - (months % NumberConstant.TWELVE)) / NumberConstant.TWELVE) +
      ' ' + this.translate.instant(ReviewConstant.SENIORITY_YEAR) : months + ' ' + this.translate.instant(ReviewConstant.MONTH);
  }

  isFormChanged(): boolean {
    return this.reviewFormChild.reviewFormGroup.touched;
  }

  /**
   * this method will be called by CanDeactivateGuard service to check the leaving component possibility
   */
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.isSaveOperation) {
      this.isSaveOperation = false;
      return true;
    }
    return this.validationService.handleCanDeactivateToLeaveCurrentComponent(this.isFormChanged.bind(this));
  }

  ngOnDestroy(): void {
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }

  close() {
    if (this.reviewFormGroup.valid && this.reviewFormChild) {
      this.swalWarrings.CreateSwal(ReviewConstant.CLOSE_REVIEW_CONFIRMATION, null, SharedConstant.YES).then(result => {
        if (result.value) {
          const review: ReviewForm = this.reviewFormChild.getReviewFormRows();
          if (review) {
            review.Review = this.reviewFormGroup.getRawValue();
            review.Review.Id = this.idReview;
            review.Review.State = this.reviewToUpdate.State;
            review.Review.IdManager = this.reviewToUpdate.IdManager;
            if (review) {
              this.isSaveOperation = true;
              this.subscriptions.push(this.reviewService.closeReview(review).subscribe(() => {
                this.reviewToUpdate.State = this.reviewState.Completed;
                this.reviewFormChild.ngOnInit();
              }));
            }
          }
        }
      });
    }
  }


  private createAddForm(review?: Review) {
    this.reviewFormGroup = this.fb.group({
      IdEmployeeCollaborator: [review && review.IdEmployeeCollaborator ?
        review.IdEmployeeCollaborator : NumberConstant.ZERO, Validators.required],
      ReviewDate: [review && review.ReviewDate ? new Date(review.ReviewDate) : '', Validators.required],
      JobEmployee: [],
      Seniority: [{value: '', disabled: true}, Validators.required]
    });
    this.JobEmployee.disable();
  }
}
