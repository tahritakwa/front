import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { FormGroup, FormControl} from '@angular/forms';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { ReviewFormationStatus } from '../../../models/enumerators/review-formation-status.enum';
import { ReviewConstant } from '../../../constant/rh/review.constant';
import { ReviewFormation } from '../../../models/rh/review-formation.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-add-review-formation',
  templateUrl: './add-review-formation.component.html',
  styleUrls: ['./add-review-formation.component.scss']
})
export class AddReviewFormationComponent implements OnInit {

  @Input() reviewFormationFormGroup: FormGroup;
  @Input() currentReviewFormation: ReviewFormation;
  @Output() delectedAction = new EventEmitter<ReviewFormation>();
  formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);
  
  constructor(private translate: TranslateService) { }


  get IdFormation(): FormControl {
    return this.reviewFormationFormGroup.get(ReviewConstant.ID_FORMATION) as FormControl;
  }

  get Date(): FormControl {
    return this.reviewFormationFormGroup.get(ReviewConstant.DATE) as FormControl;
  }

  get FormationCollaboratorStatus(): FormControl {
    return this.reviewFormationFormGroup.get(ReviewConstant.FORMATION_COLLABORATOR_STATUS) as FormControl;
  }

  get FormationManagerStatus(): FormControl {
    return this.reviewFormationFormGroup.get(ReviewConstant.FORMATION_MANAGER_STATUS) as FormControl;
  }

  ngOnInit() {
  }

  deleteFutureReviewFormation(currentReviewFormation: ReviewFormation) {
    this.delectedAction.emit(currentReviewFormation);
  }
}
