import {AfterViewInit, Component, ComponentRef, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {IModalDialog, IModalDialogOptions} from 'ngx-modal-dialog';
import {Subject} from 'rxjs/Subject';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {OfferConstant} from '../../../constant/rh/offer.constant';
import {
  companyCurrencyPrecision,
  dateValueGT,
  dateValueLT,
  lowerOrEqualThan,
  ValidationService
} from '../../../shared/services/validation/validation.service';
import {Offer} from '../../../models/rh/offer.model';
import {OfferService} from '../../services/offer/offer.service';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {Advantages} from '../../../models/rh/advantages.model';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {Observable} from 'rxjs/Observable';
import {ModalDialogInstanceService} from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import {OfferBenefitInKind} from '../../../models/rh/offer-benefit-in-kind.model';
import {ContractConstant} from '../../../constant/payroll/Contract.constant';
import {BonusConstant} from '../../../constant/payroll/bonus.constant';
import {OfferState} from '../../../models/enumerators/offer-state.enum';
import {OfferBonus} from '../../../models/rh/offerBonus.model';
import {UtilityService} from '../../../shared/services/utility/utility.service';

@Component({
  selector: 'app-add-offer',
  templateUrl: './add-offer.component.html',
  styleUrls: ['./add-offer.component.scss']
})
export class AddOfferComponent implements OnInit, AfterViewInit {
  matDialogReference: ComponentRef<IModalDialog>;
  isModal: boolean;
  options: Partial<IModalDialogOptions<any>>;
  data: any;
  closeDialogSubject: Subject<any>;
  idCandidacy: number;
  offerFormGroup: FormGroup;
  offerToUpdate: Offer;
  isUpdateMode: boolean;
  mealVoucherShow = false;
  commissionShow = false;
  commissionTypeValue: number;
  firstDayOfCurrentMonth = new Date();
  canUpdate = true;
  advantagesFormGroup: FormGroup;
  offerState = OfferState;
  currentDate = new Date();
  required = false;
  hasEndDate: boolean;
  @ViewChild('bonusNav', {read: ElementRef}) public bonusNav: ElementRef;
  @ViewChild('benefitNav', {read: ElementRef}) public benefitNav: ElementRef;
  @ViewChild('otherNav', {read: ElementRef}) public otherNav: ElementRef;
  @ViewChild('bonusDiv', {read: ElementRef}) public bonusDiv: ElementRef;
  @ViewChild('benefitDiv', {read: ElementRef}) public benefitDiv: ElementRef;
  @ViewChild('otherDiv', {read: ElementRef}) public otherDiv: ElementRef;

  constructor(private formBuilder: FormBuilder,
              private modalService: ModalDialogInstanceService, private validationService: ValidationService, private offerService: OfferService,
              private utilityService: UtilityService, private renderer: Renderer2) {
  }

  get Id(): FormControl {
    return this.offerFormGroup.get(SharedConstant.ID) as FormControl;
  }

  get IdSalaryStructure(): FormControl {
    return this.offerFormGroup.get(OfferConstant.ID_SALARY_STRUCTURE) as FormControl;
  }

  get WorkingHoursPerWeek(): FormControl {
    return this.offerFormGroup.get(OfferConstant.WORKING_HOURS_PER_WEEK) as FormControl;
  }

  get StartDate(): FormControl {
    return this.offerFormGroup.get(OfferConstant.START_DATE) as FormControl;
  }

  get EndDate(): FormControl {
    return this.offerFormGroup.get(OfferConstant.END_DATE) as FormControl;
  }

  get Salary(): FormControl {
    return this.offerFormGroup.get(OfferConstant.SALARY) as FormControl;
  }

  get AvailableMealVoucher(): FormControl {
    return this.advantagesFormGroup.get(OfferConstant.AVAILABLE_MEAL_VOUCHER) as FormControl;
  }

  get MealVoucher(): FormControl {
    return this.advantagesFormGroup.get(OfferConstant.MEAL_VOUCHER_VALUE) as FormControl;
  }

  get ThirteenthMonthBonus(): FormControl {
    return this.advantagesFormGroup.get(OfferConstant.THIRTEENTH_MONTH_BONUS) as FormControl;
  }

  get AvailableCar(): FormControl {
    return this.advantagesFormGroup.get(OfferConstant.AVAILABLE_CAR) as FormControl;
  }

  get AvailableHouse(): FormControl {
    return this.advantagesFormGroup.get(OfferConstant.AVAILABLE_CAR) as FormControl;
  }

  get Commission(): FormControl {
    return this.advantagesFormGroup.get(OfferConstant.COMMISSION) as FormControl;
  }

  get CommissionType(): FormControl {
    return this.advantagesFormGroup.get(OfferConstant.COMMISSION_TYPE) as FormControl;
  }

  get CommissionValue(): FormControl {
    return this.advantagesFormGroup.get(OfferConstant.COMMISSION_VALUE) as FormControl;
  }

  get IdCnss(): FormControl {
    return this.offerFormGroup.get(OfferConstant.ID_CNSS) as FormControl;
  }

  get Advantages(): FormArray {
    return this.advantagesFormGroup.get(OfferConstant.ADVANTAGES) as FormArray;
  }

  get OfferBenefitInKind(): FormArray {
    return this.offerFormGroup.get(OfferConstant.OFFER_BENEFIT_IN_KIND) as FormArray;
  }

  get OfferBonus(): FormArray {
    return this.offerFormGroup.get(OfferConstant.OFFER_BONUS) as FormArray;
  }

  ngOnInit() {
    this.createAddForm(this.offerToUpdate);
    if (this.isUpdateMode) {
      this.setAdvantagesOfTheCurrentOffer(this.offerToUpdate);
      this.setOfferBenefitInKind(this.offerToUpdate);
      this.setOfferBonus(this.offerToUpdate);
      if (!this.canUpdate) {
        this.offerFormGroup.disable();
        this.advantagesFormGroup.disable();
      }
    }
  }

  ngAfterViewInit() {
    // Set bonus section class
    this.renderer.setAttribute(this.bonusNav.nativeElement, 'aria-selected', 'true');
    this.renderer.setAttribute(this.bonusNav.nativeElement, 'class', 'nav-link active show');
    this.renderer.setAttribute(this.bonusDiv.nativeElement, 'class', 'tab-pane active show');
    // Set benefit in kind section class
    this.renderer.setAttribute(this.benefitNav.nativeElement, 'aria-selected', 'false');
    this.renderer.setAttribute(this.benefitNav.nativeElement, 'class', 'nav-link');
    this.renderer.setAttribute(this.benefitDiv.nativeElement, 'class', 'tab-pane');
    // Set other advantages class
    this.renderer.setAttribute(this.otherNav.nativeElement, 'aria-selected', 'false');
    this.renderer.setAttribute(this.otherNav.nativeElement, 'class', 'nav-link');
    this.renderer.setAttribute(this.otherDiv.nativeElement, 'class', 'tab-pane');
  }

  createAddForm(offer?: Offer) {
    this.offerFormGroup = this.formBuilder.group({
      Id: [offer ? offer.Id : NumberConstant.ZERO],
      IdSalaryStructure: [offer ? offer.IdSalaryStructure : '', Validators.required],
      WorkingHoursPerWeek: [offer ? offer.WorkingHoursPerWeek : '', [Validators.required,
        Validators.min(NumberConstant.ONE), Validators.max(NumberConstant.HUNDRED_SEVENTY_EIGHT)]],
      StartDate: [offer ? new Date(offer.StartDate) : ''],
      EndDate: [offer && offer.EndDate ? new Date(offer.EndDate) : ''],
      Salary: [offer ? offer.Salary : '', [Validators.required,
        Validators.min(NumberConstant.ONE), Validators.max(Number.MAX_VALUE)], companyCurrencyPrecision(this.offerService)],
      IdCnss: [offer ? offer.IdCnss : '', Validators.required],
      IdCandidacy: [this.idCandidacy ? this.idCandidacy : ''],
      IdContractType: [offer ? offer.IdContractType : '', [Validators.required]],
      OfferBenefitInKind: this.formBuilder.array([]),
      OfferBonus: this.formBuilder.array([])
    });
    this.advantagesFormGroup = this.formBuilder.group({
      ThirteenthMonthBonus: [offer && offer.ThirteenthMonthBonus ? offer.ThirteenthMonthBonus : ''],
      AvailableMealVoucher: [offer && offer.MealVoucher ? true : ''],
      MealVoucher: [offer && offer.MealVoucher ? offer.MealVoucher : '',
        this.validationService.conditionalValidator((() => this.mealVoucherShow),
          Validators.compose([
            Validators.required,
            Validators.min(NumberConstant.ONE)
          ])
        ), companyCurrencyPrecision(this.offerService)],
      AvailableCar: [offer && offer.AvailableCar ? offer.AvailableCar : ''],
      AvailableHouse: [offer && offer.AvailableHouse ? offer.AvailableHouse : ''],
      Commission: [offer && offer.CommissionType ? true : ''],
      CommissionType: [offer && offer.CommissionType ? offer.CommissionType : '',
        this.validationService.conditionalValidator((() => this.commissionShow), Validators.required)],
      CommissionValue: [offer && offer.CommissionValue ? offer.CommissionValue : '',
        this.validationService.conditionalValidator((() => this.commissionShow),
          Validators.compose([
            Validators.required,
            Validators.min(NumberConstant.ONE)
          ])
        ), companyCurrencyPrecision(this.offerService)],
      Advantages: this.formBuilder.array([])
    });
    this.addDependentDateControls();
  }

  save() {
    if (this.offerFormGroup.valid && this.advantagesFormGroup.valid) {
      let offerAssign: Offer = Object.assign({}, this.offerToUpdate, this.offerFormGroup.getRawValue());
      offerAssign = Object.assign({}, offerAssign, this.advantagesFormGroup.getRawValue());
      this.offerService.save(offerAssign, !this.isUpdateMode).subscribe((result) => {
        this.options.data = result;
        this.options.onClose();
        this.modalService.closeAnyExistingModalDialog();
      });
    } else {
      this.validationService.validateAllFormFields(this.offerFormGroup);
      this.validationService.validateAllFormFields(this.advantagesFormGroup);
    }
  }

  /**
   * Init dialog
   * @param matDialogReference
   * @param options
   */
  dialogInit(matDialogReference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.isModal = true;
    this.options = options;
    this.data = options.data;
    if (this.data.State === OfferState.Accepted || this.data.State === OfferState.Rejected) {
      this.canUpdate = false;
    }
    this.closeDialogSubject = options.closeDialogSubject;
    this.prepareForm();
  }

  setCommissionValue() {
    this.CommissionValue.setValidators([
      Validators.required,
      Validators.min(NumberConstant.ONE),
      lowerOrEqualThan(new Observable(o => o.next(this.commissionTypeValue === NumberConstant.ONE ?
        NumberConstant.ONE_HUNDRED : NumberConstant.ONE_MILLION)))
    ]);
    if (this.commissionTypeValue !== NumberConstant.ONE) {
      this.CommissionValue.setAsyncValidators(companyCurrencyPrecision(this.offerService));
    } else {
      this.CommissionValue.clearAsyncValidators();
    }
    this.CommissionValue.markAsTouched();
    this.CommissionValue.updateValueAndValidity();
  }

  /**
   * Function call if the mealVoucher checkedbox change
   * @param $event
   */
  mealVoucherSelectedFunction($event) {
    this.mealVoucherShow = $event.target.checked;
    if (!this.mealVoucherShow) {
      this.MealVoucher.patchValue('');
    }
  }

  /**
   * Function call if the commission checkedbox change
   * @param $event
   */
  commissionSelectedFunction($event) {
    this.commissionShow = $event.target.checked;
    if (!this.commissionShow) {
      this.CommissionType.patchValue('');
      this.CommissionValue.patchValue('');
      this.CommissionValue.clearValidators();
      this.CommissionValue.clearAsyncValidators();
      this.CommissionValue.setErrors(null);
    }
  }

  /**
   * Function call if the commisionType dropdown change
   * @param $event
   */
  commisionTypeChange($event: number) {
    this.commissionTypeValue = $event;
    this.setCommissionValue();
  }

  /**
   * Add the formArray for other advantages
   */
  addOtherAdvantages() {
    this.Advantages.push(this.buildAdvantagesForm());
  }

  /**
   * Build formArray for other addvantages
   * @param advantages
   */
  public buildAdvantagesForm(advantages?: Advantages): FormGroup {
    return this.formBuilder.group({
      Id: [advantages ? advantages.Id : NumberConstant.ZERO],
      Description: [advantages ? advantages.Description : '', [Validators.required]],
      IdOffer: [advantages ? advantages.IdOffer : NumberConstant.ZERO],
      IsDeleted: [false]
    });
  }

  /**
   * Show advantages wich is not delected
   * @param index
   */
  isOtherAdvantabesRowVisible(index: number): boolean {
    return !this.Advantages.at(index).get(SharedConstant.IS_DELETED).value;
  }

  /**
   * Method call in update mode to show other advantages
   * @param offer
   */
  public setAdvantagesOfTheCurrentOffer(offer: Offer) {
    if (offer.Advantages) {
      offer.Advantages.forEach(advantage => {
        this.Advantages.push(this.buildAdvantagesForm(advantage));
      });
    }
  }

  deleteOtherAdvantages(index: number) {
    if (this.Advantages.at(index).get(SharedConstant.ID).value === NumberConstant.ZERO) {
      this.Advantages.removeAt(index);
    } else {
      this.Advantages.at(index).get(SharedConstant.IS_DELETED).setValue(true);
      this.Advantages.at(index).get(OfferConstant.DESCRIPTION).clearValidators();
      this.Advantages.at(index).get(OfferConstant.DESCRIPTION).updateValueAndValidity();
    }
  }

  public updateStartDateValidity(x ?: any) {
    this.StartDate.updateValueAndValidity();
  }

  public updateEndDateValidity(x ?: any) {
    this.EndDate.updateValueAndValidity();
  }

  /**
   * Add the formArray for other advantages
   */
  addOfferBenefitInKind() {
    this.OfferBenefitInKind.push(this.buildOfferBenefitInKindForm());
  }

  /**
   * Build formArray for other addvantages
   * @param advantages
   */
  public buildOfferBenefitInKindForm(offerBenefitInKind?: OfferBenefitInKind): FormGroup {
    const offerBenefitInKindFormGroup = this.formBuilder.group({
      Id: [offerBenefitInKind ? offerBenefitInKind.Id : NumberConstant.ZERO],
      IdBenefitInKind: [offerBenefitInKind ? offerBenefitInKind.IdBenefitInKind : '', [Validators.required]],
      Value: [offerBenefitInKind ? offerBenefitInKind.Value : '',
        [Validators.required, Validators.min(NumberConstant.ZERO), Validators.max(NumberConstant.ONE_MILLION)],
        companyCurrencyPrecision(this.offerService)],
      ValidityStartDate: [offerBenefitInKind ? new Date(offerBenefitInKind.ValidityStartDate) :
        this.StartDate.value ? new Date(this.StartDate.value) : this.firstDayOfCurrentMonth, [Validators.required]],
      ValidityEndDate: [offerBenefitInKind && offerBenefitInKind.ValidityEndDate ? new Date(offerBenefitInKind.ValidityEndDate) : null],
      IsDeleted: [false]
    });
    return offerBenefitInKindFormGroup;
  }

  /**
   * Show advantages wich is not delected
   * @param index
   */
  isOfferBenefitInKindRowVisible(index: number): boolean {
    return !this.OfferBenefitInKind.at(index).get(SharedConstant.IS_DELETED).value;
  }

  /**
   * Method call in update mode to show other advantages
   * @param offer
   */
  public setOfferBenefitInKind(offer: Offer) {
    if (offer.OfferBenefitInKind) {
      offer.OfferBenefitInKind.forEach(offerBenefitInKind => {
        this.OfferBenefitInKind.push(this.buildOfferBenefitInKindForm(offerBenefitInKind));
      });
    }
  }

  deleteOfferBenefitInKind(index: number) {
    if (this.OfferBenefitInKind.at(index).get(SharedConstant.ID).value === NumberConstant.ZERO) {
      this.OfferBenefitInKind.removeAt(index);
    } else {
      this.OfferBenefitInKind.at(index).get(SharedConstant.IS_DELETED).setValue(true);
      this.OfferBenefitInKind.at(index).get(ContractConstant.ID_BENEFIT_IN_KIND).clearValidators();
      this.OfferBenefitInKind.at(index).get(ContractConstant.VALUE).clearValidators();
      this.OfferBenefitInKind.at(index).get(BonusConstant.VALIDITY_START_DATE).clearValidators();
      this.OfferBenefitInKind.at(index).get(BonusConstant.VALIDITY_END_DATE).clearValidators();
    }
  }

  public addOfferBonus(): void {
    this.OfferBonus.push(this.buildOfferBonusForm());
  }

  public buildOfferBonusForm(offerBonus?: OfferBonus): FormGroup {
    const offerBonusFormGroup = this.formBuilder.group({
      Id: [offerBonus ? offerBonus.Id : NumberConstant.ZERO],
      IdBonus: [offerBonus ? offerBonus.IdBonus : undefined, [Validators.required]],
      Value: [offerBonus ? offerBonus.Value : '', [Validators.min(NumberConstant.ZERO),
        Validators.max(NumberConstant.ONE_MILLION)], companyCurrencyPrecision(this.offerService)],
      ValidityStartDate: [offerBonus ?
        new Date(offerBonus.ValidityStartDate) : this.StartDate.value ?
          new Date(this.StartDate.value) : new Date(), [Validators.required]],
      ValidityEndDate: [offerBonus && offerBonus.ValidityEndDate ?
        new Date(offerBonus.ValidityEndDate) : undefined],
      IsDeleted: [false],
      IdContract: [offerBonus && offerBonus.IdOffer ? offerBonus.IdOffer : NumberConstant.ZERO],
      BonusMinStartDate: [offerBonus && offerBonus.IdBonusNavigation ? offerBonus.IdBonusNavigation.StartDate : undefined]
    });
    this.buildOfferBonusValidators(offerBonusFormGroup);
    return offerBonusFormGroup;
  }

  isOfferBonusRowVisible(i): boolean {
    return !this.OfferBonus.at(i).get(SharedConstant.IS_DELETED).value;
  }

  public deleteOfferBonus(position): void {
    if (this.OfferBonus.at(position).get(SharedConstant.ID).value === NumberConstant.ZERO) {
      this.OfferBonus.removeAt(position);
    } else {
      this.OfferBonus.at(position).get(SharedConstant.IS_DELETED).setValue(true);
      this.OfferBonus.at(position).get(ContractConstant.ID_BONUS).setValidators(null);
      this.OfferBonus.at(position).get(ContractConstant.VALUE).setValidators(null);
      this.OfferBonus.at(position).get(BonusConstant.VALIDITY_START_DATE).setValidators(null);
      this.OfferBonus.at(position).get(BonusConstant.VALIDITY_END_DATE).setValidators(null);
    }
  }

  public setOfferBonus(offer: Offer) {
    if (offer.OfferBonus) {
      offer.OfferBonus.forEach(offerBonus => {
        this.OfferBonus.push(this.buildOfferBonusForm(offerBonus));
      });
    }
  }

  changeRequired(hasEndDate) {
    if (hasEndDate) {
      this.required = true;

    } else {
      this.required = false;
    }
    this.hasEndDate = hasEndDate;
    this.addDependentDateControls();
  }

  private prepareForm() {
    // If dialog receive an offer object, update the form input
    if (this.data && this.data.Id) {
      this.isUpdateMode = true;
      this.offerToUpdate = this.data;
      this.idCandidacy = this.data.IdCandidacy;
      if (this.data.MealVoucher) {
        this.mealVoucherShow = true;
      }
      if (this.data.CommissionType === NumberConstant.ONE) {
        this.commissionShow = true;
        this.commissionTypeValue = NumberConstant.ONE;
      }
      if (this.data.CommissionType === NumberConstant.TWO) {
        this.commissionShow = true;
        this.commissionTypeValue = NumberConstant.TWO;
      }
    } else { // If dialog receive an IdCandidacy
      this.isUpdateMode = false;
      this.idCandidacy = this.data;
    }
  }

  private addDependentDateControls(): void {
    this.StartDate.setValidators([
      Validators.required,
      dateValueLT(new Observable(o => o.next(this.EndDate.value)))
    ]);
    if (this.hasEndDate) {
      this.EndDate.setValidators([Validators.required, dateValueGT(new Observable(o => o.next(this.StartDate.value)))]);
    } else {
      this.EndDate.setValidators([dateValueGT(new Observable(o => o.next(this.StartDate.value)))]);
    }

    this.updateStartDateValidity();
    this.updateEndDateValidity();
  }

  /**
   * For buil contract bonus added validators
   * @param offerBonusFormGroup
   */
  private buildOfferBonusValidators(offerBonusFormGroup: FormGroup) {
    offerBonusFormGroup.controls[BonusConstant.VALIDITY_START_DATE].setValidators([
      Validators.required,
      dateValueLT(Observable.of(this.utilityService.minDateBetweendates([this.EndDate.value,
        offerBonusFormGroup.controls[BonusConstant.VALIDITY_END_DATE].value]))),
      dateValueGT(Observable.of(new Date(this.StartDate.value))),
    ]);
    offerBonusFormGroup.controls[BonusConstant.VALIDITY_END_DATE].setValidators(
      this.EndDate.value ?
        [dateValueLT(Observable.of(new Date(this.EndDate.value))),
          dateValueGT(Observable.of(this.utilityService.maxDateBetweendates([this.StartDate.value,
            offerBonusFormGroup.controls[BonusConstant.VALIDITY_START_DATE].value])))] :
        [dateValueGT(Observable.of(this.utilityService.maxDateBetweendates([this.StartDate.value,
          offerBonusFormGroup.controls[BonusConstant.VALIDITY_START_DATE].value])))]);
  }
}
