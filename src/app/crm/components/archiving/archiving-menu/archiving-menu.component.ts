import { Component, OnInit } from '@angular/core';
import {PermissionConstant} from '../../../../Structure/permission-constant';
import { AuthService } from 'app/login/Authentification/services/auth.service';

@Component({
  selector: 'app-archiving-menu',
  templateUrl: './archiving-menu.component.html',
  styleUrls: ['./archiving-menu.component.scss']
})
export class ArchivingMenuComponent implements OnInit {
  public CRMPermissions = PermissionConstant.CRMPermissions;
  constructor(public authService: AuthService) { }

  ngOnInit() {
  }

}
