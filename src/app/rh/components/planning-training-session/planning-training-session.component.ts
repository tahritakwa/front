import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TrainingConstant } from '../../../constant/rh/training.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { TrainingSession } from '../../../models/rh/training-session.model';
import { FileInfo } from '../../../models/shared/objectToSend';
import { Filter, Operation, PredicateFormat, Relation } from '../../../shared/utils/predicate';
import { TrainingSessionService } from '../../services/training-session/training-session.service';
import { TrainingService } from '../../services/training/training.service';

@Component({
  selector: 'app-planning-training-session',
  templateUrl: './planning-training-session.component.html',
  styleUrls: ['./planning-training-session.component.scss']
})
export class PlanningTrainingSessionComponent implements OnInit {
  @Input() trainingSession: TrainingSession;
  @Input() isUpdateMode: boolean;
  @Input() idTraining: number;
  @Input() idTrainingSession: number;
  @Input() hasUpdatePermission: boolean;
  @Input() hasAddPermission: Boolean;
  trainingSessionToUpdate: TrainingSession;
  trainingSessionAddFormGroup: FormGroup;
  fileToUpload = new Array<FileInfo>();
  @Output() trainingSessionEmitter: EventEmitter<TrainingSession> = new EventEmitter<TrainingSession>();

  constructor(private fb: FormBuilder, public trainingteService: TrainingService, private trainingSessionService: TrainingSessionService,
              private router: Router, public authService: AuthService) {
  }

  /**
   *  Get training session start date
   */
  get StartDate(): FormControl {
    return this.trainingSessionAddFormGroup.get(TrainingConstant.START_DATE) as FormControl;
  }

  /**
   *  Get training session end date
   */
  get EndDate(): FormControl {
    return this.trainingSessionAddFormGroup.get(TrainingConstant.END_DATE) as FormControl;
  }

  ngOnInit() {
    this.createForm();
    if (this.isUpdateMode) {
      this.getTrainingSessionToUpdate();
      if (!this.hasUpdatePermission) {
        this.trainingSessionAddFormGroup.disable();
      }
    } else {
      this.trainingSessionToUpdate = new TrainingSession();
      this.trainingSessionToUpdate.SessionPlanFileInfo = new Array<FileInfo>();
      this.trainingSessionToUpdate.IdTraining = this.idTraining;
    }
  }

  /**
   * set the endDate value to the startDate if the startDate > endDate
   * @param event
   */
  public startDateValueChange(selectedDate: Date) {
    if (selectedDate) {
      if (this.StartDate.value > this.EndDate.value) {
        this.EndDate.setValue(selectedDate);
      }
      this.setStartDateAndEndDate();
    }
  }

  /**
   * set the startDate value to the endDate if the endDate < startDate
   * @param event
   */
  public endDateValueChange(selectedDate: Date) {
    if (selectedDate) {
      if (this.EndDate.value < this.StartDate.value) {
        this.StartDate.setValue(selectedDate);
      }
      this.setStartDateAndEndDate();
    }
  }

  setStartDateAndEndDate() {
    if (this.isUpdateMode) {
      this.trainingSessionToUpdate.StartDate = this.StartDate.value;
      this.trainingSessionToUpdate.EndDate = this.EndDate.value;
      this.trainingSessionEmitter.emit(this.trainingSessionToUpdate);
    }
  }

  saveTrainingSession() {
    this.trainingSessionToUpdate = this.trainingSessionAddFormGroup.getRawValue();
    this.trainingSessionToUpdate.SessionPlanFileInfo = this.fileToUpload;
    const trainingSessionToSend: TrainingSession =
      Object.assign({}, this.trainingSessionToUpdate, this.trainingSessionToUpdate);
    this.trainingSessionService.save(trainingSessionToSend, !this.isUpdateMode)
      .subscribe((result) => {
        this.router.navigate([TrainingConstant.NAVIGATE_TO_TRAINING_SESSSION_LIST]);
      });
  }

  private createForm(trainingSession?: TrainingSession): void {
    this.trainingSessionAddFormGroup = this.fb.group({
      Id: [NumberConstant.ZERO],
      IdTraining: [this.idTraining ? this.idTraining : NumberConstant.ZERO],
      Name: [trainingSession ? trainingSession.Name : undefined,
        [Validators.required, Validators.maxLength(NumberConstant.ONE_HUNDRED)]],
      StartDate: [trainingSession ? new Date(trainingSession.StartDate) : null, [Validators.required]],
      EndDate: [trainingSession ? new Date(trainingSession.EndDate) : null, [Validators.required]],
      Duration: [this.trainingSession ? this.trainingSession.Duration : ''],
      Description: [this.trainingSession ? this.trainingSession.Description : ''],
      SessionPlan: [this.trainingSession ? this.trainingSession.SessionPlan : ''],
    });
  }

  /**
   * Get training session to update and initiate his training request list
   */
  private getTrainingSessionToUpdate() {
    // Get the training session model
    this.trainingSessionService.getModelByCondition(this.predicateForTrainingSession()).subscribe((res) => {
      this.trainingSessionToUpdate = res;
      // Get the training id in update mode
      this.idTraining = this.trainingSessionToUpdate.IdTraining;
      this.trainingSessionToUpdate.StartDate = this.trainingSessionToUpdate.StartDate ?
        new Date(this.trainingSessionToUpdate.StartDate) : null;
      this.trainingSessionToUpdate.EndDate = this.trainingSessionToUpdate.EndDate ?
        new Date(this.trainingSessionToUpdate.EndDate) : null;
      this.fileToUpload = this.trainingSessionToUpdate.SessionPlanFileInfo;
      this.trainingSessionAddFormGroup.patchValue(this.trainingSessionToUpdate);
      this.trainingSessionEmitter.emit(this.trainingSessionToUpdate);
    });
  }

  /**
   * Predicate for the training session
   */
  private predicateForTrainingSession(): PredicateFormat {
    const predicate: PredicateFormat = new PredicateFormat();
    predicate.Filter = new Array<Filter>();
    predicate.Filter.push(new Filter(TrainingConstant.ID, Operation.eq, this.idTrainingSession));
    predicate.Relation = new Array<Relation>();
    predicate.Relation.push.apply(predicate.Relation, [new Relation(TrainingConstant.TRAINING_SEANCE_COLLECTION)]);
    predicate.Relation.push.apply(predicate.Relation, [new Relation(TrainingConstant.TRAINING_REQUEST_COLLECTION)]);
    predicate.Relation.push.apply(predicate.Relation, [new Relation(TrainingConstant.ID_TRAINING_NAVIGATION)]);
    return predicate;
  }

}
