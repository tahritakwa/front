import { Component, OnInit, ViewChild } from '@angular/core';
import { TrainingConstant } from '../../../constant/rh/training.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { TrainingRequestShowComponent } from '../training-request-show/training-request-show.component';

@Component({
  selector: 'app-training-list-request',
  templateUrl: './training-list-request.component.html',
  styleUrls: ['./training-list-request.component.scss']
})
export class TrainingListRequestComponent implements OnInit {

  @ViewChild(TrainingRequestShowComponent) trainingRequestShow: TrainingRequestShowComponent;
  public hasAllTrainingRequest = false;
  public trainingRequestState = TrainingConstant.TRAINING_REQUEST_STATE;

  constructor(public authService: AuthService) {
  }

  ngOnInit() {
    this.hasAllTrainingRequest = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.ALL_TRAINING_REQUEST);
  }

  initializeData(predicate) {
    this.trainingRequestShow.doSearch(predicate);
  }
}
