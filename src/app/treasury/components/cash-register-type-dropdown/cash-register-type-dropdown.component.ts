import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { EnumValues } from 'enum-values';
import { CashRegisterTypeEnum } from '../../../models/enumerators/cash-managment-hierarchy-test-data.enum';
import { CashRegisterService } from '../../services/cash-register/cash-register.service';

@Component({
  selector: 'app-cash-register-type-dropdown',
  templateUrl: './cash-register-type-dropdown.component.html',
  styleUrls: ['./cash-register-type-dropdown.component.scss']
})
export class CashRegisterTypeDropdownComponent implements OnInit {

  @Input() group: FormGroup;
  @Input() notForPurchase: boolean;
  @Output() Selected = new EventEmitter<any>();
  cashRegisterTypeDataSource: any[];
  cashRegisterTypeFiltredDataSource: any[];
  constructor(public translate: TranslateService, private cashRegisterService: CashRegisterService) { }

  ngOnInit() {
    this.cashRegisterTypeDataSource = EnumValues.getNamesAndValues(CashRegisterTypeEnum);
    this.cashRegisterTypeDataSource.forEach(elem => {
      elem.name = elem.name.toUpperCase();
      this.translate.get(elem.name.toUpperCase()).subscribe(trans => elem.name = trans);
    });
    this.cashRegisterTypeFiltredDataSource = this.cashRegisterTypeDataSource;
    this.cashRegisterService.getCentralCash().subscribe(data => {
      if (data !== null) {
        this.cashRegisterTypeFiltredDataSource = this.cashRegisterTypeFiltredDataSource.filter(x => x.value != CashRegisterTypeEnum.Central);
      }
    });
    if(this.notForPurchase){
       this.cashRegisterTypeFiltredDataSource = this.cashRegisterTypeFiltredDataSource.filter(x => x.value != CashRegisterTypeEnum.ExpenseFund);
    }

  }

  handleFilter($event) {
    this.cashRegisterTypeFiltredDataSource = this.cashRegisterTypeDataSource.filter(y => y.name.toLocaleLowerCase().includes($event.toLocaleLowerCase()));
  }

  onSelect($event) {
    if(this.notForPurchase){
       this.cashRegisterTypeFiltredDataSource = this.cashRegisterTypeFiltredDataSource.filter(x => x.value != CashRegisterTypeEnum.ExpenseFund);
    }
    this.Selected.emit($event);
  }
}
