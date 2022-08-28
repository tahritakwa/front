import {FormGroup, FormControl} from '@angular/forms';
import {Component, Input, EventEmitter, Output, OnInit, ViewContainerRef, ViewChild} from '@angular/core';
import {ModelOfItemService} from '../../../inventory/services/model-of-item/model-of-item.service';
import {PredicateFormat, Filter, Operation, Relation, OrderBy, OrderByDirection} from '../../utils/predicate';
import {ItemConstant} from '../../../constant/inventory/item.constant';
import {FormModalDialogService} from '../../services/dialog/form-modal-dialog/form-modal-dialog.service';
import {ReducedModelOfItem} from '../../../models/inventory/reduced-model-of-item.model';
import {AddModelComponent} from '../add-model/add-model.component';
import {SubFamilyService} from '../../../inventory/services/sub-family/sub-family.service';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {TranslateService} from '@ngx-translate/core';
import {ComboBoxComponent} from '@progress/kendo-angular-dropdowns';
import {isNotNullOrUndefinedAndNotEmptyValue} from '../../../stark-permissions/utils/utils';
import {ReducedBrand} from '../../../models/inventory/reduced-brand.model';
import {NumberConstant} from '../../../constant/utility/number.constant';
import { TiersConstants } from '../../../constant/purchase/tiers.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
const ITEM_MODEL_COMBOBOX = 'modelItemComboBox';
const MODELE = 'MODELE';

@Component({
  selector: 'app-model-of-item-combo-box',
  templateUrl: './model-of-item-combo-box.component.html',
  styleUrls: ['./model-of-item-combo-box.component.scss']
})

export class ModelOfItemComboBoxComponent implements OnInit {
  @ViewChild(ITEM_MODEL_COMBOBOX) public modelItemComboBox: ComboBoxComponent;
  @Input() itemForm: FormGroup;
  @Input() vehicle: boolean;
  @Input() allowCustom;
  @Input() disabled: boolean;
  @Input() isEnabledAnyWay: boolean;
  @Output() Selected = new EventEmitter<boolean>();
  @Output() idModel: number;
  @Input() withoutPlaceholder;
  isCardMode = false;
  idVehicleBrand: number;
  predicate: PredicateFormat;
  isDisabledModel = true;
  @Input() forSearch: boolean;
  @Output() onModelSelected: EventEmitter<ReducedModelOfItem> = new EventEmitter<ReducedModelOfItem>();
  public selectedModelSource: ReducedModelOfItem;
  public selectedModel: ReducedModelOfItem;

  public modelOfItemDataSource: ReducedModelOfItem[];
  public modelOfItemFiltredDataSource: ReducedModelOfItem[];
  public placeholder = '';
  public brandsPicturesUrls: string[];
  /**
   * permissions
   */
  public hasAddModelPermission : boolean;
  constructor(private modelOfItemService: ModelOfItemService,
              private formModalDialogService: FormModalDialogService,
              private viewRef: ViewContainerRef,
              private subFamilyService: SubFamilyService,
              private translateService: TranslateService, private authService: AuthService) {
    this.isCardMode = false;
    this.subFamilyService.getResult().subscribe((data) => {
      if (data.value === true) {
        if (data.data === true) {
          this.isCardMode = true;
          this.isDisabledModel = false;
        }
      }
    });
  }

