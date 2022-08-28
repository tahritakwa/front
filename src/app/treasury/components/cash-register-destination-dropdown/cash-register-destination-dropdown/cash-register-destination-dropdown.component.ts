import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ComboBoxComponent } from '@progress/kendo-angular-dropdowns';
import { CashRegister } from '../../../../models/treasury/cash-register.model';
import { FundsTransferService } from '../../../services/funds-transfer/funds-transfer.service';

@Component({
  selector: 'app-cash-register-destination-dropdown',
  templateUrl: './cash-register-destination-dropdown.component.html',
  styleUrls: ['./cash-register-destination-dropdown.component.scss']
})
export class CashRegisterDestinationDropdownComponent implements OnInit {

  @Input() group: FormGroup;
  @Input() isAdd: boolean;
  @Output() sendDestinationCash: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild(ComboBoxComponent) public destinationCash: ComboBoxComponent;
  cashRegisterDestinationData: CashRegister[];
  cashRegisterFiltredDataSource: CashRegister[];

  constructor(private fundsTransferService: FundsTransferService) { }

  ngOnInit() {
    if(this.isAdd){
      this.initDestinationData();
    } else{
      this.fundsTransferService.getDestinationCashDropdown().subscribe(data => {
        this.cashRegisterDestinationData = data.listObject.listData
        this.cashRegisterFiltredDataSource = this.cashRegisterDestinationData;
      });
    }
  }

  initDestinationData(typeTransfer?: number) {
    if (!typeTransfer) {
      this.group.controls.IdDestinationCash.disable();
      this.group.controls.IdDestinationCash.setValue(undefined);
    } else {
      this.group.controls.IdDestinationCash.enable();
      this.fundsTransferService.getDestinationCashDropdown(typeTransfer).subscribe(data => {
        this.cashRegisterDestinationData = data.listObject.listData
        this.cashRegisterFiltredDataSource = this.cashRegisterDestinationData;
      });
    }
  }

  handleFilter(value: string) {
    this.cashRegisterFiltredDataSource = this.cashRegisterDestinationData.filter(x =>
      x.Name.toLowerCase().includes(value.toLowerCase()));
  }

  onSelect($event) {
    this.sendDestinationCash.emit($event);
  }

}
