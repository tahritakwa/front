import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TrainingConstant} from '../../../constant/rh/training.constant';
import {TrainingSeance} from '../../../models/rh/training-seance.model';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {TranslateService} from '@ngx-translate/core';
import {TrainingSeanceDay} from '../../../models/rh/training-seance-day.model';
import {TrainingSeanceService} from '../../services/training-seance/training-seance.service';
import {Router} from '@angular/router';
import {TrainingSessionService} from '../../services/training-session/training-session.service';
import {TrainingSession} from '../../../models/rh/training-session.model';
import {ValidationService} from '../../../shared/services/validation/validation.service';
import {DayOfWeek} from '../../../models/enumerators/day-of-week.enum';

@Component({
  selector: 'app-planning-training-session-seance',
  templateUrl: './planning-training-session-seance.component.html',
  styleUrls: ['./planning-training-session-seance.component.scss']
})
export class PlanningTrainingSessionSeanceComponent implements OnInit {
  @Input() isUpdateMode: boolean;
  days = [SharedConstant.MONDAY, SharedConstant.TUESDAY, SharedConstant.WEDNESDAY,
    SharedConstant.THURSDAY, SharedConstant.FRIDAY, SharedConstant.SATURDAY, SharedConstant.SUNDAY];
  listOfDays: any[] = [];
  DayForm: FormGroup;
  trainingSeancesFormGroup: FormGroup;
  @Input() idTraining: number;
  @Input() idTrainingSession: number;
  @Input() trainingSession: TrainingSession;
  @Input() hasUpdatePermission: Boolean;
  @Input() hasAddPermission: Boolean;

  constructor(private fb: FormBuilder, public translate: TranslateService, private trainingSessionService: TrainingSessionService,
              private trainingSeanceService: TrainingSeanceService, private router: Router, private validationService: ValidationService) {
  }

  get TrainingSeanceOfDay(): FormArray {
    return this.trainingSeancesFormGroup.get(TrainingConstant.TRAINING_SEANCE_OF_DAY) as FormArray;
  }

  get TrainingSeanceLine(): FormArray {
    return this.TrainingSeanceOfDay.get(TrainingConstant.TRAINING_SEANCE_LINE) as FormArray;
  }

  get TrainingSeance(): FormArray {
    return this.trainingSeancesFormGroup.get(TrainingConstant.TRAINING_SEANCE) as FormArray;
  }

  ngOnInit() {
    this.createSeancesForm();
    this.translateDays();
    this.addDays();
    if (this.isUpdateMode) {
      this.getTrainingSeances();
    }
  }

  getTrainingSeances() {
    this.trainingSeanceService.GetTrainingSeanceListInUpdateMode(this.idTrainingSession)
      .subscribe((result) => {
        const trainingSeance = result.TrainingSeancesPerDate;
        trainingSeance.forEach(trainingSeancePerDate => {
          this.addTrainingSeance(trainingSeancePerDate);
        });
        const trainingSeancesDay = result.TrainingSeancesDay;
        trainingSeancesDay.forEach(trainingSeancePerDay => {
          trainingSeancePerDay.TrainingSeanceLine.forEach(seance => {
            if (seance.DayOfWeek === NumberConstant.ZERO) {
              trainingSeancePerDay.DayOfWeek = NumberConstant.SEVEN;
              seance.DayOfWeek = NumberConstant.SEVEN;
            }
            this.addTrainingSeanceLine(this.TrainingSeanceOfDay.controls[trainingSeancePerDay.DayOfWeek - NumberConstant.ONE] as FormArray,
              trainingSeancePerDay.DayOfWeek, seance);
          });
        });
      });
  }

  translateDays(): void {
    this.days.forEach(elem => {
      this.translate.get(elem.toUpperCase()).subscribe(trans => elem = trans);
      this.listOfDays.push(elem);
    });
  }

  addDays() {
    this.listOfDays.forEach(element => {
      this.addTrainingSeanceForWeek(element, this.listOfDays.indexOf(element));
    });
  }

  addTrainingSeanceForWeek(day: DayOfWeek, dayIndex?: number) {
    this.TrainingSeanceOfDay.push(this.buildTrainingSeanceWeekForm(day, dayIndex));
  }

  addTrainingSeanceLine(trainingSeanceForDay?: FormArray, dayIndex?: number, trainingSeance?: TrainingSeance) {
    (trainingSeanceForDay.get(TrainingConstant.TRAINING_SEANCE_LINE) as FormArray)
      .push(this.buildTrainingSeanceWeekLineForm(dayIndex, trainingSeance));
  }

// build trainingSeanceWeekLine
  buildTrainingSeanceWeekLineForm(dayIndex?: number, trainingSeance?: TrainingSeance): FormGroup {
    return this.fb.group({
      Id: [trainingSeance ? trainingSeance.Id : NumberConstant.ZERO],
      StartHour: [{value: trainingSeance ? trainingSeance.StartHour : null, disabled:
        !(this.hasAddPermission && !this.isUpdateMode || this.hasUpdatePermission && this.isUpdateMode)}, Validators.required],
      EndHour: [{value: trainingSeance ? trainingSeance.EndHour : null, disabled:
         !(this.hasAddPermission && !this.isUpdateMode || this.hasUpdatePermission && this.isUpdateMode)}, Validators.required],
      Details: [{value: trainingSeance ? trainingSeance.Details : '', disabled:
       !(this.hasAddPermission && !this.isUpdateMode || this.hasUpdatePermission && this.isUpdateMode)}],
      DayOfWeek: [{value: trainingSeance ? trainingSeance.DayOfWeek : dayIndex + NumberConstant.ONE, disabled:
         !(this.hasAddPermission && !this.isUpdateMode || this.hasUpdatePermission && this.isUpdateMode)}],
      IsDeleted: [false]
    });
  }