  ngOnInit() {
    this.hasAddModelPermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.ADD_MODELOFITEM);
    if(!this.idVehicleBrand && this.itemForm && this.itemForm.controls && this.itemForm.controls['IdVehicleBrand'] && this.itemForm.controls['IdVehicleBrand'].value){
      this.idVehicleBrand = this.itemForm.controls['IdVehicleBrand'].value;
    }
    if (!this.idVehicleBrand) {
      this.modelOfItemService.listdropdown().subscribe((data: any) => {
        this.isDisabledModel = false;
        this.modelOfItemDataSource = data.listData;
        this.modelOfItemFiltredDataSource = this.modelOfItemDataSource.slice(0);
        this.loadRelatedBrandPicture();
      });
    }
    else{
      this.preparePredicate(this.idVehicleBrand);
        this.modelOfItemService.readDropdownPredicateData(this.predicate).subscribe(data => {
          this.isDisabledModel = false;
          this.modelOfItemDataSource = data;
          this.modelOfItemFiltredDataSource = this.modelOfItemDataSource.slice(0);
          this.loadRelatedBrandPicture();
        });
    }
    if (!this.withoutPlaceholder) {
      this.placeholder = this.translateService.instant(MODELE);
    }
  }

  private loadRelatedBrandPicture() {
    this.brandsPicturesUrls = [];
    this.modelOfItemFiltredDataSource.forEach((modelOfItem: ReducedModelOfItem) => {
      this.brandsPicturesUrls.push(modelOfItem.UrlPicture);
    });
    if (this.brandsPicturesUrls.length > NumberConstant.ZERO) {
      this.modelOfItemService.getPictures(this.brandsPicturesUrls, false).subscribe(brandPictures => {
        this.fillBrandPictures(brandPictures);
      });
    }
  }

  private fillBrandPictures(brandPictures) {
    this.modelOfItemFiltredDataSource.map((brand: ReducedBrand) => {
      const picture = brandPictures.objectData.find(value => value.FulPath === brand.UrlPicture);
      if (picture) {
        brand.Picture = `${SharedConstant.PICTURE_BASE}${picture.Data}`;
      }
    });
  }

  preparePredicate(value): void {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Filter.push(new Filter(ItemConstant.ID_VEHICLE_BRAND, Operation.eq, value));
    this.predicate.OrderBy = new Array<OrderBy>();
    this.predicate.OrderBy.push(new OrderBy( ItemConstant.LABEL,OrderByDirection.asc));
  }

  public initDataSource(value): void {
    if (!value && this.isCardMode) {
      this.isDisabledModel = false;
    }
    if (!value && !this.idVehicleBrand) {
      this.isDisabledModel = true;
    } else {
      // initialize filter value
      if (this.idVehicleBrand && !value) {
        value = this.idVehicleBrand;
      } else {
        this.idVehicleBrand = value;
      }
      this.preparePredicate(value);
      if (!this.isCardMode) {
        this.modelOfItemService.readDropdownPredicateData(this.predicate).subscribe(data => {
          this.isDisabledModel = false;
          this.modelOfItemDataSource = data;
          this.modelOfItemFiltredDataSource = this.modelOfItemDataSource.slice(0);
        });
      }
    }
    this.Selected.emit(undefined);
    if (this.itemForm && !this.vehicle) {
      this.itemForm.get(ItemConstant.ID_MODEL).reset();
    }
    if(this.itemForm && this.vehicle) {
      this.itemForm.get(TiersConstants.ID_VEHICLE_MODEL).reset();
    }
  }

  /**
   * filter by code and label
   * @param value
   */
  handleFilter(value: string): void {
    this.modelOfItemFiltredDataSource = this.modelOfItemDataSource.filter((s) =>
      s.Code.toLowerCase().includes(value.toLowerCase())
      || s.Label.toLocaleLowerCase().includes(value.toLowerCase()));
  }

  /**
   * on change
   * @param $event
   */
  handleChange($event): void {
    this.selectedModelSource = this.modelOfItemFiltredDataSource.find(x => x.Id === $event);
    this.modelOfItemFiltredDataSource = this.modelOfItemDataSource.slice(0);
    if (isNotNullOrUndefinedAndNotEmptyValue(this.selectedModelSource)) {
      this.onModelSelected.emit(this.selectedModelSource);
    }
    this.Selected.emit($event);
  }

  /**
   * add new value
   * */
  addNew(): void {
    const modalTitle = ItemConstant.CREATE_MODEL;
    this.formModalDialogService.openDialog(modalTitle, AddModelComponent, this.viewRef, this.close.bind(this),
      this.idVehicleBrand, true, SharedConstant.MODAL_DIALOG_SIZE_M, true);
  }

  get IdModel(): FormControl {
    return this.itemForm.get(ItemConstant.ID_MODEL) as FormControl;
  }

  get IdVehicleModel(): FormControl {
    return this.itemForm.get(TiersConstants.ID_VEHICLE_MODEL) as FormControl;
  }


  public openComboBox() {
    this.modelItemComboBox.toggle(true);
  }
  public close(data) {
    if (data && data.data) {
      this.modelOfItemDataSource = data.data;
      this.modelOfItemFiltredDataSource = this.modelOfItemDataSource.slice(NumberConstant.ZERO);
      if(this.idVehicleBrand){
        this.modelOfItemFiltredDataSource = this.modelOfItemFiltredDataSource.filter(x=> x.IdVehicleBrand == this.idVehicleBrand);
      }
      if(this.IdModel){
      this.IdModel.setValue(data.data[data.total - NumberConstant.ONE].Id);
      this.Selected.emit(this.IdModel.value);
      }
      } 
    }
}
