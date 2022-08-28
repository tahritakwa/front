import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { TrainingSession } from '../../../models/rh/training-session.model';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { PlanningTrainingSessionSeanceComponent } from '../planning-training-session-seance/planning-training-session-seance.component';
import { PlanningTrainingSessionComponent } from '../planning-training-session/planning-training-session.component';

@Component({
  selector: 'app-sesssion-stepper',
  templateUrl: './sesssion-stepper.component.html',
  styleUrls: ['./sesssion-stepper.component.scss']
})
export class SesssionStepperComponent implements OnInit {
  @ViewChild(PlanningTrainingSessionComponent) planningTrainingSessionComponent: PlanningTrainingSessionComponent;
  @ViewChild(PlanningTrainingSessionSeanceComponent) planningTrainingSessionSeanceComponent: PlanningTrainingSessionSeanceComponent;
  @Input() trainingSession: TrainingSession;
  @Input() isUpdateMode: boolean;
  @Input() idTraining: number;
  @Input() idTrainingSession: number;
  public hasUpdateTrainingSessionPermission: boolean;
  public hasAddTrainingSessionPermission: boolean;
  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.hasUpdateTrainingSessionPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.UPDATE_TRAININGSESSION);
    this.hasAddTrainingSessionPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.ADD_TRAININGSESSION);
  }
  trainingSessionEmitterEventHandler(event: TrainingSession) {
    this.trainingSession = event;
  }
}
