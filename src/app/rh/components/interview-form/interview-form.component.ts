import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReviewConstant } from '../../../constant/rh/review.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { User } from '../../../models/administration/user.model';
import { Question } from '../../../models/rh/question.model';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { UserCurrentInformationsService } from '../../../shared/services/utility/user-current-informations.service';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { QuestionService } from '../../services/question/question.service';

@Component({
  selector: 'app-interview-form',
  templateUrl: './interview-form.component.html',
  styleUrls: ['./interview-form.component.scss']
})
export class InterviewFormComponent implements OnInit {

  @Input() InterviewQuestion: FormArray;
  @Input() isCollaboratorConnected: boolean;
  @Input() IsUserInSuperHierarchicalEmployeeList: boolean;
  @Input() IdSupervisor: number;
  public connectedUser: User;
  public canEdit: boolean;

  constructor(private questonService: QuestionService, private fb: FormBuilder, private validationService: ValidationService,
    private swalWarrings: SwalWarring, private userCurrentInformationsService: UserCurrentInformationsService) { }

  ngOnInit() {
    this.userCurrentInformationsService.getConnectedEmployeeId().subscribe(idEmployee => {
      this.canEdit = (this.IdSupervisor === idEmployee);
    });
  }

  /**
   * Add question section
   */
  addInterviewQuestion() {
    this.InterviewQuestion.push(this.buildInterviewQuestionForm());
  }


  // Build form of question
  buildInterviewQuestionForm(question?: Question): FormGroup {
    return this.fb.group({
      Id: [question ? question.Id : NumberConstant.ZERO],
      IdInterview: [question ? question.IdInterview : NumberConstant.ZERO],
      QuestionLabel: [{
        value: question ? question.QuestionLabel : '',
        disabled: this.isCollaboratorConnected
      }, this.validationService.conditionalValidator((() => !this.isCollaboratorConnected), Validators.required)],
      ResponseLabel: [{
        value: question ? question.ResponseLabel : '',
        disabled: this.isCollaboratorConnected
      },
        this.validationService.conditionalValidator((() => !this.isCollaboratorConnected), Validators.required)],
      IsDeleted: [false]
    });
  }

  // Delete question
  deleteInterviewQuestion($event: Question, index: number) {
    if ($event.Id !== NumberConstant.ZERO) {
      this.swalWarrings.CreateSwal(ReviewConstant.DELETE_QUESTION).then((result) => {
        if (result.value) {
          this.questonService.deleteQuestionModel(this.IsUserInSuperHierarchicalEmployeeList, $event).subscribe(() => {
            this.InterviewQuestion.removeAt(index);
          });
        }
      });
    } else {
      if (this.InterviewQuestion.at(index).get(ReviewConstant.ID).value === NumberConstant.ZERO) {
        this.InterviewQuestion.removeAt(index);
      }
    }
  }
}
