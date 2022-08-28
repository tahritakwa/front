import {FormBuilder, FormGroup, FormControl} from '@angular/forms';
import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Role} from '../../../models/administration/role.model';
import {RoleService} from '../../../administration/services/role/role.service';
import { RoleJavaService } from '../../../administration/services/role/role.java.service';
import { UserCurrentInformationsService } from '../../services/utility/user-current-informations.service';
import {LocalStorageService} from '../../../login/Authentification/services/local-storage-service';

const USER_ROLE = 'MasterRoleUser';

@Component({
  selector: 'app-multiselect-dropdown',
  templateUrl: './multiselect-dropdown.component.html',
  styleUrls: ['./multiselect-dropdown.component.scss']
})
export class MultiselectDropdownComponent implements OnInit {
  @Input() myForm: FormGroup;
  @Input() listOfInputs = [];
  @Input() isDisabled: boolean;
  @Input() placeholder: string;
  @Input() limitSelection: number;
  @Input() selectedIdItems;

  @Output() selectedNames: EventEmitter<any> = new EventEmitter<any>();

  public roleDataSource: Role[];
  public roleFiltredDataSource: Role[];
  public ShowFilter = false;
  public dropdownSettings: any = {};
  public selectedItems = [];
  lastConnectedCompanyCode = this.localStorageService.getCompanyCode();
  constructor(private localStorageService : LocalStorageService, private translate: TranslateService,
              public roleService: RoleService,private roleJavaService: RoleJavaService) {
  }

  ngOnInit() {
    this.initRolesDataSource();
    this.placeholder = `${this.translate.instant(this.placeholder)}`;
  }

  initRolesDataSource(): void {
    this.roleJavaService.getJavaGenericService()
    .getEntityList(`roles?companyCode=${this.lastConnectedCompanyCode}`).subscribe((allRoles: Array<Role>) => {

      this.roleDataSource = allRoles;
      this.roleFiltredDataSource = this.roleDataSource.slice(0);
      this.listOfInputs = this.roleFiltredDataSource;
      this.selectedItems = this.roleFiltredDataSource;
      this.selectedItems = this.selectedItems.filter(item => this.selectedIdItems.find(element => element === item.Id));
      this.dropdownSettings = {
        singleSelection: false,
        idField: 'Id',
        textField: 'Label',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: this.limitSelection ? this.limitSelection : 3,
        allowSearchFilter: this.ShowFilter
      };
    });
  }

  get MasterRoleUser(): FormControl {
    return <FormControl>this.myForm.get(USER_ROLE);
  }

  onItemSelect(item: any) {
  }

  onSelectAll(items: any) {
  }

  toogleShowFilter() {
    this.ShowFilter = !this.ShowFilter;
    this.dropdownSettings = Object.assign({}, this.dropdownSettings, {allowSearchFilter: this.ShowFilter});
  }

  handleLimitSelection() {
    if (this.limitSelection) {
      this.dropdownSettings = Object.assign({}, this.dropdownSettings, {limitSelection: this.limitSelection});
    } else {
      this.dropdownSettings = Object.assign({}, this.dropdownSettings, {limitSelection: null});
    }
  }
}
