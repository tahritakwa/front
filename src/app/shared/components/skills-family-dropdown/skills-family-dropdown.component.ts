import { Component, OnInit, Input, EventEmitter, Output, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SkillsFamilyService } from '../../../payroll/services/skills-family/skills-family.service';
import { ReducedSkillsFamily } from '../../../models/payroll/reduced-skills-family.model';
import { OrderBy, OrderByDirection, PredicateFormat } from '../../utils/predicate';
import { SharedConstant } from '../../../constant/shared/shared.constant';

@Component({
  selector: 'app-skills-family-dropdown',
  templateUrl: './skills-family-dropdown.component.html',
  styleUrls: ['./skills-family-dropdown.component.scss']
})
export class SkillsFamilyDropdownComponent implements OnInit {


  @Input() allowCustom;
  @Input() form: FormGroup;
  @Input() isInGrid;
  @Output() selected = new EventEmitter<boolean>();
  @Output() addClicked = new EventEmitter<boolean>();

  // data sources
  public skillsFamilyDataSource: ReducedSkillsFamily[];
  public skillsFamilyFiltredDataSource: ReducedSkillsFamily[];
  public predicate: PredicateFormat;

  constructor(private skillsFamilyService: SkillsFamilyService) { }

  ngOnInit() {
    this.initDataSource();
  }

  public onSelect($event): void {
    this.selected.emit($event);
  }

  public initDataSource(): void {
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

  /**
   * filter by label
   * @param value
   */
  handleFilter(value: string) {
    this.skillsFamilyFiltredDataSource = this.skillsFamilyDataSource.filter((s) =>
      s.Label.toLowerCase().includes(value.toLowerCase())
    );
  }
  addNew() {
    if (this.isInGrid) {
      // notice the grid to treat the add event
      this.addClicked.emit();
    } else {
      // open add form in modal
    }
  }
}
