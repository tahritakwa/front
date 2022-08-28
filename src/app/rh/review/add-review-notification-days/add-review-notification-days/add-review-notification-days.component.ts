import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { GrowlService } from '../../../../../COM/Growl/growl.service';
import { SharedConstant } from '../../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../../constant/utility/number.constant';
import { AuthService } from '../../../../login/Authentification/services/auth.service';
import { JobsParameters } from '../../../../models/shared/jobs-parameters.model';
import { SwalWarring } from '../../../../shared/components/swal/swal-popup';
import { ValidationService } from '../../../../shared/services/validation/validation.service';
import { BackgroundJobConstants } from '../../../../shared/utils/background-job-constants';
import { Filter, Operation, PredicateFormat } from '../../../../shared/utils/predicate';
import { PermissionConstant } from '../../../../Structure/permission-constant';
import { JobsParametersService } from '../../../services/jobs-parameters/jobs-parameters.service';

@Component({
  selector: 'app-add-review-notification-days',
  templateUrl: './add-review-notification-days.component.html',
  styleUrls: ['./add-review-notification-days.component.scss']
})
export class AddReviewNotificationDaysComponent implements OnInit {

  daysList: Array<number> = new Array<number>();
  public hasUpdatePermission: boolean;
  private jobsParameterToUpdate: JobsParameters = new JobsParameters();
  private reviewJobPredicate: PredicateFormat;
  private isChanged: boolean;
  private isEmpty: boolean;
  private subscriptions: Subscription[] = [];

  constructor(private authService: AuthService,
              public validationService: ValidationService,
              private jobsParametersService: JobsParametersService,
              private growlService: GrowlService,
              private translateService: TranslateService,
              private swalWarrings: SwalWarring) {
  }

  ngOnInit() {
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.UPDATE_JOBSPARAMETERS);
    this.preparePredicateReviewNotificationJob();
    this.getDataToUpdate();
    this.isChanged = false;
  }

  prepareNotificationDaysToUpdate() {
    this.serializeDays();
  }

  updateReviewNotification() {

    this.prepareNotificationDaysToUpdate();
    if (this.jobsParameterToUpdate && !this.isEmpty) {
      this.isChanged = false;
      this.subscriptions.push(this.jobsParametersService.save(this.jobsParameterToUpdate, false)
        .subscribe(x => this.getDataToUpdate()));
    } else {
      this.growlService.warningNotification(this.translateService.instant(BackgroundJobConstants.EMPTY_LIST_WARNING));
    }
  }

  /**
   * Prepare Predicate
   */
  public preparePredicateReviewNotificationJob(): void {
    this.reviewJobPredicate = new PredicateFormat();
    this.reviewJobPredicate.Filter = new Array<Filter>();
    this.reviewJobPredicate.Filter.push.apply(this.reviewJobPredicate.Filter,
      [new Filter(BackgroundJobConstants.KEYS, Operation.eq, BackgroundJobConstants.ANNUAL_REVIEW_JOB_KEY)]);
    this.reviewJobPredicate.Filter.push.apply(this.reviewJobPredicate.Filter,
      [new Filter(BackgroundJobConstants.FIELD, Operation.eq, BackgroundJobConstants.ANNUAL_REVIEW_JOB_NOTIFICATION_DAYS_FIELD)]);
  }

  cleanList() {
    this.swalWarrings.CreateSwal(BackgroundJobConstants.CLEAR_LIST_WARNING, BackgroundJobConstants.WARNING,
      SharedConstant.VALIDATION_CONFIRM).then((result) => {
      if (result.value) {
        this.daysList = [];
        this.isEmpty = true;
        this.isChanged = true;
      } else {
        this.growlService.InfoNotification(this.translateService.instant(BackgroundJobConstants.NO_CHANGES_HAVE_BEEN_MADE));
      }
    });
  }

  cancelUpdates() {
    if (this.isChanged) {
      this.swalWarrings.CreateSwal(BackgroundJobConstants.CANCEL_CHANGES_WARNING, BackgroundJobConstants.WARNING,
        SharedConstant.VALIDATION_CONFIRM).then((result) => {
        if (result.value) {
          this.preparePredicateReviewNotificationJob();
          this.getDataToUpdate();
          this.isChanged = false;
          this.isEmpty = false;
          this.growlService.warningNotification(this.translateService.instant(BackgroundJobConstants.CANCEL_UPDATE));
        } else {
          this.growlService.InfoNotification(this.translateService.instant(BackgroundJobConstants.NO_CHANGES_HAVE_BEEN_MADE));
        }
      });
    } else {
      this.growlService.InfoNotification(this.translateService.instant(BackgroundJobConstants.NO_CHANGES_HAVE_BEEN_MADE));
    }
  }

  addDayToDaysList(day: number) {
    if (day > BackgroundJobConstants.MAX_ANNUAL_REVIEW_DAYS ||
      day < BackgroundJobConstants.MIN_ANNUAL_REVIEW_DAYS) {
      this.growlService.warningNotification(this.translateService.instant(BackgroundJobConstants.NOTIFICATION_DAYS_OUT_OF_RANGE));
    } else if (this.daysList.indexOf(Number(day)) < NumberConstant.ZERO) {
      this.isChanged = true;
      this.isEmpty = false;
      this.daysList.push(Number(day));
    } else {
      this.growlService.warningNotification(this.translateService.instant(BackgroundJobConstants.NOTIFICATION_DAY_ALREADY_SET));
    }
  }

  removeDayFromDaysList(data: number) {
    this.daysList.splice(this.daysList.indexOf(data), 1);
    this.isChanged = true;
    if (this.daysList.length === NumberConstant.ZERO) {
      this.isEmpty = true;
    }
  }

  deserializeDays() {
    this.daysList = JSON.parse(this.jobsParameterToUpdate.Value);
  }

  serializeDays() {
    this.jobsParameterToUpdate.Value = JSON.stringify(this.daysList);
  }

  isFormChanged(): boolean {
    return this.isChanged;
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

  private getDataToUpdate(): void {
    this.subscriptions.push(this.jobsParametersService.getModelByCondition(this.reviewJobPredicate).subscribe(data => {
      this.jobsParameterToUpdate = data;
      this.deserializeDays();
    }));
  }
}
