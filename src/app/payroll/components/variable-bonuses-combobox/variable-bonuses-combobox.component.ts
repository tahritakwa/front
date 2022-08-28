import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Filter, Operation, OrderBy, OrderByDirection, PredicateFormat} from '../../../shared/utils/predicate';
import {FormControl, FormGroup} from '@angular/forms';
import {BonusService} from '../../services/bonus/bonus.service';
import {Bonus} from '../../../models/payroll/bonus.model';
import {BonusConstant} from '../../../constant/payroll/bonus.constant';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {VariableConstant} from '../../../constant/payroll/variable.constant';

@Component({
  selector: 'app-variable-bonuses-combobox',
  templateUrl: './variable-bonuses-combobox.component.html',
  styleUrls: ['./variable-bonuses-combobox.component.scss']
})
export class VariableBonusesComboboxComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() allowCustom;
  @Output() sendData = new EventEmitter<any>();
  @Input() disabled: FormGroup;
  predicate: PredicateFormat;
  // The object of the combobox selected
  bonusSelected: Bonus;
  public bonusesList: Bonus[];
  // The data input of the combobox
  public bonusesFiltredList: Bonus[];

  constructor(private bonusService: BonusService) {
  }

  get IdBonusType(): FormControl {
    return this.form.get(BonusConstant.ID_BONUS_TYPE) as FormControl;
  }

  ngOnInit() {
    this.initDataSource();
  }

  // This method will invoke a server Endpoint to retrieve variable bonuses
  public initDataSource() {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Filter.push(new Filter(BonusConstant.IS_FIXE, Operation.eq, NumberConstant.ZERO));
    this.predicate.OrderBy = new Array<OrderBy>();
    this.predicate.OrderBy.push(new OrderBy(VariableConstant.NAME, OrderByDirection.asc));
    this.bonusService.readPredicateData(this.predicate).subscribe(data => {
      this.bonusesList = data;
      this.bonusesFiltredList = this.bonusesList.slice(NumberConstant.ZERO);
      //this.onChangeShowGrid();
    });
  }

  // This method will be invoked everytime the combobox value changed to emit data to the parent
  onChangeShowGrid($event?) {
    if (this.IdBonusType.value) {
      this.bonusSelected = this.bonusesList.filter(x => x.Id === this.IdBonusType.value)[0];
      this.sendData.emit(this.bonusSelected);
    }
  }

  public getSelectedBonus(): Bonus {
    return this.bonusesList.filter(x => x.Id === this.IdBonusType.value)[NumberConstant.ZERO];
  }

  /**
   * Dropdown front filter
   * @param value
   */
  handleFilter(value: string): void {
    this.bonusesFiltredList = this.bonusesList.filter((s) => s.Name.toLowerCase().includes(value.toLowerCase()));
  }
}

