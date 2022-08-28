import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ComboBoxComponent } from '@progress/kendo-angular-dropdowns';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { CashRegister } from '../../../models/treasury/cash-register.model';
import { FundsTransferService } from '../../services/funds-transfer/funds-transfer.service';

@Component({
  selector: 'app-cash-register-source-dropdown',
  templateUrl: './cash-register-source-dropdown.component.html',
  styleUrls: ['./cash-register-source-dropdown.component.scss']
})
export class CashRegisterSourceDropdownComponent implements OnInit {
  @Input() group: FormGroup;
  @Input() isAdd: boolean;
  @Output() sendSourceCash: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild(ComboBoxComponent) public sourceCash: ComboBoxComponent;
  cashRegisterSourceData: CashRegister[];
  cashRegisterDestinationData: CashRegister[];
  cashRegisterFiltredDataSource: any[];

  constructor(private fundsTransferService: FundsTransferService) {
   }

  ngOnInit() {
    if(this.isAdd){
      this.initSourceCashData();
    } else{
      this.fundsTransferService.getSourceCashDropdown().subscribe((data: any) => {
        this.cashRegisterSourceData = data.listObject.listData;
        this.cashRegisterFiltredDataSource = this.cashRegisterSourceData;
      });
    }
  }

  public initSourceCashData(typeTransfer?: number) {
    if (!typeTransfer) {
      this.group.controls.IdSourceCash.disable();
      this.group.controls.IdSourceCash.setValue(undefined);
    } else {
      this.group.controls.IdSourceCash.enable();
      this.fundsTransferService.getSourceCashDropdown(typeTransfer).subscribe(data => {
        this.cashRegisterSourceData = data.listObject.listData
        this.cashRegisterFiltredDataSource = this.cashRegisterSourceData;
      });
    }
  }

  handleFilter(value: string) {
    this.cashRegisterFiltredDataSource = this.cashRegisterSourceData.filter(x =>
      x.Name.toLowerCase().includes(value.toLowerCase()));
  }

  onSelect($event) {
    this.sendSourceCash.emit($event);
  }
}