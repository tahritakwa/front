import { Component, OnInit } from '@angular/core';
import {PermissionConstant} from '../../../../Structure/permission-constant';
import {AuthService} from '../../../../login/Authentification/services/auth.service';

@Component({
  selector: 'app-contact-archiving',
  templateUrl: './contact-archiving.component.html',
  styleUrls: ['./contact-archiving.component.scss']
})
export class ContactArchivingComponent implements OnInit {
  public isArchivingMode = true;
  public CRMPermissions = PermissionConstant.CRMPermissions;
  constructor(public authService: AuthService) { }

  ngOnInit() {
  }

}
