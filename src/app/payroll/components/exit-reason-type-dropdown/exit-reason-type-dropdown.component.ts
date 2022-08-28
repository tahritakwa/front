import {Component, Input, OnInit} from '@angular/core';
import {EnumValues} from 'enum-values';
import {ExitReasonTypeEnumerator} from '../../../models/enumerators/exit-reason-type-enum';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-exit-reason-type-dropdown',
  templateUrl: './exit-reason-type-dropdown.component.html',
  styleUrls: ['./exit-reason-type-dropdown.component.scss']
})
export class ExitReasonTypeDropdownComponent implements OnInit {

  exitReasonsEnumValues = EnumValues.getNamesAndValues(ExitReasonTypeEnumerator);
  exitReasons: any;
  selectedExitReason: number;
  @Input() group;

  constructor(public translate: TranslateService) {
  }

  ngOnInit() {
    this.exitReasons = [];
    this.exitReasonsEnumValues.forEach(element => {
      const elem = element;
      elem.name = this.translate.instant(elem.name.toUpperCase());
      this.exitReasons.push(elem);
    });
  }

}
