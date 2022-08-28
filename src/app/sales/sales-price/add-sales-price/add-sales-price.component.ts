import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { SalesPriceConstant } from '../../../constant/sales/sales-price.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { StyleConfigService } from '../../../shared/services/styleConfig/style-config.service';
import { digitsAfterComma, unique, ValidationService } from '../../../shared/services/validation/validation.service';
import { SalesPriceService } from '../../services/sales-price/sales-price.service';

@Component({
  selector: 'app-add-sales-price',
  templateUrl: './add-sales-price.component.html',
  styleUrls: ['./add-sales-price.component.scss']
})
export class AddSalesPriceComponent implements OnInit {
  private isSaveOperation = false;
  private id: number;
  public salesPriceFormGroup: FormGroup;
  public listUrl = SalesPriceConstant.LIST_SALES_PRICE_URL;
  isUpdateMode: boolean;
  public isActive = true;
  private idSubscription: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    public salesPriceService: SalesPriceService,
    private fb: FormBuilder,
    private validationService: ValidationService,
    private styleConfigService: StyleConfigService,
    private router: Router) {
    this.idSubscription = this.activatedRoute.params.subscribe(params => {
      this.id = +params[SharedConstant.ID_LOWERCASE] || 0;
    });
    this.isUpdateMode = this.id > 0;
  }

  ngOnInit() {
    this.createAddForm();
    if (this.isUpdateMode) 
    {
        this.getDataToUpdate();
        this.salesPriceFormGroup.controls['Code'].disable();
    }
  }

  private createAddForm(): void {
    this.salesPriceFormGroup = this.fb.group({
      Id: [0],
      Code: ['', {validators: Validators.required, asyncValidators: unique(SharedConstant.CODE, this.salesPriceService, String(this.id)), updateOn: 'blur'}],
      Label: ['', Validators.required],
      Value: [null, [Validators.required]],
      IsActivated: [true]
    });
  }

  public onAddSalesPriceClick(): void {
    if (this.salesPriceFormGroup.valid) {
      const data = this.salesPriceFormGroup.getRawValue();
      this.isSaveOperation = true;
      this.salesPriceService.save(data, !this.isUpdateMode).subscribe((value) => {
          this.router.navigate([this.listUrl]);
      });
    } else {
      this.validationService.validateAllFormFields(this.salesPriceFormGroup);
    }
  }

  getDataToUpdate() {
    this.salesPriceService.getById(this.id).subscribe(data => {
      this.isActive = data.IsActivated;
      this.salesPriceFormGroup.patchValue(data);
    });
  }

  public backToList() {
    this.router.navigateByUrl(SharedConstant.TAXES_LIST_URL);
  }

  /**
   * this method will be called by CanDeactivateGuard service to check the leaving component possibility
   */
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.isSaveOperation) {
      this.isSaveOperation = false;
      return true;
    }
    return this.validationService.handleCanDeactivateToLeaveCurrentComponent(this.isFormGroupChanged.bind(this));
  }

  private isFormGroupChanged(): boolean {
    return this.salesPriceFormGroup.touched;
  }

  getFooterClass(): string {
    return this.styleConfigService.getFooterClassSettingLayoutAddComponent();
  }

  changepriceState() {
    this.isActive = !this.isActive;
    this.salesPriceFormGroup.controls['IsActivated'].setValue(this.isActive);
  }

}
