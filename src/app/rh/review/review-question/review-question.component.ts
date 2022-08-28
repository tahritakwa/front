import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {ReviewConstant} from '../../../constant/rh/review.constant';
import {Question} from '../../../models/rh/question.model';

@Component({
  selector: 'app-review-question',
  templateUrl: './review-question.component.html',
  styleUrls: ['./review-question.component.scss']
})
export class ReviewQuestionComponent implements OnInit {

  @Input() questionFormGroup: FormGroup;
  @Input() currentQuestion: Question;
  @Input() IsUserInSuperHierarchicalEmployeeList = false;
  @Output() delectedAction = new EventEmitter<Question>();

  constructor() {
  }

  get QuestionLabel(): FormControl {
    return this.questionFormGroup.get(ReviewConstant.REALISATION_DATE) as FormControl;
  }

  get ResponseLabel(): FormControl {
    return this.questionFormGroup.get(ReviewConstant.REALISATION_DATE) as FormControl;
  }

  ngOnInit() {
  }

  deleteQuestion(currentQuestion: Question) {
    this.delectedAction.emit(currentQuestion);
  }
}
