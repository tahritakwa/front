import { Component, OnInit } from '@angular/core';
import {PermissionConstant} from '../../../../Structure/permission-constant';
import {AuthService} from '../../../../login/Authentification/services/auth.service';

@Component({
  selector: 'app-opportunity-archiving',
  templateUrl: './opportunity-archiving.component.html',
  styleUrls: ['./opportunity-archiving.component.scss']
})
export class OpportunityArchivingComponent implements OnInit {
  public isArchivingMode = true;
  public CRMPermissions = PermissionConstant.CRMPermissions;
  constructor(public authService: AuthService) { }

  ngOnInit() {
  }

}
