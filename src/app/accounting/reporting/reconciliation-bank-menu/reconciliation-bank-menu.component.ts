import {Component, Input, OnInit} from '@angular/core';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';

@Component({
  selector: 'app-reconciliation-bank-menu',
  templateUrl: './reconciliation-bank-menu.component.html',
  styleUrls: ['./reconciliation-bank-menu.component.scss']
})
export class ReconciliationBankMenuComponent implements OnInit {
  @Input() currentFiscalYearId:any;
  public AccountingPermissions = PermissionConstant.AccountingPermissions;

  constructor(public authService: AuthService) {
  }

  ngOnInit() {
  }

}
