import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { PredicateFormat, OrderBy, OrderByDirection} from '../../utils/predicate';
import { DropDownComponent } from '../../interfaces/drop-down-component.interface';
import { FormGroup } from '@angular/forms';
import { User } from '../../../models/administration/user.model';
import { UserService } from '../../../administration/services/user/user.service';
import { ComponentsConstant } from '../../../constant/shared/components.constant';
import { RoleConfigConstant } from '../../../Structure/_roleConfigConstant';
import { ComboBoxComponent } from '@progress/kendo-angular-dropdowns';


@Component({
  selector: 'app-user-dropdown',
  templateUrl: './user-dropdown.component.html',
  styleUrls: ['./user-dropdown.component.scss']
})
export class UserDropdownComponent implements OnInit, DropDownComponent {
  @ViewChild(ComboBoxComponent) public comboboxComponent: ComboBoxComponent;
  @Input() form: FormGroup;
  @Input() allowCustom;
  @Input() idUserColName: string;
  @Input() disabled;
  @Input() isForInventory;
  @Input() isForCompany : boolean;
   public UserData: User[];
   public UserFiltredData: User[];
  public Roles =[RoleConfigConstant.InventoryConfig,RoleConfigConstant.VALIDATE.INVENTORY];
  @Output() Selected = new EventEmitter<boolean>();
  public selectedIdUser;
  constructor(private userService: UserService) { }

  ngOnInit() {
    this.initDataSource();

    if (!this.idUserColName) {
      this.idUserColName = ComponentsConstant.ID_USER;
    }
  }
  /**
   * prepare User Predicate
   * */
  prepareUserPredicate() {
    const myPredicate = new PredicateFormat();
    myPredicate.OrderBy = new Array<OrderBy>();
    myPredicate.OrderBy.push.apply(myPredicate.OrderBy,
      [new OrderBy(ComponentsConstant.FIRST_NAME, OrderByDirection.asc), new OrderBy(ComponentsConstant.LAST_NAME, OrderByDirection.asc)]);
    return myPredicate;
  }
  /**
   * init Data Source
   * */
  initDataSource(): void {
    const predicate = this.prepareUserPredicate();
    if(this.isForInventory){
      this.userService.getDataDropdownWithPredicate(predicate).subscribe(data => {
        this.UserData = data.listData;
          this.UserFiltredData = this.UserData.slice(0);
        });
    }else {
    this.userService.callPredicateData(this.prepareUserPredicate()).subscribe(data => {
    this.UserData = data;
      this.UserFiltredData = this.UserData.slice(0);
      if(this.isForCompany){
        this.UserFiltredData.forEach(element => {
          element.FirstName = element.FirstName + " " + element.LastName;
        })
      }
    });
  }
  }
  handleFilter(value: string): void {
    this.UserFiltredData = this.UserData.filter((s) =>
      (s.FirstName != null && s.FirstName.toLowerCase().includes(value.toLowerCase())) || (s.LastName && s.LastName.toLowerCase().includes(value.toLowerCase())));
  }
  addNew(): void {
    throw new Error('Method not implemented.');
  }
   /**
   *
   * @param userId
   */
    handleValueChange(userId) {
      this.selectedIdUser = userId;
      this.Selected.emit(userId);
    }
}
