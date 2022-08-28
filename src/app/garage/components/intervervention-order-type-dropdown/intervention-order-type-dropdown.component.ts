import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { EnumValues } from 'enum-values';
import { GarageConstant } from '../../../constant/garage/garage.constant';
import { InterventionOrderTypeEnumerator } from '../../../models/enumerators/intervention-order-type.enum';

@Component({
  selector: 'app-intervention-order-type-dropdown',
  templateUrl: './intervention-order-type-dropdown.component.html',
  styleUrls: ['./intervention-order-type-dropdown.component.scss']
})
export class InterventionOrderTypeDropdownComponent implements OnInit {

  @Input() group: FormGroup;
  @Input() controlName: string;
  @Output() selectedValue = new EventEmitter<number>();
  interventionTypeDataSource: any[] = EnumValues.getNamesAndValues(InterventionOrderTypeEnumerator);
  interventionTypeFilterDataSource: any[];
  constructor(private translateService: TranslateService) { }

  ngOnInit() {
    if (!this.controlName) {
      this.controlName = GarageConstant.INTERVENTION_TYPE;
    }
    this.initGridDataSource();
  }

  initGridDataSource() {
    this.interventionTypeDataSource.forEach((element) => {
      element.name = this.translateService.instant(String(element.name).toUpperCase());
    });
    this.interventionTypeFilterDataSource = this.interventionTypeDataSource.slice(0);
  }

  handleFilter(value) {
    this.interventionTypeFilterDataSource = this.interventionTypeDataSource.filter((s) =>
      s.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  onValueChanged($event) {
    this.selectedValue.emit($event);
  }
}
