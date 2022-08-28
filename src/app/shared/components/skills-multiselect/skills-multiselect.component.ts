import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {Skills} from '../../../models/payroll/skills.model';
import {SkillsService} from '../../../payroll/services/skills/skills.service';
import {OrderBy, OrderByDirection, PredicateFormat} from '../../utils/predicate';
import { FormControl, FormGroup } from '@angular/forms';
import { TrainingConstant } from '../../../constant/rh/training.constant';

@Component({
  selector: 'app-skills-multiselect',
  templateUrl: './skills-multiselect.component.html',
  styleUrls: ['./skills-multiselect.component.scss']
})
export class SkillsMultiselectComponent implements OnInit {

  public selectedValueMultiSelect =  [];
  public skillsDataSource: Skills[];
  public skillsFiltredDataSource: Skills[];
  public predicate: PredicateFormat;
  @Input() selectedValue;
  @Output() selected = new EventEmitter<boolean>();
  @Input() form: FormGroup;

  constructor(public skillsService: SkillsService) {
  }

  public onSelect($event): void {
    this.selected.emit($event);
  }

  ngOnInit() {
    this.initDataSource();
    if (this.selectedValue) {
      this.selectedValueMultiSelect = this.selectedValue;
    }
  }
  get TrainingExpectedSkills(): FormControl {
    return <FormControl>this.form.get(TrainingConstant.TRAINING_EXPECTED_SKILLS);
  }
  initDataSource(): void {
    this.preparePredicate();
    this.skillsService.listdropdownWithPerdicate(this.predicate).subscribe((data: any) => {
      this.skillsDataSource = data.listData;
      this.skillsFiltredDataSource = this.skillsDataSource.slice(0);
    });
  }
  handleFilter(value: string): void {
    this.skillsFiltredDataSource = this.skillsDataSource.filter((s) =>
      s.Code.toLowerCase().includes(value.toLowerCase()));
  }
  public preparePredicate() {
    this.predicate = new PredicateFormat();
    this.predicate.OrderBy = new Array<OrderBy>();
    this.predicate.OrderBy.push(new OrderBy(SharedConstant.LABEL, OrderByDirection.asc));
  }
}
