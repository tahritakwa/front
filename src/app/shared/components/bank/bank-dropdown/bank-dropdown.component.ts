import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {DropDownComponent} from '../../../interfaces/drop-down-component.interface';
import {Bank} from '../../../../models/shared/bank.model';
import {BankService} from '../../../../treasury/services/bank.service';
import {SharedConstant} from '../../../../constant/shared/shared.constant';
import {ComboBoxComponent} from '@progress/kendo-angular-dropdowns';
import {TreasuryConstant} from '../../../../constant/treasury/treasury.constant';
import {NumberConstant} from '../../../../constant/utility/number.constant';
import { PredicateFormat, OrderBy, OrderByDirection } from '../../../utils/predicate';
import { BankAccountConstant } from '../../../../constant/Administration/bank-account.constant';


@Component({
  selector: 'app-bank-dropdown',
  templateUrl: './bank-dropdown.component.html',
  styleUrls: ['./bank-dropdown.component.scss']
})
export class BankDropdownComponent implements OnInit, DropDownComponent {

  /**
   * Form group input
   */
  @Input() group: FormGroup;
  @Input() allowCustom;
  @Input() idBankColName;
  @Input() disabled;
  @Output() Selected = new EventEmitter<any>();
  @Input() showDetails: boolean;
  public bankDataSource: Bank[] = [];
  public bankFiltredDataSource: Bank[] = [];
  public BANK_EDIT_URL = TreasuryConstant.BANK_EDIT_URL;
  @ViewChild(ComboBoxComponent) bankComboBoxComponent: ComboBoxComponent;
  public predicate: PredicateFormat;
  constructor(
    private bankService: BankService) {
  }

  ngOnInit() {
    if (!this.idBankColName) {
      this.idBankColName = SharedConstant.ID_BANK;
    }
    this.initDataSource();

  }

  public onchange(event): void {
    const selected = this.bankFiltredDataSource.filter(bank => bank.Id === event)[NumberConstant.ZERO];
    this.Selected.emit(selected);
  }

  /**
   * Initialize the data source
   */
  initDataSource(): void {
    this.bankService.listdropdown().subscribe((data: any) => {
      this.bankDataSource = data.listData;
      this.bankFiltredDataSource = this.bankDataSource.slice(NumberConstant.ZERO);
    });
  }

  handleFilter(value: string): void {
    this.bankFiltredDataSource = this.bankDataSource.filter((s) =>
      s.Name.toLowerCase().includes(value.toLowerCase()));
  }

  get IdBank(): FormGroup {
    return this.group.get(this.idBankColName) as FormGroup;
  }
 public preparePredicate() {
  this.predicate = new PredicateFormat();
  this.predicate.OrderBy = new Array<OrderBy>();
  this.predicate.OrderBy.push(new OrderBy(BankAccountConstant.NAME, OrderByDirection.asc));
}

}
