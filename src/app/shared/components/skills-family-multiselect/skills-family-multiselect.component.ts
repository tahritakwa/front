import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { SkillsFamily } from '../../../models/payroll/skills-family.model';
import { SkillsFamilyService } from '../../../payroll/services/skills-family/skills-family.service';
import { OrderBy, OrderByDirection, PredicateFormat } from '../../utils/predicate';

@Component({
  selector: 'app-skills-family-multiselect',
  templateUrl: './skills-family-multiselect.component.html',
  styleUrls: ['./skills-family-multiselect.component.scss']
})
export class SkillsFamilyMultiselectComponent implements OnInit {

  public selectedValueMultiSelect: SkillsFamily[];
  // data sources
  public skillsFamilyDataSource: SkillsFamily[];
  public skillsFamilyFiltredDataSource: SkillsFamily[];
  public predicate: PredicateFormat;


  @Input() selectedValue;
  @Output() selected = new EventEmitter<boolean>();

  constructor(public skillsFamilyService: SkillsFamilyService) { }

  public onSelect($event): void {
    this.selected.emit($event);
  }
  ngOnInit() {
    this.initDataSource();
    if (this.selectedValue) {
      this.selectedValueMultiSelect = this.selectedValue;
    }
  }
  initDataSource(): void {
    this.preparePredicate();
    this.skillsFamilyService.listdropdownWithPerdicate(this.predicate).subscribe((data: any) => {
      this.skillsFamilyDataSource = data.listData;
      this.skillsFamilyFiltredDataSource = this.skillsFamilyDataSource.slice(0);
    });
  }
  public preparePredicate() {
    this.predicate = new PredicateFormat();
    this.predicate.OrderBy = new Array<OrderBy>();
    this.predicate.OrderBy.push(new OrderBy(SharedConstant.LABEL, OrderByDirection.asc));
  }

}
