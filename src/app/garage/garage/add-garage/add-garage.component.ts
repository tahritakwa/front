import { Component, OnInit, ViewChild, ViewContainerRef, TemplateRef, ViewChildren, QueryList } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { GarageConstant } from '../../../constant/garage/garage.constant';
import { AddPostComponent } from '../../components/add-post/add-post.component';
import { Router, ActivatedRoute } from '@angular/router';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { GarageService } from '../../services/garage/garage.service';
import { Observable } from 'rxjs/Observable';
import { CityDropdownComponent } from '../../../shared/components/city-dropdown/city-dropdown.component';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { Country } from '../../../models/administration/country.model';
import { PhoneConstants } from '../../../constant/purchase/phone.constant';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';

@Component({
  selector: 'app-add-garage',
  templateUrl: './add-garage.component.html',
  styleUrls: ['./add-garage.component.scss']
})
export class AddGarageComponent implements OnInit {

  @ViewChild(CityDropdownComponent) childListCity;
  @ViewChildren(AddPostComponent) postesList: QueryList<AddPostComponent>;
  @ViewChild('vc', { read: ViewContainerRef }) viewContainer: ViewContainerRef;
  @ViewChild('addPost', { read: TemplateRef }) template: TemplateRef<null>;
  /**
   * Form Group
   */
  garageFormGroup: FormGroup;

  /**
   * is updateMode
   */
  public id;
  garageToUpdate: any = {};
  isUpdateMode = false;
  workersAssociated: any[] = [];
  machineSelected: any[] = [];
  Country: Country;

  private saveDone = false;

  // Phone Info Properties
  public garagePhoneHasError = false;
  public defaultPhoneCountryTn = PhoneConstants.DEFAULT_COUNTRY_TN;
  public defaultPhoneCountryFr = PhoneConstants.DEFAULT_COUNTRY_FR;
  public defaultPhoneCountryGb = PhoneConstants.DEFAULT_COUNTRY_GB;
  /**
    * default dial code
    */
  public dialCode: string = PhoneConstants.DEFAULT_DIAL_CODE_COUNTRY_TN;
  /*
 default country code
  */
  public countryCode: string = PhoneConstants.DEFAULT_COUNTRY_TN;

  garagePhone: any;
  // Permission Parameters
  public hasAddPermission: boolean;
  public hasUpdatePermission: boolean;

