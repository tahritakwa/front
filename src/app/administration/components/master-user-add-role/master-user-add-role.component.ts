import { Component, OnInit, ComponentRef } from '@angular/core';
import { IModalDialogOptions, IModalDialog } from 'ngx-modal-dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MasterRoleUser } from '../../../models/administration/user-role.model';
import { UserConstant } from '../../../constant/Administration/user.constant';
import { Subject } from 'rxjs/Subject';
import { UserService } from '../../services/user/user.service';
import { User } from '../../../models/administration/user.model';
import { CompanyService } from '../../services/company/company.service';
import { UserCompany } from '../../../models/administration/user-company.model';
import { ModalDialogInstanceService } from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { SharedConstant } from '../../../constant/shared/shared.constant';

@Component({
  selector: 'app-master-user-add-role',
  templateUrl: './master-user-add-role.component.html',
  styleUrls: ['./master-user-add-role.component.scss']
})
export class MasterUserAddRoleComponent implements OnInit {
  public isModal: boolean;
  options: Partial<IModalDialogOptions<any>>;
  public data: any;
  userRoleFormGroup: FormGroup;
  public closeDialogSubject: Subject<any>;
  public company: UserCompany;
  public isUpdateMode: boolean;

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.isModal = true;
    this.options = options;
    this.data = options.data;
    this.closeDialogSubject = options.closeDialogSubject;
  }
  constructor(private fb: FormBuilder, private modalService: ModalDialogInstanceService, private swalWarrings: SwalWarring,
    private userService: UserService, private companyService: CompanyService, private validationService: ValidationService) { }

  ngOnInit() {
    this.buildUserRole(this.data.MasterRoleUser);
    this.createAddForm(this.data);
    this.companyService.getCurrentCompany().subscribe(data => {
      this.company = data;
    });
  }

  private createAddForm(user?: User): void {
    this.userRoleFormGroup = this.fb.group({
      Id: [0],
      FirstName: [user.FirstName ? user.FirstName : ''],
      LastName: [user.LastName ? user.LastName : ''],
      MasterRoleUser: ['', Validators.required],
      IdEmployee: ['']
    });
  }

  setUserRole(): MasterRoleUser[] {
    const listOfUserRole = new Array<MasterRoleUser>();
      const userRole = new MasterRoleUser();
      userRole.IdRole = this.userRoleFormGroup.controls[UserConstant.MASTER_ROLEUSER].value;
      listOfUserRole.push(userRole);
    return listOfUserRole;
  }

  buildUserRole(data): number[] {
    const userRole = [];
    if (data) {
      data.forEach(element => {
        userRole.push(element.IdRole);
      });
    }
    return userRole;
  }

  save() {
    if (this.userRoleFormGroup.valid) {
      if (this.IdEmployee.value === 0 || this.IdEmployee.value === null ||
        this.IdEmployee.value === undefined || this.IdEmployee.value === '') {
              this.insertUser();
      } else {
        this.data.IdEmployee = this.IdEmployee.value;
        this.insertUser();
      }
    } else {
      this.validationService.validateAllFormFields(this.userRoleFormGroup);
    }
  }

  /**
   * send data to be inserted in DB and close modal
   */
  insertUser() {
    this.data.MasterRoleUser = this.setUserRole();
    this.userService.InsertUserInThisCompany(this.data).subscribe(() => {
      this.ngOnInit();
      this.options.onClose();
      this.modalService.closeAnyExistingModalDialog();
    });
  }

  /**
   * Id employee getter
   */
  get IdEmployee(): FormControl {
    return this.userRoleFormGroup.get(UserConstant.IDEMPLOYEE) as FormControl;
  }
}
