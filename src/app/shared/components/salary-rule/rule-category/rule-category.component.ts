import { Component, OnInit, Input } from '@angular/core';
import { EnumValues } from 'enum-values';
import { RuleCategory } from '../../../../models/enumerators/rule-category.enum';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-rule-category',
  templateUrl: './rule-category.component.html',
  styleUrls: ['./rule-category.component.scss']
})
export class RuleCategoryComponent implements OnInit {

  @Input() group;
  @Input() allowCustom;
  public ruleCategoryDataSource = [];
  RuleCategoryEnumerator = EnumValues.getNamesAndValues(RuleCategory);
  constructor(private translate: TranslateService) { }

  ngOnInit() {
    this.initDataSource();
  }

  initDataSource(): void {
    this.RuleCategoryEnumerator.forEach(element => {
      element.name = this.translate.instant(element.name.toUpperCase());
      this.ruleCategoryDataSource.push(element);
    });
  }

}