  constructor(private formBuilder: FormBuilder,
    private validationService: ValidationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private garageService: GarageService) {
    this.activatedRoute.paramMap.subscribe(params => {
      this.id = Number.parseInt(params.get(GarageConstant.ID));
    });
    this.isUpdateMode = this.id > 0;
    if (this.id !== NumberConstant.ZERO) {
      this.garagePhone = this.activatedRoute.snapshot.data['garagePhone'];
    }
  }

  ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.SettingsGaragePermissions.ADD_GARAGE);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.SettingsGaragePermissions.UPDATE_GARAGE);
    this.createAddForm();
    if (this.isUpdateMode) {
      this.garageService.getById(this.id).subscribe((data) => {
        this.garageToUpdate = data;
        if (!this.hasUpdatePermission) {
          this.garageFormGroup.disable();
        }
        this.createAddForm(this.garageToUpdate);
        if (this.childListCity) {
          this.childListCity.setCityData(this.garageToUpdate.IdCountry);
        }
        // Set Workers List
        this.workersAssociated = this.garageToUpdate.Worker ? this.garageToUpdate.Worker : [];
        // Set Post List
        if (this.garageToUpdate.Post) {
          this.garageToUpdate.Post.forEach(
            post => {
              this.cloneNewPostTemplate(post);
              if (post.Machine) {
                post.Machine.forEach(machine => {
                  this.machineSelected.push(machine);
                });
              }
            }
          );
        }
      });
    }
  }
  /**
   * save garage
   */
  save() {
    if (this.garageFormGroup.valid) {
      this.garageToUpdate = Object.assign({}, this.garageToUpdate, this.garageFormGroup.getRawValue());
      const posts = [];
      this.postesList.forEach(posteComponent => {
        posts.push(posteComponent.getData());
      });
      this.garageToUpdate.Post = posts;
      this.garageToUpdate.Worker = this.workersAssociated;
      this.garageService.save(this.garageToUpdate, !this.isUpdateMode).subscribe(() => {
        this.saveDone = true;
        this.router.navigateByUrl(GarageConstant.NAVIGATE_TO_GARAGE_LIST);
      });
    } else {
      this.validationService.validateAllFormFields(this.garageFormGroup);
    }

  }
  /**
     * Redirected to list
    */
  goBackToList() {
    this.router.navigateByUrl(GarageConstant.NAVIGATE_TO_GARAGE_LIST);
  }
  /**
   * Create garage add form
  */
  private createAddForm(dataItem?): void {
    this.garageFormGroup = this.formBuilder.group({
      Id: [dataItem ? dataItem.Id : 0],
      Name: [dataItem ? dataItem.Name : '', [Validators.required, Validators.maxLength(NumberConstant.FIFTY)]],
      IdResponsible: [dataItem ? dataItem.IdResponsible : '', Validators.required],
      Address: [dataItem ? dataItem.Address : '', [Validators.maxLength(NumberConstant.TWO_HUNDRED_FIFTY_FIVE)]],
      IdCity: [dataItem ? dataItem.IdCity : undefined, Validators.required],
      IdCountry: [dataItem ? dataItem.IdCountry : undefined, Validators.required],
      IdWarehouse: [dataItem ? dataItem.IdWarehouse : undefined, Validators.required],
      IdPhone: [dataItem ? dataItem.IdPhone : undefined],
      IdPhoneNavigation: this.buildIdPhoneNavigation(dataItem ? dataItem.IdPhoneNavigation : null),
    });
  }

  private buildIdPhoneNavigation(phone?) {
    return this.formBuilder.group({
      Id: [NumberConstant.ZERO],
      Number: [phone ? phone.Number : null],
      DialCode: [phone ? phone.DialCode : this.dialCode],
      CountryCode: [phone ? phone.CountryCode : this.countryCode],
      IsDeleted: [false]
    });
  }
  get IdPhoneNavigation(): FormControl {
    return this.garageFormGroup.get(GarageConstant.ID_PHONE_NAVIGATION) as FormControl;
  }

  get IdPhone(): FormControl {
    return this.garageFormGroup.get(GarageConstant.ID_PHONE) as FormControl;
  }

  isValidPhone(isValidPhone) {
    if (isValidPhone || isNullOrEmptyString(this.IdPhoneNavigation.value.Number)) {
      this.garagePhoneHasError = false;
      this.IdPhoneNavigation.setErrors(null);
      this.IdPhoneNavigation.markAsUntouched();
    } else {
      this.garagePhoneHasError = true;
      this.IdPhoneNavigation.setErrors({'wrongPattern': Validators.pattern});
      this.IdPhoneNavigation.markAsTouched();
    }
  }

  onCountryPhoneChange(phoneInformation) {
    this.IdPhoneNavigation.get(PhoneConstants.PHONE_DIAL_CODE).setValue(phoneInformation.dialCode);
    this.IdPhoneNavigation.get(PhoneConstants.PHONE_COUNTRY_CODE).setValue(phoneInformation.iso2);
  }

  loadPhoneCountryFlag() {
    if (this.garagePhone && this.garagePhone.IdPhoneNavigation) {
      return this.garagePhone.IdPhoneNavigation.CountryCode.toString().trim();
    }
  }

  /**
  * Sent the country selected to the city
  * @param $event
  */
  receiveCountryStatus($event) {
    this.Country = new Country();
    if ($event) {
      this.Country.Id = $event.Id;
    }
    this.childListCity.setCity(this.Country);
    if (this.Country.Id) {
      this.garageFormGroup.controls.IdCity.enable();
    } else {
      this.garageFormGroup.controls.IdCity.setValue(null);
      this.garageFormGroup.controls.IdCity.disable();
    }
  }

  removePostFromContainer(viewIndex) {
    // remove the view
    if (viewIndex) {
      // find the index of the view from a reference
      const position = this.viewContainer.indexOf(viewIndex);
      // remove the view from container
      this.viewContainer.remove(position);
    }
  }

  machineAdded($event) {
    if (this.machineSelected.findIndex(x => x.Id === $event.Id) < 0) {
      this.machineSelected.push($event);
    }
  }

  machineRemoved($event) {
    const index = this.machineSelected.findIndex(x => x.Id === $event.Id);
    this.machineSelected.splice(index, NumberConstant.ONE);
  }

  cloneNewPostTemplate(data?) {
    const componentRef = this.viewContainer.createEmbeddedView(this.template, { option: { idGarage: {}, data: {}, viewReference: {} } });
    // set the input of the new component by passing data in options
    componentRef.context.option.viewReference = componentRef;
    componentRef.context.option.idGarage = this.id ? this.id : 0;
    if (data) {
      componentRef.context.option.data = data;
    }
  }

  /**
    * this method will be called by CanDeactivateGuard service to check the leaving component possibility
    */
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.validationService.handleCanDeactivateToLeaveCurrentComponent(() => !this.saveDone && this.garageFormGroup.dirty);
  }


}
