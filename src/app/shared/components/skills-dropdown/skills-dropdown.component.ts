import {Component, EventEmitter, Input, OnInit, Output, ViewContainerRef} from '@angular/core';
import {DropDownComponent} from '../../interfaces/drop-down-component.interface';
import {FormControl, FormGroup} from '@angular/forms';
import {SkillsService} from '../../../payroll/services/skills/skills.service';
import {Filter, Operation, OrderBy, OrderByDirection, PredicateFormat} from '../../utils/predicate';
import {SkillsConstant} from '../../../constant/payroll/skills.constant';
import {ReducedSkills} from '../../../models/payroll/reduced-skills.model';
import {TranslationKeysConstant} from '../../../constant/shared/translation-keys.constant';
import {CompanySkillsComponent} from '../../../administration/company/company-skills/company-skills.component';
import {FormModalDialogService} from '../../services/dialog/form-modal-dialog/form-modal-dialog.service';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {PermissionConstant} from '../../../Structure/permission-constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';

@Component({
  selector: 'app-skills-dropdown',
  templateUrl: './skills-dropdown.component.html',
  styleUrls: ['./skills-dropdown.component.scss']
})
export class SkillsDropdownComponent implements OnInit, DropDownComponent {

  @Input() skillsFamilySelected: number[];
  @Input() currentSkillId: number;
  @Input() skillsForm: FormGroup;
  @Input() allowCustom;
  @Input() skillsToIgnore: number[];
  @Input() disabled: boolean;
  @Output() selected = new EventEmitter<boolean>();
  @Output() SkillsListChanged = new EventEmitter<boolean>();
  public skillsHasChanged = {SkillsListChanged: false};
  public skillsDataSource: ReducedSkills[];
  public skillsFiltredDataSource: ReducedSkills[];
  // predicate filter
  predicate: PredicateFormat;
  public hasAddSkillPermission: boolean;

  constructor(private skillsService: SkillsService,
              private viewRef: ViewContainerRef,
              private formModalDialogService: FormModalDialogService, private authService: AuthService) {
  }

  get IdSkills(): FormControl {
    return this.skillsForm.get(SkillsConstant.ID_SKILLS) as FormControl;
  }

  ngOnInit() {
    this.hasAddSkillPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.ADD_SKILLS);
    this.preparePredicate();
    this.initDataSource();
  }

  preparePredicate(): void {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    if (this.skillsFamilySelected && this.skillsFamilySelected.length > 0) {
      this.skillsFamilySelected.forEach(tier => {
        this.predicate.Filter.push(new Filter(SkillsConstant.ID_FAMILY, Operation.eq, tier, false, true));
      });
    }
    if (this.skillsToIgnore && this.skillsToIgnore.length > 0) {
      this.skillsToIgnore.forEach(x => {
        if (x !== this.currentSkillId) {
          this.predicate.Filter.push(new Filter(SkillsConstant.ID, Operation.neq, x));
        }
      });
    }
    this.predicate.OrderBy = new Array<OrderBy>();
    this.predicate.OrderBy.push(new OrderBy(SkillsConstant.LABEL, OrderByDirection.asc));
  }

  initDataSource(): void {
    this.skillsService.readDropdownPredicateData(this.predicate).subscribe((data: any) => {
      this.skillsDataSource = data;
      this.skillsFiltredDataSource = this.skillsDataSource.slice(0);
    });
  }

  /**
   * filter by label
   * @param value
   */
  handleFilter(value: string): void {
    this.skillsDataSource = this.skillsDataSource.filter((s) => s.Label.toLocaleLowerCase().includes(value.toLowerCase()));
  }

  addNew(): void {
    const TITLE = TranslationKeysConstant.ADD_SKILLS;
    const data = {SkillsListChanged: false};
    this.formModalDialogService.openDialog(TITLE, CompanySkillsComponent,
      this.viewRef, this.checkIfSkillsHasBeenAdded.bind(this), data, true, SharedConstant.MODAL_DIALOG_SIZE_M);
  }

  checkIfSkillsHasBeenAdded(data: any) {
    this.initDataSource();
    this.SkillsListChanged.emit(true);
  }

  /**
   * Fire Change Type Slected
   * @param $event
   */
  public skillsSelected($event) {
    this.selected.emit($event);
  }

  public getSkillsRelatedToFamily(FamilyList) {
    if (FamilyList && FamilyList.length > 0) {
      this.skillsFamilySelected = FamilyList;
    } else {
      this.skillsFamilySelected = null;
    }
    this.preparePredicate();
    this.initDataSource();
  }
}

