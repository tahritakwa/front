import { Component, OnInit, Input, ViewContainerRef, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AddBankAccountComponent } from '../add-bank-account/add-bank-account.component';
import { DropDownComponent } from '../../../../interfaces/drop-down-component.interface';
import { PredicateFormat, Filter, Operation, OrderBy, OrderByDirection } from '../../../../utils/predicate';
import { BankAccount } from '../../../../../models/shared/bank-account.model';
import { FormModalDialogService } from '../../../../services/dialog/form-modal-dialog/form-modal-dialog.service';
import { SharedConstant } from '../../../../../constant/shared/shared.constant';
import { CompanyConstant } from '../../../../../constant/Administration/company.constant';
import { BankAccountService } from '../../../../../administration/services/bank-account/bank-account.service';
import { NumberConstant } from '../../../../../constant/utility/number.constant';
import { BankAccountConstant } from '../../../../../constant/Administration/bank-account.constant';
import {GenericAccountingService} from '../../../../../accounting/services/generic-accounting.service';
import { PermissionConstant } from '../../../../../Structure/permission-constant';
import { AuthService } from '../../../../../login/Authentification/services/auth.service';

@Component({
  selector: 'app-bank-account-dropdown',
  templateUrl: './bank-account-dropdown.component.html',
  styleUrls: ['./bank-account-dropdown.component.scss']
})
export class BankAccountDropdownComponent implements OnInit, DropDownComponent {
  /**
   * The name of the foreign table with which the join is made
   */
  @Input() foreignEntity: string;
  /**
   * The value of this entity
   */
  @Input() allowCustom: number;
  /**
   * Form group input
  */
  @Input() bankAccountForm: FormGroup;
  @Input() canAddNew = true;
  @Output() Selected: EventEmitter<BankAccount> = new EventEmitter();
  private predicate: PredicateFormat;
  isCreated : boolean;
  public bankDataSource: BankAccount[];
  public bankFiltredDataSource: BankAccount[];
  public AccountingPermissions = PermissionConstant.SettingsAccountingPermissions;

  constructor(private bankAccountService: BankAccountService, private viewRef: ViewContainerRef,
    private formModalDialogService: FormModalDialogService, public authService: AuthService) {
    }

  ngOnInit() {
    this.initDataSource();
  }

  /**
   * Initialize the data source
   * If allowcustom is set, get the list of bank account corresponding with the predicate
   */
  initDataSource(): void {
    this.predicate = new PredicateFormat();
    this.predicate.OrderBy = [new OrderBy(BankAccountConstant.RIB, OrderByDirection.asc)];
    this.bankAccountService.listdropdownWithPerdicate(this.predicate).subscribe((data: any) => {
      this.bankDataSource = data.listData;
      this.bankFiltredDataSource = this.bankDataSource.slice(NumberConstant.ZERO);
    });
  }

  handleFilter(value: string): void {
    this.bankFiltredDataSource = this.bankDataSource.filter((s) =>
      s.Rib.toLowerCase().includes(value.toLowerCase()));
  }

  addNew(): void {
    this.formModalDialogService.openDialog(CompanyConstant.ADD_BANK_ACCOUNT, AddBankAccountComponent,
      this.viewRef, this.selectLastOnClose.bind(this), null, true, SharedConstant.MODAL_DIALOG_SIZE_M);
  }

 async selectLastOnClose(lastAddedAccount) {
    this.predicate = new PredicateFormat();
    this.predicate.OrderBy = [new OrderBy(BankAccountConstant.RIB, OrderByDirection.asc)];
    this.bankAccountService.listdropdownWithPerdicate(this.predicate).subscribe((data: any) => {
      this.bankDataSource = data.listData;
      this.bankFiltredDataSource = this.bankDataSource.slice(NumberConstant.ZERO);
      this.bankAccountForm.controls.IdBankAccount.setValue(lastAddedAccount.Id);
      this.onSelect(lastAddedAccount.Id);
    });
  }

  onSelect($event) {
    const selected = this.bankFiltredDataSource.filter(x => x.Id === $event)[NumberConstant.ZERO];
    this.Selected.emit(selected);
  }

}
