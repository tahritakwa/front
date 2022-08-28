import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {ReviewSkills} from '../../../models/rh/review-skills.model';
import {ReviewConstant} from '../../../constant/rh/review.constant';

@Component({
  selector: 'app-add-review-skills',
  templateUrl: './add-review-skills.component.html',
  styleUrls: ['./add-review-skills.component.scss']
})
export class AddReviewSkillsComponent implements OnInit {
  @Input() isOldReviewSkills: boolean;
  @Input() isCollaboratorConnected: boolean;
  @Input() reviewSkillsFormGroup: FormGroup;
  @Input() currentReviewSkills: ReviewSkills;
  @Input() skillsToIgnore: number[];
  @Output() delectedAction = new EventEmitter<ReviewSkills>();

  constructor() {
  }

  get IdSkills(): FormControl {
    return this.reviewSkillsFormGroup.get(
      ReviewConstant.ID_SKILLS
    ) as FormControl;
  }

  get CollaboratorMark(): FormControl {
    return this.reviewSkillsFormGroup.get(
      ReviewConstant.COLLABORATOR_RATE
    ) as FormControl;
  }

  get ManagerMark(): FormControl {
    return this.reviewSkillsFormGroup.get(
      ReviewConstant.MANAGER_RATE
    ) as FormControl;
  }

  get OldRate(): FormControl {
    return this.reviewSkillsFormGroup.get(
      ReviewConstant.OLD_RATE
    ) as FormControl;
  }

  ngOnInit() {
  }

  deleteFutureReviewSkills(currentReviewSkills: ReviewSkills) {
    this.delectedAction.emit(currentReviewSkills);
  }
}
