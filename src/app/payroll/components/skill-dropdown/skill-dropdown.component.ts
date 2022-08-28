import {Component, EventEmitter, Input, OnInit, Output, ViewContainerRef} from '@angular/core';
import {DropDownComponent} from '../../../shared/interfaces/drop-down-component.interface';
import {FormGroup} from '@angular/forms';
import {SkillsService} from '../../services/skills/skills.service';
import {FormModalDialogService} from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import {TranslationKeysConstant} from '../../../constant/shared/translation-keys.constant';
import {CompanySkillsComponent} from '../../../administration/company/company-skills/company-skills.component';
import {ReducedSkills} from '../../../models/payroll/reduced-skills.model';
import {SharedConstant} from '../../../constant/shared/shared.constant';

@Component({
  selector: 'app-skill-dropdown',
  templateUrl: './skill-dropdown.component.html',
  styleUrls: ['./skill-dropdown.component.scss']
})
export class SkillDropdownComponent implements OnInit, DropDownComponent {
  @Output() Selected = new EventEmitter<boolean>();
  @Input() allowCustom;
  @Input() form: FormGroup;
  @Input() isAdvancedAdd: boolean;
  @Input() disabled;
  @Input() value;
  @Input() ngModel;
  @Input() valueChange;
  @Input() selectedSkill: number;
  public skillDataSource: ReducedSkills[];
  public skillFiltredDataSource: ReducedSkills[];

  constructor(private skillService: SkillsService, private viewRef: ViewContainerRef,
              private formModalDialogService: FormModalDialogService) {
  }

  initDataSource(paging?: boolean): void {
    this.skillService.listdropdown().subscribe((data: any) => {
      this.skillDataSource = data.listData;
      this.skillFiltredDataSource = this.skillDataSource.slice(0);
    });
  }

  handleFilter(value: string): void {
    this.skillFiltredDataSource = this.skillDataSource.filter((s) =>
      s.Label.toLowerCase().includes(value.toLowerCase())
    );
  }

  addNew(): void {
    this.formModalDialogService.openDialog(TranslationKeysConstant.ADD_SKILL, CompanySkillsComponent,
      this.viewRef, this.initDataSource.bind(this), null, null, SharedConstant.MODAL_DIALOG_SIZE_M);
  }


  onSelect($event) {
    this.Selected.emit($event);
  }

  ngOnInit() {
    this.initDataSource();
  }

}
