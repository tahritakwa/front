import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActionService} from '../../../services/action/action.service';
import {PermissionConstant} from '../../../../Structure/permission-constant';
import { AuthService } from 'app/login/Authentification/services/auth.service';

@Component({
  selector: 'app-action-archiving',
  templateUrl: './action-archiving.component.html',
  styleUrls: ['./action-archiving.component.scss']
})
export class ActionArchivingComponent implements OnInit, OnDestroy {
  public CRMPermissions = PermissionConstant.CRMPermissions;
  constructor(private actionService: ActionService,
              public authService: AuthService) {
  }

  ngOnInit() {
    this.setArchivingMode();
  }

  setArchivingMode() {
    this.actionService.setArchivingModes(true);
  }

  resetArchivingMode() {
    this.actionService.resetArchivingMode();
  }

  ngOnDestroy(): void {
    this.resetArchivingMode();
  }

}
