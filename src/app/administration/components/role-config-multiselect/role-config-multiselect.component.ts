import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PredicateFormat, Filter, Relation, Operation } from '../../../shared/utils/predicate';
import { DropDownComponent } from '../../../shared/interfaces/drop-down-component.interface';
import { RoleConfig } from '../../../models/administration/role-config.model';
import { RoleConfigService } from '../../services/role-config/role-config.service';

const COUNT = 'Count';
const GET_PREDICATE = 'getDataDropdownWithPredicate';
const ID = 'Id';
const USER_ROLE_CONFIG = 'UserRoleConfig';
@Component({
  selector: 'app-role-config-multiselect',
  templateUrl: './role-config-multiselect.component.html',
  styleUrls: ['./role-config-multiselect.component.scss']
})
export class RoleConfigMultiselectComponent implements OnInit, DropDownComponent {
  @Input() form: FormGroup;
  @Input() parent: FormGroup;

  @Input() disabled: boolean;
  @Input() SelectedValues: number[];
  public roleConfigDataSource: RoleConfig[];
  public roleConfigFiltredDataSource: RoleConfig[];
  public listOfAllroleConfigDataSource: RoleConfig[];
  predicate: PredicateFormat;
  @Output() Selected = new EventEmitter<boolean>();
  @Output() Focused = new EventEmitter<boolean>();
  @Input() isDisabled: boolean;
  public selectedValues: number[];

  constructor(private roleConfigService: RoleConfigService) {
  }

  preparePredicate(IdRoleConfig?: any[]) {

    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Relation = new Array<Relation>();
  }

  ngOnInit() {
    this.initDataSource();
  }

  initDataSource(): void {
    this.roleConfigService.list().subscribe(data => {
      this.roleConfigDataSource = data;
      this.roleConfigFiltredDataSource = this.roleConfigDataSource.slice(0);
    });
  }

  get IdRoleConfig(): FormControl {
    return this.form.get('UserRoleConfig') as FormControl;
  }

  /**
   * filter by code taxe and label
   * @param value
   */
  handleFilter(value: string): void {
    this.roleConfigFiltredDataSource = this.roleConfigDataSource.filter((s) =>
      s.Code.toLowerCase().includes(value.toLowerCase()));
  }
  addNew(): void {
    throw new Error('Method not implemented.');
  }

  get UserRoleConfig(): FormControl {
    return <FormControl>this.form.get(USER_ROLE_CONFIG);
  }
  onSelectRoleConfig($event) {
    this.Selected.emit($event);
  }
  onFocusRoleConfig(event): void {
    this.Focused.emit(event);
  }
}
