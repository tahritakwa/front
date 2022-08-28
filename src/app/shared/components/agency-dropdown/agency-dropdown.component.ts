import { Component, Input, Output, EventEmitter} from '@angular/core';
import { DropDownComponent } from '../../interfaces/drop-down-component.interface';
import { PredicateFormat, Filter, Operation } from '../../utils/predicate';
import { BankAccount } from '../../../models/shared/bank-account.model';
import { Bank } from '../../../models/shared/bank.model';
import { TranslateService } from '@ngx-translate/core';
import { BankAccountService } from '../../../administration/services/bank-account/bank-account.service';
import { TreasuryConstant } from '../../../constant/treasury/treasury.constant';

@Component({
  selector: 'app-agency-dropdown',
  templateUrl: './agency-dropdown.component.html',
  styleUrls: ['./agency-dropdown.component.scss']
})
export class AgencyDropdownComponent implements  DropDownComponent {

  @Input() allowCustom;
  @Input() group;
  getBank = true;
  predicate: PredicateFormat;

  // data sources
  public agencyDataSource: BankAccount[];
  public agencyFiltredDataSource: BankAccount[];
  private bank: Bank;
  @Output() Selected = new EventEmitter<any>();

  constructor(private translate: TranslateService, private bankAccountService: BankAccountService) { }

  public setAgency(bank: Bank) {
    if (bank) {
      this.bank = bank;
      this.getBank = false;
      this.initDataSource();
    } else {
      this.agencyFiltredDataSource = [];
      this.getBank = true;
    }
  }
  preparePredicate(bank: Bank): void {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Filter.push(new Filter(TreasuryConstant.ID_BANK, Operation.eq, bank.Id));
  }
  initDataSource(): void {
    this.preparePredicate(this.bank);
    this.bankAccountService.readDropdownPredicateData(this.predicate).subscribe(data => {
      this.agencyDataSource = data;
      this.agencyFiltredDataSource = this.agencyDataSource.slice(0);
    });
  }
  handleFilter(value: string): void {
    this.agencyFiltredDataSource = this.agencyDataSource.filter((s) =>
      s.Agence.toLowerCase().includes(value.toLowerCase()));
  }

  public onchange(event): void {
    this.Selected.emit(event);
  }

}
