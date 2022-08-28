import { Component, OnInit, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { EventEmitter } from '@angular/core';
import { CashRegisterService } from '../../services/cash-register/cash-register.service';
import { CashRegisterStatusEnumerator, CashRegisterTypeEnum } from '../../../models/enumerators/cash-managment-hierarchy-test-data.enum';
import { Filter, Operation, OrderBy, OrderByDirection, PredicateFormat } from '../../../shared/utils/predicate';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { CashRegisterConstant } from '../../../constant/treasury/cash-register.constant';
import { CashRegister } from '../../../models/treasury/cash-register.model';

@Component({
  selector: 'app-cash-register-dropdown',
  templateUrl: './cash-register-dropdown.component.html',
  styleUrls: ['./cash-register-dropdown.component.scss']
})
export class CashRegisterDropdownComponent implements OnInit {
  @Input() group: FormGroup;
  @Input() idCashColName: string;
  @Input() isFromOpenSession: boolean;
  @Input() isForPrincipal: boolean;
  @Input() onlyClosed: boolean;
  @Input() isForRecipeBox : boolean;
  @Input() disabled : boolean;
  @Output() selected = new EventEmitter<any>();
  cashRegisterDataSource: CashRegister[];
  cashRegisterFiltredDataSource: CashRegister[];
  predicate: PredicateFormat;
  constructor(private cashRegisterService: CashRegisterService) { }

  ngOnInit() {
    if (!this.idCashColName) {
      this.idCashColName = CashRegisterConstant.ID_PARENT_CASH;
    }
    this.initDataSource();
  }

  initDataSource(idParentCash?: number): void {
    this.preparePredicate(this.isFromOpenSession, false, idParentCash,this.isForRecipeBox);
    this.cashRegisterService.readDropdownPredicateData(this.predicate).subscribe((data: any) => {
      this.cashRegisterDataSource = data.filter(x => x.Type != CashRegisterTypeEnum.ExpenseFund);
      this.cashRegisterFiltredDataSource = this.cashRegisterDataSource.slice(0);
    });
  }
  preparePredicate(isFromOpenSession?: boolean, isForPrincipal?: boolean, idParentCash?: number,isForRecipeBox? :boolean): void {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    if (isFromOpenSession) {
      this.predicate.Filter.push(new Filter(CashRegisterConstant.TYPE, Operation.neq, CashRegisterTypeEnum.Central));
      this.predicate.Filter.push(new Filter(CashRegisterConstant.TYPE, Operation.neq, CashRegisterTypeEnum.Principal));
      this.predicate.Filter.push(new Filter(CashRegisterConstant.STATUS, Operation.eq, CashRegisterStatusEnumerator.Closed));
    } else if (isForPrincipal || this.isForPrincipal) {
      this.predicate.Filter.push(new Filter(CashRegisterConstant.TYPE, Operation.eq, CashRegisterTypeEnum.Principal));
    }
    if (idParentCash){
      this.predicate.Filter.push(new Filter(CashRegisterConstant.ID_PARENT_CASH, Operation.eq, idParentCash));
    }
    if(isForRecipeBox){
      this.predicate.Filter.push(new Filter(CashRegisterConstant.TYPE, Operation.eq, CashRegisterTypeEnum.RecipeBox));
    }

    this.predicate.OrderBy = new Array<OrderBy>();
    this.predicate.OrderBy.push(new OrderBy(SharedConstant.CODE, OrderByDirection.asc));
  }
 // get only principal cash
  public getPrincipalCash(): void {
    this.preparePredicate(null, true);
    this.cashRegisterService.readDropdownPredicateData(this.predicate).subscribe(data => {
      this.cashRegisterDataSource = data;
      this.cashRegisterFiltredDataSource = this.cashRegisterDataSource.slice(0);
    });
  }
  handleFilter(value: string) {
    this.cashRegisterFiltredDataSource = this.cashRegisterDataSource.filter((s) =>
    s.Code.toLowerCase().includes(value.toLowerCase())
    || s.Code.toLocaleLowerCase().includes(value.toLowerCase()));
  }

  onSelect($event) {
    const cash = this.cashRegisterFiltredDataSource.find(x => x.Id == $event);
    this.selected.emit(cash);
  }

  onClear() {
    this.idCashColName = undefined;
  }
}
