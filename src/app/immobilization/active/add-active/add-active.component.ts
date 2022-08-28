import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, Injector, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { CompanyService } from '../../../administration/services/company/company.service';
import { SharedAccountingConstant } from '../../../constant/accounting/sharedAccounting.constant';
import { ActiveConstant } from '../../../constant/immobilization/active.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { ReducedCurrency } from '../../../models/administration/reduced-currency.model';
import { Active } from '../../../models/immobilization/active.model';
import { dateValueGT, dateValueLT, digitsAfterComma, strictSup, ValidationService } from '../../../shared/services/validation/validation.service';
import { Filter, Operation, PredicateFormat, Relation } from '../../../shared/utils/predicate';
import { ActiveService } from '../../services/active/active.service';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import * as jsPDF from 'jspdf';


const ACTIVE_LIST_URL = '/main/immobilization/listOfActive';
const ACTIVE_LIST_ACCOUNTING_URL = 'main/accounting/depreciationAssets';
const DEPRECITION_ASSETS_URL = '/main/accounting/depreciationAssets/AdvancedAdd';

@Component({
  selector: 'app-add-active',
  templateUrl: './add-active.component.html',
  styleUrls: ['./add-active.component.scss']
})
export class AddActiveComponent implements OnInit, OnDestroy {
  /*
   * Form Group
   */
  activeFormGroup: FormGroup;
  private __assetsRouterLink : string 
  private oldAcquisationDateValue: Date;
  private oldServiceDateValue: Date;
  public minServiceDate: Date;
  public maxAcquisationDate: Date;
  public canChangeServiceDate = true;
  public formatNumberOptions: any;
  public purchasePrecision: number;


  /*
   * Id Entity
   */
  private id: number;

  /*
   * is updateMode
   */
  public isUpdateMode: boolean;

  private activeSubscription: Subscription;

  /*
   * active to update
   */
  private activeToUpdate: Active;

  /*
  * form controle
  */
  @Input() control: FormControl;
    /*
  * disabled value
  */
 @Input() disabledField = false;
 disabledFormGroup;

  /*
   * id Subscription
   */
  private idSubscription: Subscription;
  // Format Date
  public formatDate: string = this.translate.instant(SharedConstant.DATE_FORMAT);

  /**
   * Contructor
   * @param activeService
   * @param formBuilder
   * @param activatedRoute
   * @param router
   * @param validationService
   */
  constructor(private activeService: ActiveService, private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute, private router: Router, private validationService: ValidationService,
    private cdRef: ChangeDetectorRef, private growlService: GrowlService, private translate: TranslateService,
    private injector: Injector, private datePipe: DatePipe, private companyService: CompanyService,
    private authService: AuthService) {
    this.idSubscription = this.activatedRoute.params.subscribe(params => {
      this.id = +params['id'] || 0;
    });
    this.idSubscription = this.activatedRoute.queryParams.subscribe(params => {
    }); 
    this.__assetsRouterLink = this.router.routerState.snapshot.url.includes(DEPRECITION_ASSETS_URL) ? ACTIVE_LIST_ACCOUNTING_URL : ACTIVE_LIST_URL; 
  }

