import {Component, ComponentRef, OnInit} from '@angular/core';
import {IModalDialog, IModalDialogOptions} from 'ngx-modal-dialog';
import {Subject} from 'rxjs/Subject';
import {ModalDialogInstanceService} from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import {PredicateFormat, Relation} from '../../../shared/utils/predicate';
import {EvaluationCriteriaTheme} from '../../../models/rh/evaluation-criteria-theme.model';
import {EvaluationConstant} from '../../../constant/rh/evaluation.constant';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {InterviewMark} from '../../../models/rh/interview-mark.model';
import {InterviewMarkService} from '../../services/interview-mark/interview-mark.service';
import {ValidationService} from '../../../shared/services/validation/validation.service';
import {CriteriaMark} from '../../../models/rh/criteria-mark.model';
import {Subscription} from 'rxjs/Subscription';
import {EvaluationCriteriaThemeService} from '../../services/evaluation/evaluation-criteria-theme.service';

@Component({
  selector: 'app-evaluation-form',
  templateUrl: './evaluation-form.component.html',
  styleUrls: ['./evaluation-form.component.scss']
})
export class EvaluationFormComponent implements OnInit {
  evaluationFormGroup: FormGroup;

  /**
   * If modal=true
   */
  public isModal: boolean;
  /*
   * dialog subject
   */
  options: Partial<IModalDialogOptions<any>>;
  reference: ComponentRef<IModalDialog>;
  public closeDialogSubject: Subject<any>;

  evaluationCriteriaThemeList: EvaluationCriteriaTheme[];
  processDataServerSide: CriteriaMark[];
  evaluationCritetriaTheme: Subscription;

  public recruitmentId: number;
  public interviewMarkToUpdate: InterviewMark;
  predicate: PredicateFormat;
  public evaluationCriteriaDictionary: Array<any> = [];

  constructor(private modalService: ModalDialogInstanceService,
              private interviewMarkService: InterviewMarkService,
              private evaluationCriteriaThemeService: EvaluationCriteriaThemeService,
              private validationService: ValidationService,
              private fb: FormBuilder) {
  }

  get CriteriaMark(): FormArray {
    return this.evaluationFormGroup.get(EvaluationConstant.CRITERIA_MARK) as FormArray;
  }

  ngOnInit() {
    this.createAddForm(this.interviewMarkToUpdate);
    this.initGridDataSource();
    this.addCriteriaMark(this.interviewMarkToUpdate);
    this.getEvaluationCriteriaThemeList();
  }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.isModal = true;
    this.options = options;
    this.interviewMarkToUpdate = options.data;
    this.closeDialogSubject = options.closeDialogSubject;
  }

  public initGridDataSource(): void {
    this.processDataServerSide = this.interviewMarkToUpdate.CriteriaMark;
  }

  /*
  / Filtring the controls of CriteriaMark formArray by theme
  */
  public GetCriteriaMarkFormArrayControlsByTheme(themeId: number): AbstractControl[] {
    return this.CriteriaMark.controls.filter(x =>
      (x as FormGroup).controls.IdTheme.value === themeId);
  }

  public getEvaluationCriteriaThemeList() {
    this.evaluationCriteriaThemeService.list().subscribe(data => {
      this.evaluationCriteriaThemeList = data;
    });
  }

  addCriteriaMark(interviewMark: InterviewMark): void {
    if (interviewMark.CriteriaMark) {
      interviewMark.CriteriaMark.forEach(element => {
        this.CriteriaMark.push(this.generateCriteriaMarkFormGroup(element));
      });
    }
  }

  generateCriteriaMarkFormGroup(currentCriteriaMark: CriteriaMark): FormGroup {
    let currentCriteriaMarkFormGroup: FormGroup;
    currentCriteriaMarkFormGroup = this.fb.group({
      Id: [currentCriteriaMark.Id],
      Mark: [currentCriteriaMark.Mark],
      Label: [currentCriteriaMark.IdEvaluationCriteriaNavigation && currentCriteriaMark.IdEvaluationCriteriaNavigation.Label
        ? currentCriteriaMark.IdEvaluationCriteriaNavigation.Label : ''],
      IdInterviewMark: [currentCriteriaMark.IdInterviewMark],
      IdEvaluationCriteria: [currentCriteriaMark.IdEvaluationCriteria],
      IdTheme: [currentCriteriaMark
        ? currentCriteriaMark.IdEvaluationCriteriaTheme
        : undefined]
    });
    return currentCriteriaMarkFormGroup;
  }


  public preparePredicate() {
    const myPredicate = new PredicateFormat();
    myPredicate.Relation = new Array<Relation>();
    myPredicate.Relation.push.apply(myPredicate.Relation, [new Relation(EvaluationConstant.EVALUATION_CRITERIA)]);

    return myPredicate;
  }

  save() {
    if (this.evaluationFormGroup.valid) {
      const obj: InterviewMark = Object.assign({}, this.interviewMarkToUpdate, this.evaluationFormGroup.getRawValue());
      this.interviewMarkService.UpdateInterviewMarkWithCriteriaMark(obj).subscribe(result => {
        this.options.data = result;
        this.options.onClose();
        this.modalService.closeAnyExistingModalDialog();
      });
    } else {
      this.validationService.validateAllFormFields(this.evaluationFormGroup);
    }
  }

  private createAddForm(interviewMark?): void {
    this.evaluationFormGroup = this.fb.group({
      InterviewerDecision: [interviewMark ? interviewMark.InterviewerDecision : null, [Validators.required]],
      StrongPoints: [interviewMark ? interviewMark.StrongPoints : ''],
      Weaknesses: [interviewMark ? interviewMark.Weaknesses : ''],
      OtherInformations: [interviewMark ? interviewMark.OtherInformations : ''],
      CriteriaMark: this.fb.array([])
    });
  }
}
