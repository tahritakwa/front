import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ReviewConstant } from '../../../constant/rh/review.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { Objective } from '../../../models/rh/objective.model';

@Component({
  selector: 'app-add-objective',
  templateUrl: './add-objective.component.html',
  styleUrls: ['./add-objective.component.scss']
})
export class AddObjectiveComponent implements OnInit {
  @Input() currentObjective: Objective;
  @Input() PastObjective: FormArray;
  @Input() FutureObjective: FormArray;
  @Input() isPastObjective: boolean;
  // tslint:disable-next-line: no-output-rename
  @Output('delectedAction') delectedAction: EventEmitter<any> = new EventEmitter<any>();
  // tslint:disable-next-line: no-output-rename
  @Output('addAction') addAction: EventEmitter<any> = new EventEmitter<any>();
  formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);
  objectiveFormGroup: FormGroup;
  constructor(private translate: TranslateService) { }

  deleteFutureObjective(currentObjective: Objective, index: number) {
    const values = {
      currentObjective: currentObjective,
      index: index
    };
    this.delectedAction.emit(values);
  }

  get Label(): FormControl {
    return this.objectiveFormGroup.get(ReviewConstant.LABEL) as FormControl;
  }

  get RealisationDate(): FormControl {
    return this.objectiveFormGroup.get(ReviewConstant.REALISATION_DATE) as FormControl;
  }

  get ObjectiveCollaboratorStatus(): FormControl {
    return this.objectiveFormGroup.get(ReviewConstant.OBJECTIVE_COLLABORATOR_STATUS) as FormControl;
  }

  get ObjectiveManagerStatus(): FormControl {
    return this.objectiveFormGroup.get(ReviewConstant.OBJECTIVE_MANAGER_STATUS) as FormControl;
  }

  get ExpectedDate(): FormControl {
    return this.objectiveFormGroup.get(ReviewConstant.EXPECTED_DATE) as FormControl;
  }

  ngOnInit() {
  }

  addFutureObjective() {
    this.addAction.emit();
  }
}
