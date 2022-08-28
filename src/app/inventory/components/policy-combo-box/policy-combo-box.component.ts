import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SalePolicy } from '../../../constant/inventory/item.enum';

const SUP = 'SUP';
const PMP = 'PMP';
const INF = 'INF';
const NOV = 'NOV';
@Component({
  selector: 'app-policy-combo-box',
  templateUrl: './policy-combo-box.component.html',
  styleUrls: ['./policy-combo-box.component.scss']
})

export class PolicyComboBoxComponent implements OnInit {
  @Input() allowCustom;
  @Input() parentForm;
  @Input() formControlName = 'IdPolicyValorization';
  @Output() selectValue = new EventEmitter<any>();
  @Input() readonly : boolean
  policies: Policy[];
  public selectedPolicy: number;
  constructor(private translate: TranslateService) { }

  ngOnInit() {
    this.initPlicies();
  }

  initPlicies() {
    this.policies = [
      new Policy(SalePolicy.INF, `${this.translate.instant(INF)}`),
      new Policy(SalePolicy.NOV, `${this.translate.instant(NOV)}`),
      new Policy(SalePolicy.PMP, `${this.translate.instant(PMP)}`),
      new Policy(SalePolicy.SUP, `${this.translate.instant(SUP)}`)
    ];
  }
  onSelect($event) {
    this.selectValue.emit($event);
  }
}


/**
 * Policy model
 * */
export class Policy {
  constructor(public value: number, public text: string) { }
}
