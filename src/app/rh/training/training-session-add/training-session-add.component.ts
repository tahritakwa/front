import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {TrainingConstant} from '../../../constant/rh/training.constant';
import {TrainingSeance} from '../../../models/rh/training-seance.model';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {TrainingSession} from '../../../models/rh/training-session.model';
import {TrainingService} from '../../services/training/training.service';
import {Filter, Operation, PredicateFormat, Relation} from '../../../shared/utils/predicate';
import {Training} from '../../../models/rh/training.model';
import {TrainingRequestState} from '../../../models/enumerators/training-request-state.enum';
import {ActivatedRoute} from '@angular/router';
import {SelectAllCheckboxState} from '@progress/kendo-angular-grid';
import {TrainingSessionService} from '../../services/training-session/training-session.service';
import {FileInfo} from '../../../models/shared/objectToSend';
import {Observable} from 'rxjs/Observable';
import {ValidationService} from '../../../shared/services/validation/validation.service';
import {SesssionStepperComponent} from '../../components/sesssion-stepper/sesssion-stepper.component';
import {Subscription} from 'rxjs/Subscription';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-training-session-add',
  templateUrl: './training-session-add.component.html',
  styleUrls: ['./training-session-add.component.scss']
})
export class TrainingSessionAddComponent implements OnInit, OnDestroy {
  @ViewChild('sessionStepper') sessionStepper: SesssionStepperComponent;
  isUpdateMode: boolean;
  formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);
  trainingSessionToUpdate: TrainingSession;
  idTraining: number;
  idTrainingSession: number;
  selectAllState: SelectAllCheckboxState = SharedConstant.UNCHECKED as SelectAllCheckboxState;
  predicate: PredicateFormat;
  trainingRequestState = TrainingRequestState;
  trainingName: string;
  idSkill: number;

  trainingSession: TrainingSession;
  private subscriptions: Subscription[] = [];

  constructor(private trainingService: TrainingService, private activatedRoute: ActivatedRoute, private translate: TranslateService,
              private trainingSessionService: TrainingSessionService, private validationService: ValidationService) {
    this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
      this.idTraining = +params[TrainingConstant.PARAMS_ID_TRAINING];
      this.idTrainingSession = +params[TrainingConstant.PARAMS_ID] || NumberConstant.ZERO;
    }));
  }

  ngOnInit() {
    this.isUpdateMode = this.idTrainingSession > NumberConstant.ZERO;
    if (!this.isUpdateMode) {
      this.getTrainingName();
      this.trainingSessionToUpdate = new TrainingSession();
      this.trainingSessionToUpdate.SessionPlanFileInfo = new Array<FileInfo>();
      this.trainingSessionToUpdate.IdTraining = this.idTraining;
    } else {
      this.getTrainingSessionToUpdate();
    }
  }

  getTrainingName() {
    this.subscriptions.push(this.trainingService.getById(this.idTraining).subscribe((training: Training) => {
      if (training) {
        this.trainingName = training.Name;
        if (training.TrainingExpectedSkills && training.TrainingExpectedSkills.length > NumberConstant.ZERO) {
          this.idSkill = training.TrainingExpectedSkills.filter(x => x.IdTraining === this.idTraining)[0].IdSkills;
        }
      }
    }));
  }

  isFormChanged(): boolean {
    if (this.sessionStepper.planningTrainingSessionComponent.trainingSessionAddFormGroup.touched ||
      this.sessionStepper.planningTrainingSessionSeanceComponent.trainingSeancesFormGroup.touched) {
      return true;
    }
    return false;
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

  /**
   * Get training session to update and initiate his training request list
   */
  private getTrainingSessionToUpdate() {
    // Get the training session model
    this.subscriptions.push(this.trainingSessionService.getModelByCondition(this.predicateForTrainingSession()).subscribe((res) => {
      this.trainingSessionToUpdate = res;
      // Get the training id in update mode
      this.idTraining = this.trainingSessionToUpdate.IdTraining;
      // Get the training name
      this.trainingName = this.trainingSessionToUpdate.IdTrainingNavigation ?
        this.trainingSessionToUpdate.IdTrainingNavigation.Name : '';
      // Get the training expected skill
      this.idSkill = this.trainingSessionToUpdate.IdTrainingNavigation.TrainingExpectedSkills
        .filter(x => x.IdTraining === this.idTraining)[0].IdSkills;
      this.trainingSessionToUpdate.StartDate = this.trainingSessionToUpdate.StartDate ?
        new Date(this.trainingSessionToUpdate.StartDate) : null;
      this.trainingSessionToUpdate.EndDate = this.trainingSessionToUpdate.EndDate ?
        new Date(this.trainingSessionToUpdate.EndDate) : null;
      if (!this.trainingSessionToUpdate.TrainingSeance) {
        this.trainingSessionToUpdate.TrainingSeance = new Array<TrainingSeance>();
      }
    }));
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
    predicate.Relation.push.apply(predicate.Relation, [new Relation(TrainingConstant.ID_TRAINING_NAVIGATION)]);
    predicate.Relation.push.apply(predicate.Relation, [new Relation(TrainingConstant.EMPLOYEE_TRAINING_SESSION)]);
    return predicate;
  }

}
