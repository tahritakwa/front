import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SkillsMatrixConstant } from '../../../constant/payroll/skills-matrix.constant';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-level-dropdown',
  templateUrl: './level-dropdown.component.html',
  styleUrls: ['./level-dropdown.component.scss']
})
export class LevelDropdownComponent implements OnInit {

  @Output() selected = new EventEmitter<boolean>();
  public selectedValue: string;

  // List of all levels
  defaultListOfLevel = [SkillsMatrixConstant.BEGINNER , SkillsMatrixConstant.AMATEUR, SkillsMatrixConstant.INTERMEDIATE,
    SkillsMatrixConstant.GOOD, SkillsMatrixConstant.EXCELLENT, SkillsMatrixConstant.EXPERT];

  public levelDataSource: any[] = [];
  constructor(public translate: TranslateService) { }

  ngOnInit() {
    this.initDataSource();
  }
  initDataSource(): void {
    this.defaultListOfLevel.forEach(elem => {
      this.translate.get(elem.toUpperCase()).subscribe(trans => elem = trans);
      this.levelDataSource.push(elem);
    });
  }
  public onSelect($event): void {
    this.selected.emit($event);
  }
}