  /**
   * on init
   * */
  ngOnInit() {
    this.createAddForm();
    this.getCurrentCompany();
    this.isUpdateMode = this.id > 0;
    if (this.isUpdateMode) {
      this.getDataToUpdate();
      if (!this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_ACTIVE)) {
        this.disabledActiveFormGroup();
      }
    }
  }

  /**
   * create add form
   * */
  private createAddForm(): void {
    this.activeFormGroup = this.formBuilder.group({
      Id: [0],
      Code: ['', [Validators.required, Validators.maxLength(ActiveConstant.MAX_LENGTH_CODE)]],
      Label: ['', [Validators.required, Validators.maxLength(ActiveConstant.MAX_LENGTH_CODE)]],
      Description: [''],
      Value: [undefined, [Validators.required, strictSup(0)]],
      Status: [undefined, Validators.required],
      AcquisationDate: [],
      IdCategory: [undefined, Validators.required],
      ServiceDate: [],
      DepreciationPeriod: [undefined, strictSup(0)],
      NumSerie: ['', [ Validators.maxLength(ActiveConstant.MAX_LENGTH_CODE)]],
    });
    this.addDependentDateControls();
    this.checkDisabledField();
  }

  /**
   * add Aquisition date & service date
   * */
  private addDependentDateControls(): void {
    this.setAcquisationDateControl();
    this.setServiceDateControl();
    this.AcquisationDate.valueChanges.subscribe(() => {
      if (this.ServiceDate.hasError(ActiveConstant.DATE_VALUE_GT)) {
        this.ServiceDate.setErrors(null);
      }
    });
    this.ServiceDate.valueChanges.subscribe(() => {
      if (this.AcquisationDate.hasError(ActiveConstant.DATE_VALUE_LT)) {
        this.AcquisationDate.setErrors(null);
      }
    });
  }
  /**
   * Change min value of service date
   * */
  changeAcquisationDate() {
    if (this.activeFormGroup.get(ActiveConstant.ACQUISATION_DATE).value !== this.oldAcquisationDateValue) {
      this.oldAcquisationDateValue = this.activeFormGroup.get(ActiveConstant.ACQUISATION_DATE).value;
      this.minServiceDate = this.activeFormGroup.get(ActiveConstant.ACQUISATION_DATE).value;
      this.cdRef.detectChanges();
    }
  }

  /**
   * Change max value of Acquisation date
   * */
  changeServiceDate() {
    this.canChangeServiceDate = true;
    if (this.activeFormGroup.get(ActiveConstant.SERVICE_DATE).value !== this.oldServiceDateValue) {
      if (this.activeToUpdate && this.activeToUpdate.History && this.activeToUpdate.History.length > 0) {
        if (!this.activeFormGroup.get(ActiveConstant.SERVICE_DATE).value) {
          this.canChangeServiceDate = false;
        } else {
          this.activeToUpdate.History.forEach(x => {
            if (this.activeFormGroup.get(ActiveConstant.SERVICE_DATE).value > new Date(x.AcquisationDate)) {
              this.canChangeServiceDate = false;
            }
          });
        }
      }
      if (this.canChangeServiceDate) {
        this.oldServiceDateValue = this.activeFormGroup.get(ActiveConstant.SERVICE_DATE).value;
        this.maxAcquisationDate = this.activeFormGroup.get(ActiveConstant.SERVICE_DATE).value;
        this.cdRef.detectChanges();
      } else {
        this.growlService.ErrorNotification(this.translate.instant('CHECK_ASSIGNMENT_BEFORE_CHANGE_DATE'));
        this.activeFormGroup.get(ActiveConstant.SERVICE_DATE).setValue(this.oldServiceDateValue);
      }
    }
  }
  /**
   * set service date control
   * */
  private setServiceDateControl(): void {
    const oAcquisationDate = new Observable<Date>(observer => observer.next(this.AcquisationDate.value));
    this.activeFormGroup.setControl(ActiveConstant.SERVICE_DATE, this.formBuilder.control(undefined,
      [dateValueGT(oAcquisationDate)]));
  }
  /**
   * set aquistion date control
   * */
  private setAcquisationDateControl(): void {
    const oServiceDate = new Observable<Date>(observer => observer.next(this.ServiceDate.value));
    this.activeFormGroup.setControl(ActiveConstant.ACQUISATION_DATE, this.formBuilder.control(undefined,
      [Validators.required, dateValueLT(oServiceDate)]));
  }
  /** form gettes */
  get ServiceDate() {
    return this.activeFormGroup.get(ActiveConstant.SERVICE_DATE) as FormControl;
    }
  get AcquisationDate(): FormControl {
    return this.activeFormGroup.get(ActiveConstant.ACQUISATION_DATE) as FormControl;
  }
  private preparePredicate(): PredicateFormat {
    const predicate = new PredicateFormat();
    predicate.Filter = new Array<Filter>();
    predicate.Filter.push(new Filter('Id', Operation.eq, this.id));
    predicate.Relation = new Array<Relation>();
    predicate.Relation.push.apply(predicate.Relation, [new Relation('History')]);
    return predicate;
  }

  /**
   *  get data to update
   */
  private getDataToUpdate(): void {
    this.activeSubscription = this.activeService.getModelByCondition(this.preparePredicate()).subscribe(data => {
      this.activeToUpdate = data;

      if (this.activeToUpdate) {
        if (this.activeToUpdate.AcquisationDate) {
          this.activeToUpdate.AcquisationDate = new Date(this.activeToUpdate.AcquisationDate);
        }
        if (this.activeToUpdate.ServiceDate) {
          this.activeToUpdate.ServiceDate = new Date(this.activeToUpdate.ServiceDate);
        }
        this.activeFormGroup.patchValue(this.activeToUpdate);
        if(this.activeToUpdate.ServiceDate) {
          this.checkIfDateInClosedPeriod();
          this.checkIfCanUpdate();
        }
      }
    });
  }

  checkIfDateInClosedPeriod() {
    if(this.activeFormGroup.value.ServiceDate) {
      const dynamicImportFiscalYearService = require('../../../accounting/services/fiscal-year/fiscal-year.service');
      const dynamicImportFiscalYearConstant = require('../../../constant/accounting/fiscal-year.constant');
      let date = this.datePipe.transform(this.activeFormGroup.value.ServiceDate, 'yyyy/MM/dd HH:mm:ss');
      this.injector.get(dynamicImportFiscalYearService.FiscalYearService)
        .getJavaGenericService().sendData(dynamicImportFiscalYearConstant.FiscalYearConstant.DATE_IN_CLOSED_PERIOD + `?date=${date}`)
        .subscribe(isHidden => {
          if(isHidden){
            this.disabledActiveFormGroup();
          }
        });
      this.disabledFormGroup = !this.disabledFormGroup;
    }
  }

  disabledActiveFormGroup() {
    this.activeFormGroup.controls['ServiceDate'].disable();
    this.activeFormGroup.controls['AcquisationDate'].disable();
    this.activeFormGroup.controls['Value'].disable();
    this.activeFormGroup.controls['IdCategory'].disable();
    this.activeFormGroup.controls['Code'].disable();
    this.activeFormGroup.controls['Label'].disable();
    this.activeFormGroup.controls['Status'].disable();
    this.activeFormGroup.controls['NumSerie'].disable();
    this.activeFormGroup.controls['Description'].disable();
    
  }
  /**
   * on destroy
   * */
  ngOnDestroy(): void {
    if (this.idSubscription) {
      this.idSubscription.unsubscribe();
    }
    if (this.activeSubscription) {
      this.activeSubscription.unsubscribe();
    }
  }
  /**
   * on click save
   * */
  public onAddActiveClick(): void {
      this.activeFormGroup.controls.Label.setValue(this.activeFormGroup.controls.Label.value.trim());
      this.activeFormGroup.controls.Code.setValue(this.activeFormGroup.controls.Code.value.trim());
      this.activeFormGroup.controls.NumSerie.setValue(this.activeFormGroup.controls.NumSerie.value.trim());
      this.activeFormGroup.controls.Description.setValue(this.activeFormGroup.controls.Description.value.trim());
    if (this.activeFormGroup.valid) {
      // Temporary code
      const valueToSend = this.activeFormGroup.value as Active;
      this.activeService.save(valueToSend, !this.isUpdateMode).subscribe((data) => {
        if (data) {
          this.id = data.Id;
        }
        const dynamicImportReportService = require('../../../accounting/services/reporting/reporting.service');
        this.activeSubscription = this.activeService.getModelByCondition(this.preparePredicate()).subscribe(dataToSave => {
          this.activeToUpdate = dataToSave;
          this.saveDepreciationAssets(dynamicImportReportService);
         });
      });
    } else {
      this.validationService.validateAllFormFields(this.activeFormGroup);
      }
    }

    saveDepreciationAssets(dynamicImportReportService){
    const depreciationAssets = {
      'idCategory' : this.activeToUpdate.IdCategory,
      'idAssets': this.activeToUpdate.Id,
      'cession': false,
      'assetsLabel': this.activeToUpdate.Label,
      'dateOfCommissioning': this.datePipe.transform(this.activeToUpdate.ServiceDate, SharedAccountingConstant.YYYY_MM_DD_HH_MM_SS)
    };
    const dynamicImportReportingConstant = require('../../../constant/accounting/reporting.constant');
    this.injector.get(dynamicImportReportService.ReportingService)
        .getJavaGenericService()
        .sendData(dynamicImportReportingConstant.ReportingConstant.DEPRECIATION_OF_ASSETS, depreciationAssets)
        .subscribe(() => {}, error => {}, () => {
          if(this.authService.hasAuthority(PermissionConstant.CommercialPermissions.LIST_ACTIVE)){
            this.router.navigateByUrl(this.__assetsRouterLink);
          }
          else{
            this.router.navigateByUrl(ACTIVE_LIST_ACCOUNTING_URL);
          }
        });
    }


  checkIfCanUpdate(){
    const dateOfCommissioning = this.activeToUpdate.ServiceDate;
    const dynamicImportFiscalYearService = require('../../../accounting/services/fiscal-year/fiscal-year.service');
    const dynamicImportFiscalYearConstant = require('../../../constant/accounting/fiscal-year.constant');
    let serviceDates = [dateOfCommissioning];
    this.injector.get(dynamicImportFiscalYearService.FiscalYearService)
        .getJavaGenericService().sendData(dynamicImportFiscalYearConstant.FiscalYearConstant.IS_CONSOMMING_DATES_IN_FISCAL_YEAR, serviceDates).subscribe(results => {
           if(results !== null  && results !== undefined && !results[0])  {
            this.disabledActiveFormGroup();
           }
        });
  }

  public checkDisabledField() {
    this.disabledField ? this.activeFormGroup.disable() : this.activeFormGroup.enable();
  }

  backToList() {
    this.router.url === DEPRECITION_ASSETS_URL ? this.router.navigateByUrl(ACTIVE_LIST_ACCOUNTING_URL) :
      this.router.navigateByUrl(ACTIVE_LIST_URL);
  }


  getCurrentCompany() {
    this.companyService.getDefaultCurrencyDetails().subscribe((currency: ReducedCurrency) => {
      this.purchasePrecision = currency.Precision;
      this.setSelectedCurrency(currency);
      this.activeFormGroup.controls['Value'].setValidators(
        [Validators.required, strictSup(0),digitsAfterComma(this.purchasePrecision)]
      );
    });
  }
  private setSelectedCurrency(currency: ReducedCurrency) {
    this.formatNumberOptions = {
      maximumFractionDigits: currency.Precision,
      minimumFractionDigits: currency.Precision
    };
  }
  downloadCodeBar2D() {
    const qrcode = document.getElementById('qrCode');
    this.downloadBarCode1DOr2D(qrcode.children[1], 'qrCode');
  }
  downloadBarCode1DOr2D(codeImg, barCodeName) {
    let doc = new jsPDF();
    let imageData = this.getBase64Image(codeImg, barCodeName);
    doc.setFontSize(9);
    if (barCodeName == 'qrCode') {
      doc.addImage(imageData, 'JPG', 10, 12);
    } else {
      doc.addImage(imageData, 'JPG', 10, 11);
    }
    var textWidth = doc.getStringUnitWidth(this.activeFormGroup.controls['Code'].value);
    var textOffset = 30 - (textWidth);
    doc.text(textOffset, 7, this.activeFormGroup.controls['Code'].value);

    var textWidth1 = doc.getStringUnitWidth(this.activeFormGroup.controls['Description'].value);
    var textOffset1 = (30 - textWidth1);
    doc.text(textOffset1, 7, '\n' + this.activeFormGroup.controls['Description'].value);
    doc.save(barCodeName + '.pdf');
  }

  getBase64Image(img, barCodeName) {
    var canvas = document.createElement('canvas');
    canvas.width = img.width - 1;
    canvas.height = img.height - 1;
    var ctx = canvas.getContext('2d');
    if (barCodeName == 'qrCode') {
      canvas.width = 189;
      canvas.height = 113;
      ctx.drawImage(img, 0, 0, 189, 85);
    } else {
      ctx.drawImage(img, 0, 0, 189, 85);
    }
    var dataURL = canvas.toDataURL('image/png');
    return dataURL;
  }

  onPurchasePriceChange(event) {
    var value = event.srcElement.value;
    if (
      value.indexOf(",") !== -1 &&
      event.inputType === "insertText" &&
      value.split(",")[1].length > this.purchasePrecision
    ) {
      event.srcElement.value = value.substr(0, value.length - 1);
    }
  }

  public checkDisabledFormGroup() {
    return this.activeFormGroup.disabled ? false: true;
  }


}
