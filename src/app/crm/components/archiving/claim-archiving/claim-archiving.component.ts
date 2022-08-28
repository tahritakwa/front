import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../../login/Authentification/services/auth.service';
import {PermissionConstant} from '../../../../Structure/permission-constant';

@Component({
  selector: 'app-claim-archiving',
  templateUrl: './claim-archiving.component.html',
  styleUrls: ['./claim-archiving.component.scss']
})
export class ClaimArchivingComponent implements OnInit {
  public isArchivingMode = true;
  public CRMPermissions = PermissionConstant.CRMPermissions;
  constructor(public authService: AuthService) { }

  ngOnInit() {
  }

}