  buildTrainingSeanceWeekForm(day: DayOfWeek, dayIndex?: number): FormGroup {
    return this.fb.group({
      DayOfWeek: [day],
      TrainingSeanceLine: this.fb.array([])
    });
  }

  /**
   * Add new training seance array
   */
  addTrainingSeance(trainingSeance?: TrainingSeance) {
    this.TrainingSeance.push(this.buildTrainingSeanceForm(trainingSeance));
  }

  /**
   * Build training seance form array
   * @param trainingSeance
   */
  buildTrainingSeanceForm(trainingSeance?: TrainingSeance): FormGroup {
    return this.fb.group({
      Id: [trainingSeance ? trainingSeance.Id : NumberConstant.ZERO],
      Date: [{value: trainingSeance ? new Date(trainingSeance.Date) : new Date(), disabled:
        !(this.hasAddPermission && !this.isUpdateMode || this.hasUpdatePermission && this.isUpdateMode)}, [Validators.required]],
      StartHour: [{value: trainingSeance ? trainingSeance.StartHour : null, disabled:
         !(this.hasAddPermission && !this.isUpdateMode || this.hasUpdatePermission && this.isUpdateMode)}, [Validators.required]],
      EndHour: [{value: trainingSeance ? trainingSeance.EndHour : null, disabled:
         !(this.hasAddPermission && !this.isUpdateMode || this.hasUpdatePermission && this.isUpdateMode)}, [Validators.required]],
      IsDeleted: [false]
    });
  }

  /**
   * Check if the training seance array is visible
   * @param index
   */
  isTrainingSeanceRowVisible(index: number): boolean {
    return !this.TrainingSeance.at(index).get(SharedConstant.IS_DELETED).value;
  }

  /**
   * Delete a training seance array
   * @param index
   */
  deleteTrainingSeance(index: number) {
    if (this.TrainingSeance.at(index).get(SharedConstant.ID).value === NumberConstant.ZERO) {
      this.TrainingSeance.removeAt(index);
    } else {
      this.TrainingSeance.at(index).get(SharedConstant.IS_DELETED).setValue(true);
    }
  }

  /**
   * Deletes the TimeSheet Line at the index parameter of the corresponding formarray in parameter
   * @param formArray
   * @param index
   */
  public deleteTrainingSeanceLine(formArray: FormArray, index: number) {
    const form = (formArray.get(TrainingConstant.TRAINING_SEANCE_LINE) as FormArray);
    if (form.controls[index].value.Id === NumberConstant.ZERO) {
      form.removeAt(index);
    } else {
      form.controls[index].get(SharedConstant.IS_DELETED).setValue(true);
    }
  }

  /**
   * Check if the training seance line is visible
   * @param index
   */
  isTrainingSeanceLineVisible(formArray: FormArray, index: number): boolean {
    const form = (formArray.get(TrainingConstant.TRAINING_SEANCE_LINE) as FormArray);
    return !form.at(index).get(SharedConstant.IS_DELETED).value;
  }

  saveTrainingSeances() {
    if (this.trainingSeancesFormGroup.valid) {
      const traningSeancesPerDate = this.TrainingSeance.value;
      const trainingSeancesPerDay = this.TrainingSeanceOfDay.value;
      let trainingSeancesFrequently = new Array<TrainingSeanceDay>();
      trainingSeancesFrequently = trainingSeancesPerDay.filter(element => element.TrainingSeanceLine.length > NumberConstant.ZERO);
      trainingSeancesFrequently.forEach(trainingSeanceDay => {
        trainingSeanceDay.DayOfWeek = trainingSeanceDay.TrainingSeanceLine[NumberConstant.ZERO].DayOfWeek;
        trainingSeanceDay.DayName = this.listOfDays[trainingSeanceDay.DayOfWeek as number - NumberConstant.ONE];
        if (trainingSeanceDay.DayOfWeek === NumberConstant.SEVEN) {
          trainingSeanceDay.DayOfWeek = NumberConstant.ZERO;
          trainingSeanceDay.TrainingSeanceLine.forEach(seance => {
            seance.DayOfWeek = NumberConstant.ZERO;
          });
        }
      });
      if (!this.isUpdateMode) {
        this.trainingSessionService.addTrainingSeancesWithTrainingSession(this.idTraining, traningSeancesPerDate, trainingSeancesFrequently)
          .subscribe((result) => {
            this.router.navigate([TrainingConstant.NAVIGATE_TO_TRAINING_SESSSION_LIST]);
          });
      } else {
        this.trainingSessionService.updateTrainingSeancesWithTrainingSession(this.trainingSession,
          traningSeancesPerDate, trainingSeancesFrequently)
          .subscribe((result) => {
            this.router.navigate([TrainingConstant.NAVIGATE_TO_TRAINING_SESSSION_LIST]);
          });
      }
    } else {
      this.validationService.validateAllFormFields(this.trainingSeancesFormGroup);
    }
  }

  private createSeancesForm(): void {
    this.trainingSeancesFormGroup = this.fb.group({
      TrainingSeance: this.fb.array([]),
      TrainingSeanceOfDay: this.fb.array([])
    });
  }
}
