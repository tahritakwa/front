import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {BenefitInKindService} from '../../../payroll/services/benefit-in-kind/benefit-in-kind.service';
import {BenefitInKind} from '../../../models/payroll/benefit-in-kind.model';
import {OrderBy, OrderByDirection, PredicateFormat} from '../../utils/predicate';
import {BenefitInKindConstant} from '../../../constant/payroll/benefit-in-kind.constant';

@Component({
  selector: 'app-benefit-in-kind-dropdown',
  templateUrl: './benefit-in-kind-dropdown.component.html',
  styleUrls: ['./benefit-in-kind-dropdown.component.scss']
})
export class BenefitInKindDropdownComponent implements OnInit {

  @Input() form: FormGroup;
  benefitInKindList: BenefitInKind[];
  private predicate: PredicateFormat;

  constructor(private benefitInKindService: BenefitInKindService) {
  }

  ngOnInit() {
    this.initDataSource();
  }

  initDataSource(): void {
    this.preparePredicate();
    this.benefitInKindService.listdropdownWithPerdicate(this.predicate).subscribe((data: any) => {
      this.benefitInKindList = data.listData;
    });
  }

  public preparePredicate() {
    this.predicate = new PredicateFormat();
    this.predicate.OrderBy = new Array<OrderBy>();
    this.predicate.OrderBy.push(new OrderBy(BenefitInKindConstant.NAME, OrderByDirection.asc));
  }
}
