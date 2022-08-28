import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {unique, ValidationService} from '../../../shared/services/validation/validation.service';
import {CityService} from '../../services/city/city.service';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import { Country } from '../../../models/administration/country.model';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {Observable} from 'rxjs/Observable';
import {City} from '../../../models/administration/city.model';
import {CityConstant} from '../../../constant/Administration/city.constant';
import {isNotNullOrUndefinedAndNotEmptyValue} from '../../../stark-permissions/utils/utils';
import {GrowlService} from '../../../../COM/Growl/growl.service';
import {Filter, Operation, PredicateFormat} from '../../../shared/utils/predicate';
import {TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs';
import {StyleConfigService} from '../../../shared/services/styleConfig/style-config.service';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';

const ACTIVE_LIST_URL = '/main/administration/city/';
const ACTIVE_EDIT_URL = 'main/administration/city/AdvancedEdit/';

@Component({
  selector: 'app-add-city',
  templateUrl: './add-city.component.html',
  styleUrls: ['./add-city.component.scss']
})

export class AddCityComponent implements OnInit, OnDestroy {
  public CITY_LIST_URL = '/main/settings/administration/city';
  public cityFormGroup: FormGroup;
  country: Country;
  private isSaveOperation = false;
  public citySaved = false;
  public city: City;
  public itemId: number;
  public hasAddCityPermission: boolean;
  public hasUpdateCityPermission: boolean;
  /*
   * Id Entity
   */
  private id: number;
  /*
   * is updateMode
   */
  public isUpdateMode: boolean;

  private citySubscription: Subscription;
  /*
   * city to update
   */
  private cityToUpdate: City;
  /*
   * id Subscription
   */
  private idSubscription: Subscription;
  activeStockManaged = false;

  /**
   * Contructor
   * @param cityService
   * @param fb
   * @param activatedRoute
   * @param router
   * @param validationService
   * @param cdRef
   * @param growlService
   * @param translate
   * @param styleConfigService
   */
  constructor(public cityService: CityService, private fb: FormBuilder,
              private activatedRoute: ActivatedRoute, private router: Router, private validationService: ValidationService,
              private cdRef: ChangeDetectorRef, private growlService: GrowlService, private translate: TranslateService,
              private authService: AuthService,
              private styleConfigService: StyleConfigService) {
    this.idSubscription = this.activatedRoute.params.subscribe(params => {
      this.id = +params['id'] || 0;
    });

  }

  public onAddCityClick() {
    if (this.cityFormGroup.valid) {
      const city: City = this.cityFormGroup.value;
      this.cityService.save(city, !this.isUpdateMode).subscribe(() => {
        this.router.navigate([CityConstant.CITY_LIST_URL]);
        this.isSaveOperation = true;
      });
    } else {
      this.validationService.validateAllFormFields(this.cityFormGroup as FormGroup);
    }
  }

  /**
   * Sent the country selected to the city
   * @param $event
   */

  receiveCountryStatus($event) {
    if (isNotNullOrUndefinedAndNotEmptyValue($event)) {
      this.cityFormGroup.value.IdCountry = $event;
    }
  }

  private createAddForm(): void {
    this.cityFormGroup = this.fb.group({
      Id: [0],
      Code: new FormControl('', {
        validators: Validators.required, asyncValidators: unique('Code', this.cityService, String(0)),
        updateOn: 'blur'
      }),
      Label: new FormControl('', Validators.required),
      IdCountry: new FormControl(undefined, Validators.required)
    });
  }

  /**
   * this method will be called by CanDeactivateGuard service to check the leaving component possibility
   */
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.isSaveOperation) {
      this.isSaveOperation = false;
      return true;
    }
    return this.validationService.handleCanDeactivateToLeaveCurrentComponent(this.isFormChanged.bind(this));
  }

  isFormChanged(): boolean {
    return this.cityFormGroup.touched;
  }

  /**
   * on init
   * */
  ngOnInit() {
    this.hasAddCityPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.ADD_CITY);
    this.hasUpdateCityPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.UPDATE_CITY);
    this.createAddForm();
    this.isUpdateMode = this.id > 0;
    if (this.isUpdateMode) {
      this.getDataToUpdate();
    }
  }

  /**
   * create add form
   * */

  private preparePredicate() {
    const predicate = new PredicateFormat();
    predicate.Filter = new Array<Filter>();
    predicate.Filter.push(new Filter(SharedConstant.ID, Operation.eq, this.id));
    return predicate;
  }

  /**
   *  get data to update
   * */
  private getDataToUpdate(): void {
    this.citySubscription = this.cityService.getModelByCondition(this.preparePredicate()).subscribe(data => {
      this.cityToUpdate = data;
      if (this.cityToUpdate) {
        this.cityFormGroup.patchValue(this.cityToUpdate);
      }
      if (!this.hasUpdateCityPermission) {
        this.cityFormGroup.disable();
      }
    });
  }

  /**
   * on destroy
   * */
  ngOnDestroy(): void {
    if (this.idSubscription) {
      this.idSubscription.unsubscribe();
    }
    if (this.citySubscription) {
      this.citySubscription.unsubscribe();
    }
  }

  /**
   * on click save
   * */
  public onAddcityClick(): void {
    if (this.cityFormGroup.valid) {
      const unicityData = {
        'property': SharedConstant.CODE,
        'value': this.cityFormGroup.controls['Code'].value,
        'valueBeforUpdate': this.id
      };
      if (!this.citySaved && !this.isUpdateMode) {
        this.cityService.save(this.cityFormGroup.value, !this.isUpdateMode, undefined, undefined, unicityData).subscribe((data) => {
          this.backToPrevious();
          this.citySaved = true;
        });
      } else if (!this.citySaved && this.isUpdateMode) {
        if (this.cityFormGroup.touched) {
          this.cityService.save(this.cityFormGroup.value, undefined, undefined, undefined, unicityData).subscribe(() => {
            this.backToPrevious();
          });
        }
      }
    } else {
      this.validationService.validateAllFormFields(this.cityFormGroup);
    }
  }


  public goToAdvancedEdit(dataItem) {
    this.router.navigateByUrl(ACTIVE_EDIT_URL.concat(dataItem.Id));
  }

  backToPrevious() {
    this.router.navigate([ACTIVE_LIST_URL]);
  }

  activateStockManaged() {
    this.activeStockManaged = !this.activeStockManaged;
    this.cityFormGroup.controls['IsStockManaged'].setValue(this.activeStockManaged);
  }


  getFooterClass(): string {
    return this.styleConfigService.getFooterClassSettingLayoutAddComponent();
  }
}
