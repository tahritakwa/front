import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs/Subscription';
import { AdministrativeDocumentConstant } from '../../../constant/payroll/administrative-document-constant';
import { MobilityRequestConstant } from '../../../constant/rh/mobility-request.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { MobilityRequestEnumerator } from '../../../models/enumerators/mobility-request.enum';
import { MobilityRequest } from '../../../models/rh/mobility-request.model';
import { EmployeeService } from '../../../payroll/services/employee/employee.service';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { UserCurrentInformationsService } from '../../../shared/services/utility/user-current-informations.service';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { Filter, Operation, PredicateFormat, Relation } from '../../../shared/utils/predicate';
import { OfficeDropdownlistComponent } from '../../components/office-dropdownlist/office-dropdownlist.component';
import { MobilityRequestService } from '../../services/mobility-request/mobility-request.service';

@Component({
  selector: 'app-add-mobility-request',
  templateUrl: './add-mobility-request.component.html',
  styleUrls: ['./add-mobility-request.component.scss']
})
export class AddMobilityRequestComponent implements OnInit {
  @ViewChild('currentOfficeDropdownListViewChild')
  currentOfficeDropdownListViewChild: OfficeDropdownlistComponent;
  @ViewChild('destinationOfficeDropdownListViewChild')
  destinationOfficeDropdownListViewChild: OfficeDropdownlistComponent;
  public mobilityRequestFormGroup: FormGroup;
  public isUpdateMode: boolean;
  public mobilityRequestToUpdate: MobilityRequest;
  public idSubscription: Subscription;
  public statusCode = MobilityRequestEnumerator;
  public destinationOfficeId: number;
  public currentOfficeId: number;
  public idEmployee: number;
  public isUserInSuperHierarchicalEmployeeList: boolean;
  public connectedEmployeeId: number;
  public formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);
  private id: number;

  constructor(public mobilityRequestService: MobilityRequestService, private fb: FormBuilder,
    private validationService: ValidationService, private router: Router,
    private swalWarrings: SwalWarring, private activatedRoute: ActivatedRoute, public employeeService: EmployeeService,
    private userCurrentInformationsService: UserCurrentInformationsService, private translate: TranslateService) {
    this.idSubscription = this.activatedRoute.params.subscribe(params => {
      this.id = +params[SharedConstant.ID_LOWERCASE] || NumberConstant.ZERO;
    });
  }

  ngOnInit() {
    this.userCurrentInformationsService.getConnectedEmployeeId().subscribe(idEmployee => {
    this.connectedEmployeeId = idEmployee;
  });
    this.isUpdateMode = this.id > NumberConstant.ZERO;
    this.isUserInSuperHierarchicalEmployeeList = true;
    if (this.isUpdateMode) {
      this.getDataToUpdate();
    }
  }

  public createFormGroup() {
    this.mobilityRequestFormGroup = this.fb.group({
      Id: [this.mobilityRequestToUpdate ? this.mobilityRequestToUpdate.Id : 0],
      IdEmployee: [this.mobilityRequestToUpdate ? this.mobilityRequestToUpdate.IdEmployee :
        undefined, [Validators.required]],
      IdCurrentOffice: [this.mobilityRequestToUpdate ? this.mobilityRequestToUpdate.IdCurrentOffice :
        undefined, [Validators.required]],
      IdDestinationOffice: [this.mobilityRequestToUpdate ? this.mobilityRequestToUpdate.IdDestinationOffice :
        undefined, [Validators.required]],
      DesiredMobilityDate: [this.mobilityRequestToUpdate ? this.mobilityRequestToUpdate.DesiredMobilityDate :
        undefined, [Validators.required]],
      Description: [this.mobilityRequestToUpdate ? this.mobilityRequestToUpdate.Description : undefined]
    });
  }

  save() {
    if (this.mobilityRequestFormGroup.valid) {
      const obj: MobilityRequest = Object.assign({}, this.mobilityRequestToUpdate, this.mobilityRequestFormGroup.getRawValue());
      this.mobilityRequestService.save(obj, !this.isUpdateMode).subscribe(data => {
        this.router.navigate([MobilityRequestConstant.MOBILITY_REQUEST_LIST_URL]);
      });
      this.isUserInSuperHierarchicalEmployeeList = true;
    } else {
      this.validationService.validateAllFormFields(this.mobilityRequestFormGroup);
    }
  }

  isToValidateByDepartureOfficeManager(): boolean {
    return this.mobilityRequestToUpdate &&
      this.mobilityRequestToUpdate.Status === this.statusCode.Draft &&
      this.mobilityRequestToUpdate.IsCurrentUserTheDepartureOfficeManager;
  }

  isToValidateByDestinationOfficeManager(): boolean {
    return this.mobilityRequestToUpdate &&
      this.mobilityRequestToUpdate.Status === this.statusCode.AcceptedByDepartureOfficeManager &&
      this.mobilityRequestToUpdate.IsCurrentUserTheDestinationOfficeManager;
  }

  currentOfficeSelected(event) {
    if (event && this.destinationOfficeDropdownListViewChild && this.currentOfficeDropdownListViewChild) {
      this.destinationOfficeDropdownListViewChild.officeToIgnore = event.Id;
      this.destinationOfficeDropdownListViewChild.initDataSource();
    }
    if (this.mobilityRequestToUpdate) {
      this.mobilityRequestToUpdate.IdCurrentOfficeNavigation = event;
    }
  }

  destinationOfficeSelected(event) {
    if (event && this.currentOfficeDropdownListViewChild && this.destinationOfficeDropdownListViewChild) {
      this.currentOfficeDropdownListViewChild.officeToIgnore = event.Id;
      this.currentOfficeDropdownListViewChild.initDataSource();
    }
    if (this.mobilityRequestToUpdate) {
      this.mobilityRequestToUpdate.IdDestinationOfficeNavigation = event;
    }
  }

  getSwalText(state): string {
    if (state === this.statusCode.AcceptedByDepartureOfficeManager) {
      return MobilityRequestConstant.VALIDATE_THE_MOBILITY_REQUEST;
    }
    if (state === this.statusCode.RefusedByDepartureOfficeManager) {
      return MobilityRequestConstant.REFUSE_THE_MOBILITY_REQUEST;
    }
    if (state === this.statusCode.AcceptedByDestinationOfficeManager) {
      return MobilityRequestConstant.VALIDATE_THE_MOBILITY_REQUEST;
    }
    if (state === this.statusCode.RefusedByDestinationOfficeManager) {
      return MobilityRequestConstant.REFUSE_THE_MOBILITY_REQUEST;
    }
  }

  checkIsCurrentUserInSuperHierarchicalEmployeeList() {
    this.employeeService.IsUserInSuperHierarchicalEmployeeList(this.mobilityRequestToUpdate.IdEmployeeNavigation).subscribe(result => {
      this.isUserInSuperHierarchicalEmployeeList = result;
      if (this.connectedEmployeeId === this.mobilityRequestToUpdate.IdEmployee) {
        this.isUserInSuperHierarchicalEmployeeList = true;
      }
      if (!this.isUserInSuperHierarchicalEmployeeList) {
        this.mobilityRequestFormGroup.disable();
      }
    });
  }

  public setRequestState(state) {
    this.swalWarrings.CreateSwal(this.getSwalText(state), null, AdministrativeDocumentConstant.OKAY).then((result) => {
      if (result.value) {
        switch (state) {
          case this.statusCode.AcceptedByDepartureOfficeManager: {
            this.mobilityRequestToUpdate.Status = MobilityRequestEnumerator.AcceptedByDepartureOfficeManager;
            break;
          }
          case this.statusCode.RefusedByDepartureOfficeManager: {
            this.mobilityRequestToUpdate.Status = MobilityRequestEnumerator.RefusedByDepartureOfficeManager;
            break;
          }
          case this.statusCode.AcceptedByDestinationOfficeManager: {
            this.mobilityRequestToUpdate.Status = MobilityRequestEnumerator.AcceptedByDestinationOfficeManager;
            break;
          }
          case this.statusCode.RefusedByDestinationOfficeManager: {
            this.mobilityRequestToUpdate.Status = MobilityRequestEnumerator.RefusedByDestinationOfficeManager;
            break;
          }
        }
        this.mobilityRequestService.mobilityRequestValidation(this.mobilityRequestToUpdate).subscribe(() => {
          this.router.navigateByUrl(MobilityRequestConstant.MOBILITY_REQUEST_LIST_URL);
        });
      }
    });
  }

  public preparePredicate() {
    const myPredicate = new PredicateFormat();
    myPredicate.Relation = new Array<Relation>();
    myPredicate.Relation.push.apply(myPredicate.Relation,
      [new Relation(MobilityRequestConstant.ID_EMPLOYEE_NAVIGATION)]);
    myPredicate.Relation.push.apply(myPredicate.Relation, [new Relation(MobilityRequestConstant.ID_CURRENT_OFFICE_NAVIGATION)]);
    myPredicate.Relation.push.apply(myPredicate.Relation, [new Relation(MobilityRequestConstant.ID_DESTINATION_OFFICE_NAVIGATION)]);
    myPredicate.Filter = new Array<Filter>();
    myPredicate.Filter.push(new Filter(MobilityRequestConstant.ID, Operation.eq, this.id));
    return myPredicate;
  }

  private getDataToUpdate() {

    this.mobilityRequestService.getById(this.id).subscribe((data: MobilityRequest) => {
      this.mobilityRequestToUpdate = data;
      this.idEmployee = this.mobilityRequestToUpdate.IdEmployee;
      if (this.mobilityRequestToUpdate) {
        this.currentOfficeSelected(this.mobilityRequestToUpdate.IdCurrentOfficeNavigation);
        this.destinationOfficeSelected(this.mobilityRequestToUpdate.IdDestinationOfficeNavigation);
        this.checkIsCurrentUserInSuperHierarchicalEmployeeList();
        this.mobilityRequestToUpdate.IdEmployeeNavigation = null;
        this.mobilityRequestToUpdate.DesiredMobilityDate = this.mobilityRequestToUpdate.DesiredMobilityDate ?
          new Date(data.DesiredMobilityDate) : this.mobilityRequestToUpdate.DesiredMobilityDate;

        this.mobilityRequestFormGroup.patchValue(this.mobilityRequestToUpdate);
        if (this.mobilityRequestToUpdate.Status !== this.statusCode.Draft) {
          this.mobilityRequestFormGroup.disable();
        }
        this.createFormGroup();
      }
    });

  }
}
