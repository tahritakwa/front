import { Component, OnInit, ComponentRef, ViewChild } from '@angular/core';
import { IModalDialogOptions, IModalDialog } from 'ngx-modal-dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalDialogInstanceService } from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import { CashRegister } from '../../../../models/treasury/cash-register.model';
import { CashRegisterService } from '../../../services/cash-register/cash-register.service';
import { ValidationService } from '../../../../shared/services/validation/validation.service';
import { Country } from '../../../../models/administration/country.model';
import { CityDropdownComponent } from '../../../../shared/components/city-dropdown/city-dropdown.component';
import { CashRegisterStatusEnumerator, CashRegisterTypeEnum } from '../../../../models/enumerators/cash-managment-hierarchy-test-data.enum';
import { CashRegisterConstant } from '../../../../constant/treasury/cash-register.constant';
import { CashRegisterDropdownComponent } from '../../../components/cash-register-dropdown/cash-register-dropdown.component';
import { ContractType } from '../../../../models/payroll/contract-type.model';
import { ActivitySectorsEnum } from '../../../../models/shared/enum/activitySectors.enum';
import { CompanyService } from '../../../../administration/services/company/company.service';

@Component({
  selector: 'app-cash-registers-add',
  templateUrl: './cash-registers-add.component.html',
  styleUrls: ['./cash-registers-add.component.scss']
})
export class CashRegistersAddComponent implements OnInit, IModalDialog {

  @ViewChild(CityDropdownComponent) childListCity: CityDropdownComponent;
  @ViewChild(CashRegisterDropdownComponent) childListCash;
  public dialogOptions: Partial<IModalDialogOptions<any>>;
  addCashRegisterFormGroup: FormGroup;
  Country: Country;
  public cashRegisterType = CashRegisterTypeEnum;
  public cashRegister: CashRegister;
  public updateMode: boolean;
  public currentCompanyActivityArea: number;

  // Enum
  activitySectorEnum = ActivitySectorsEnum;

  public agentCodeData : any [];
  public agentCodeDataFiltred: any [];
  constructor(private fb: FormBuilder, private modalDialogInstanceService: ModalDialogInstanceService,
    private cashRegisterService: CashRegisterService, private validationService: ValidationService, private companyService: CompanyService) { }

  ngOnInit() {
  }

