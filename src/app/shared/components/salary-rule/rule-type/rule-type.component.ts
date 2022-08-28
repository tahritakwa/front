import { Component, OnInit, Input } from '@angular/core';
import { EnumValues } from 'enum-values';
import { RuleType } from '../../../../models/enumerators/rule-type.enum';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-rule-type',
  templateUrl: './rule-type.component.html',
  styleUrls: ['./rule-type.component.scss']
})
export class RuleTypeComponent implements OnInit {
  @Input() group;
  @Input() allowCustom;
  public ruleTypeDataSource = [];
  RuleTypeEnumerator = EnumValues.getNamesAndValues(RuleType);
  constructor(private translate: TranslateService) { }

  ngOnInit() {
    this.initDataSource();
  }

  initDataSource(): void {
    this.RuleTypeEnumerator.sort((a, b) =>
      this.translate.instant(a.name.toUpperCase()).localeCompare(this.translate.instant(b.name.toUpperCase())));
    this.RuleTypeEnumerator.forEach(element => {
      element.name = this.translate.instant(element.name.toUpperCase());
      this.ruleTypeDataSource.push(element);
    });
  }

}
