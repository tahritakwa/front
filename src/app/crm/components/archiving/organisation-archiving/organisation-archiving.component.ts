import { Component, OnInit } from '@angular/core';
import {PermissionConstant} from '../../../../Structure/permission-constant';
import {AuthService} from '../../../../login/Authentification/services/auth.service';

@Component({
  selector: 'app-organisation-archiving',
  templateUrl: './organisation-archiving.component.html',
  styleUrls: ['./organisation-archiving.component.scss']
})
export class OrganisationArchivingComponent implements OnInit {
  public isArchivingMode = true;
  public CRMPermissions = PermissionConstant.CRMPermissions;
  constructor(public authService: AuthService) { }

  ngOnInit() {
  }

}