  createAddFormGroup() {
    this.addCashRegisterFormGroup = this.fb.group({
      Id: [0],
      Code: [''],
      Name: ['', Validators.required],
      Type: [null, Validators.required],
      AgentCode:[''],
      Address : [''],
      IdResponsible: [null,Validators.required],
      IdParentCash: [{value: null, disabled: true}],
      IdCity: [null],
      IdCountry: [null],
      Status: [CashRegisterStatusEnumerator.Closed],
      IdWarehouse: [null],
    });
  }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.agentCodeData = [
      {
        text : "C1",
        code : "C1"
      },
      {
        text : "C2",
        code : "C2"
      },
      {
        text : "C3",
        code : "C3"
      }
    ];
    this.agentCodeDataFiltred = this.agentCodeData;
    this.dialogOptions = options;
    this.cashRegister = options.data;
    this.createAddFormGroup();
    if (this.cashRegister != null) {
      this.updateMode = true;
      this.receiveCountryStatus(this.cashRegister.IdCountry);
      this.addCashRegisterFormGroup.patchValue(this.cashRegister);
      this.disableForm();
    }
    this.getCurrentCompanyActivityArea();
  }

  save() {
    if (this.addCashRegisterFormGroup.valid) {
      const cashRegister: CashRegister = this.addCashRegisterFormGroup.getRawValue();
      this.cashRegisterService.save(cashRegister, !this.updateMode).subscribe(() => {
        this.cancel();
      });
    } else {
      this.validationService.validateAllFormFields(this.addCashRegisterFormGroup as FormGroup);
    }
  }

  cancel() {
    this.dialogOptions.onClose();
    this.modalDialogInstanceService.closeAnyExistingModalDialog();
  }

  /**
  * Sent the country selected to the city
  * @param $event
  */
   receiveCountryStatus($event, parentCash?: CashRegister) {
    this.Country = new Country();
    if ($event) {
      this.Country.Id = $event.Id;
    }
    this.childListCity.setCity(this.Country);
    if (this.Country.Id) {
      this.addCashRegisterFormGroup.controls.IdCity.enable();
    } else {
      this.addCashRegisterFormGroup.controls.IdCity.setValue(null);
      this.addCashRegisterFormGroup.controls.IdCity.disable();
    }
    if (parentCash && (parentCash.Type === this.cashRegisterType.Principal)) {
      this.addCashRegisterFormGroup.controls.IdCity.setValue(parentCash.IdCity);
      this.addCashRegisterFormGroup.controls.IdCity.disable();
    }
  }
  /**
  * Update the country when select the ParentCash
  * @param $event
  */
  selectParentCash($event) {
    if($event){
      this.addCashRegisterFormGroup.controls[CashRegisterConstant.ID_COUNTRY].setValue($event.IdCountry);
      this.addCashRegisterFormGroup.controls[CashRegisterConstant.ID_RESPONSIBLE].setValue($event.IdResponsible);
      this.receiveCountryStatus({Id: $event.IdCountry}, $event);
      if(this.addCashRegisterFormGroup.controls.Type.value == this.cashRegisterType.RecipeBox){
        this.addCashRegisterFormGroup.controls.IdWarehouse.setValue($event.IdWarehouse);
        this.addCashRegisterFormGroup.controls.Address.setValue($event.Address);
        this.addCashRegisterFormGroup.controls.IdWarehouse.disable();
        this.addCashRegisterFormGroup.controls.Address.disable();
      }
    }else {
      this.addCashRegisterFormGroup.controls.IdWarehouse.reset();
      this.addCashRegisterFormGroup.controls.Address.reset();
      this.addCashRegisterFormGroup.controls.IdWarehouse.enable();
      this.addCashRegisterFormGroup.controls.Address.enable();
    }
  }

  selectCashType($event) {
    this.addCashRegisterFormGroup.controls[CashRegisterConstant.ID_PARENT_CASH].setValue(null);
    this.addCashRegisterFormGroup.controls[CashRegisterConstant.ID_COUNTRY].setValue(null);
    this.addCashRegisterFormGroup.controls[CashRegisterConstant.ID_CITY].setValue(null);
    this.addCashRegisterFormGroup.controls[CashRegisterConstant.ID_CITY].disable();
    this.addCashRegisterFormGroup.controls.IdWarehouse.reset();
    this.addCashRegisterFormGroup.controls.Address.reset();
    this.addCashRegisterFormGroup.controls.IdWarehouse.enable();
    this.addCashRegisterFormGroup.controls.Address.enable();
    this.childListCity.setCity(new Country());
    if ($event) {
      switch ($event) {
        case CashRegisterTypeEnum.Central : this.setCentralType(); break;
        case CashRegisterTypeEnum.Principal : this.setPrincipalType(); break;
        case CashRegisterTypeEnum.ExpenseFund : this.setExpenseFundType(); break;
        case CashRegisterTypeEnum.RecipeBox : this.setExpenseFundType(); break;
      }
    }
  }

  /**
  * change country validators
  */
  setCountryValidators() {
    this.addCashRegisterFormGroup.controls[CashRegisterConstant.ID_COUNTRY].setValidators(null);
    this.addCashRegisterFormGroup.controls[CashRegisterConstant.ID_COUNTRY].disable();
    this.addCashRegisterFormGroup.controls[CashRegisterConstant.ID_COUNTRY].updateValueAndValidity();
  }
  /**
  * change city validators
  */
  setCityValidators() {
    this.addCashRegisterFormGroup.controls[CashRegisterConstant.ID_CITY].setValidators(null);
    this.addCashRegisterFormGroup.controls[CashRegisterConstant.ID_CITY].updateValueAndValidity();
  }

  /**
  * On select principal cash type
  */
  setPrincipalType() {
    this.childListCash.initDataSource();
    this.addCashRegisterFormGroup.controls[CashRegisterConstant.ID_PARENT_CASH].setValidators(Validators.required);
    this.addCashRegisterFormGroup.controls[CashRegisterConstant.ID_CITY].setValidators(Validators.required);
    this.cashRegisterService.getCentralCash().subscribe(data => {
      if (data != null) {
        this.addCashRegisterFormGroup.controls[CashRegisterConstant.ID_PARENT_CASH].setValue(data.Id);
        this.addCashRegisterFormGroup.controls[CashRegisterConstant.ID_COUNTRY].setValue(data.IdCountry);

        this.receiveCountryStatus({Id: data.IdCountry});
      }
      else {
        this.addCashRegisterFormGroup.controls[CashRegisterConstant.ID_PARENT_CASH].enable();
        this.addCashRegisterFormGroup.controls[CashRegisterConstant.ID_PARENT_CASH].updateValueAndValidity();
      }
    });
    this.addCashRegisterFormGroup.controls[CashRegisterConstant.ID_COUNTRY].disable();
    this.addCashRegisterFormGroup.controls[CashRegisterConstant.ID_PARENT_CASH].disable();
    this.addCashRegisterFormGroup.controls[CashRegisterConstant.ID_PARENT_CASH].updateValueAndValidity();
    this.addCashRegisterFormGroup.controls[CashRegisterConstant.ID_CITY].updateValueAndValidity();
  }

  /**
  * On select sales ir purchase cash type
  */
  setExpenseFundType() {
    this.childListCash.getPrincipalCash();
    this.addCashRegisterFormGroup.controls[CashRegisterConstant.ID_PARENT_CASH].setValidators(Validators.required);
    this.addCashRegisterFormGroup.controls[CashRegisterConstant.ID_PARENT_CASH].enable();
    this.setCountryValidators();
    this.setCityValidators();
    this.addCashRegisterFormGroup.controls[CashRegisterConstant.ID_PARENT_CASH].updateValueAndValidity();
  }

  /**
  * On select central cash type
  */
  setCentralType() {
    this.addCashRegisterFormGroup.controls[CashRegisterConstant.ID_PARENT_CASH].setValidators(null);
    this.addCashRegisterFormGroup.controls[CashRegisterConstant.ID_PARENT_CASH].disable();
    this.addCashRegisterFormGroup.controls[CashRegisterConstant.ID_COUNTRY].setValidators(Validators.required);
    this.addCashRegisterFormGroup.controls[CashRegisterConstant.ID_COUNTRY].enable();
    this.setCityValidators();
    this.addCashRegisterFormGroup.controls[CashRegisterConstant.ID_PARENT_CASH].updateValueAndValidity();
    this.addCashRegisterFormGroup.controls[CashRegisterConstant.ID_COUNTRY].updateValueAndValidity();
  }
  disableForm() {
    this.addCashRegisterFormGroup.controls[CashRegisterConstant.TYPE].disable();
    this.addCashRegisterFormGroup.controls[CashRegisterConstant.ID_PARENT_CASH].disable();
    this.addCashRegisterFormGroup.controls[CashRegisterConstant.ID_COUNTRY].disable();
    this.addCashRegisterFormGroup.controls[CashRegisterConstant.ID_CITY].disable();
    if(this.addCashRegisterFormGroup.controls.Type.value == this.cashRegisterType.RecipeBox){
      this.addCashRegisterFormGroup.controls.IdWarehouse.disable();
      this.addCashRegisterFormGroup.controls.Address.disable();
    }
  }

  getCurrentCompanyActivityArea(){
    this.companyService.getCurrentCompanyActivityArea().subscribe(x => {
      this.currentCompanyActivityArea = x;
      if(this.currentCompanyActivityArea === this.activitySectorEnum.PAYMENT_INSTITUTION){
        this.addCashRegisterFormGroup.controls.AgentCode.setValidators(Validators.required);
      } else {
        this.addCashRegisterFormGroup.controls.IdWarehouse.setValidators(Validators.required);
      }
    });
  }
  public handleFiltreAgentCode(value) {
    this.agentCodeData = this.agentCodeDataFiltred.filter(o => o.text.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }
}
