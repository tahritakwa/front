import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Filter, Operation, PredicateFormat} from '../../../shared/utils/predicate';
import {Bonus} from '../../../models/payroll/bonus.model';
import {BonusService} from '../../services/bonus/bonus.service';
import {ContractBonus} from '../../../models/payroll/contract-bonus.model';
import {DropDownComponent} from '../../../shared/interfaces/drop-down-component.interface';

const ID = 'Id';
const CONTRACT_BONUS = 'ContractBonus';

@Component({
  selector: 'app-fixed-bonuses-multiselect',
  templateUrl: './fixed-bonuses-multiselect.component.html',
  styleUrls: ['./fixed-bonuses-multiselect.component.scss']
})
export class FixedBonusesMultiselectComponent implements OnInit, DropDownComponent {
  @Input() group: FormGroup;
  public bonusDataSource: Bonus[];
  public bonusFiltredDataSource: Bonus[];
  public selectedValues: number[];
  private predicate: PredicateFormat;

  constructor(private bonusService: BonusService) {
    this.predicate = new PredicateFormat();
  }

  /**
   * ContractBonus getter
   */
  get ContractBonus(): FormControl {
    return this.group.get(CONTRACT_BONUS) as FormControl;
  }

  /**
   * Get the bonus selected
   */
  get selectedContractBonus(): ContractBonus[] {
    const selectedBonus = new Array<ContractBonus>();
    if (this.selectedValues) {
      this.selectedValues.forEach((x) => {
        selectedBonus.push(new ContractBonus(x, this.group.get(ID).value));
      });
    }
    return selectedBonus;
  }

  ngOnInit() {
    this.initDataSource();
    if (this.group.get(CONTRACT_BONUS).value) {
      this.selectedValues = this.group.get(CONTRACT_BONUS).value;
    }
  }

  preparePredicate() {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Filter.push(new Filter('IsFixe', Operation.eq, 1));
  }

  initDataSource(): void {
    this.preparePredicate();
    this.bonusService.readPredicateData(this.predicate).subscribe(data => {
      this.bonusDataSource = data;
      this.bonusFiltredDataSource = this.bonusDataSource.slice(0);
    });
  }

  /**
   * filter by code and Description
   * @param value
   */
  handleFilter(value: string): void {
    this.bonusFiltredDataSource = this.bonusDataSource.filter((s) =>
      s.Code.toLowerCase().includes(value.toLowerCase())
      || s.Description.toLocaleLowerCase().includes(value.toLowerCase()));
  }

  addNew(): void {
    throw new Error('Method not implemented.');
  }
}
