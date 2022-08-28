import { FormControl, FormGroup } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { BrandService } from '../../../inventory/services/brand/brand.service';
import { FormModalDialogService } from '../../services/dialog/form-modal-dialog/form-modal-dialog.service';
import { AddBandComponent } from '../add-band/add-band.component';
import { ItemConstant } from '../../../constant/inventory/item.constant';
import { ReducedBrand } from '../../../models/inventory/reduced-brand.model';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { ComboBoxComponent } from '@progress/kendo-angular-dropdowns';
import { StyleConstant } from '../../../constant/utility/style.constant';
import { UserService } from '../../../administration/services/user/user.service';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { isNotNullOrUndefinedAndNotEmptyValue } from '../../../stark-permissions/utils/utils';
import { OrderBy, OrderByDirection, PredicateFormat } from '../../utils/predicate';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';

const BAND = 'BRAND';
const BRAND_COMBOBOX = 'brand';

@Component({
  selector: 'app-brand-combo-box',
  templateUrl: './brand-combo-box.component.html',
  styleUrls: ['./brand-combo-box.component.scss']
})
export class BrandComboBoxComponent implements OnInit {
  @Input() itemForm: FormGroup;
  @Input() allowCustom;
  @Input() disabled: boolean;
  @Output() Selected = new EventEmitter<boolean>();
  @Output() SelectedString = new EventEmitter<string>();
  @Output() idVehicleBrand;
  @Input() forSearch: boolean;
  @ViewChild(BRAND_COMBOBOX) public brandComboBox: ComboBoxComponent;
  @Input() withoutPlaceholder;
  @Input() isCardView = false;
  @Input() public placeholder = BAND;
  public selectedBrand: ReducedBrand;
  public selectedBandSource: ReducedBrand;
  public brandDataSource: ReducedBrand[];
  public brandFiltredDataSource: ReducedBrand[];
  public fieldsetBorderStyle = StyleConstant.BORDER_SOLID;
  public searchedBrand = SharedConstant.EMPTY;
  public brandsPicturesUrls: string[];
  /**
   * permissions
   */
  public hasAddBrandPermission : boolean;

  /**
   * Decorator to send hole selected brand data
   */
  @Output() onBrandSelected = new EventEmitter<ReducedBrand>();

  /**
   *
   * @param brandService
   * @param userService
   * @param formModalDialogService
   * @param viewRef
   */
  constructor(private brandService: BrandService, private userService: UserService,
    private formModalDialogService: FormModalDialogService,
    private viewRef: ViewContainerRef, private authService: AuthService) {
  }

  ngOnInit() {
    this.hasAddBrandPermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.ADD_VEHICLEBRAND);
    this.initDataSource();
  }

  initDataSource(): void {
    this.brandService.listdropdownWithPerdicate(this.preparePredicate()).subscribe((data: any) => {
      this.brandDataSource = data.listData;
      this.brandFiltredDataSource = this.brandDataSource.slice(0);
    }, () => {
    }, () => {
      this.loadBrandPicture();
    });
  }
  preparePredicate(): PredicateFormat {
    const predicate = new PredicateFormat();
    predicate.OrderBy = new Array<OrderBy>();
    predicate.OrderBy.push(new OrderBy(SharedConstant.LABEL, OrderByDirection.asc));
    return predicate;
  }

  /**
   * filter by code and label
   * @param value
   */
  handleFilter(value: string): void {
    this.brandFiltredDataSource = this.brandDataSource.filter((s) =>
      s.Code.toLowerCase().includes(value.toLowerCase())
      || s.Label.toLocaleLowerCase().includes(value.toLowerCase()));
    if (this.searchedBrand) {
      this.SelectedString.emit(this.searchedBrand);
    }
  }


  /**
   * on change
   * @param $event
   */
  handleChange($event): void {
    this.selectedBandSource = this.brandFiltredDataSource.find(x => x.Id === $event);
    this.brandFiltredDataSource = this.brandDataSource.slice(0);
    if (isNotNullOrUndefinedAndNotEmptyValue(this.selectedBandSource)) {
      this.onBrandSelected.emit(this.selectedBandSource);
    }
    this.Selected.emit($event);
  }

  /**
   * add new value
   * */
  addNew(): void {
    const modalTitle = ItemConstant.CREATE_BAND;
    this.formModalDialogService.openDialog(modalTitle, AddBandComponent, this.viewRef,
      this.close.bind(this), null, true, SharedConstant.MODAL_DIALOG_SIZE_M);
  }

  get IdVehicleBrand(): FormControl {
    return this.itemForm.get('IdVehicleBrand') as FormControl;
  }

  public openComboBox() {
    this.brandComboBox.toggle(true);
  }


  onPictureClick(brand) {
    this.resetAllBrandPictureBorders(brand.Id);
    const pictureId = `${brand.Id}${brand.Label}`;
    const picture = document.getElementById(pictureId);
    if (picture.style.border === StyleConstant.BORDER_BRAND_CARD_SOLID) {
      picture.style.border = StyleConstant.BORDER_NONE;
      this.Selected.emit(undefined);
    } else {
      picture.style.border = StyleConstant.BORDER_BRAND_CARD_SOLID;
      this.Selected.emit(brand.Id);
    }
  }

  resetAllBrandPictureBorders(Id) {
    this.brandFiltredDataSource.forEach(value => {
      if (value.Id !== Id && isNotNullOrUndefinedAndNotEmptyValue(document.getElementById(`${value.Id}${value.Label}`))) {
        document.getElementById(`${value.Id}${value.Label}`).style.border = StyleConstant.BORDER_NONE;
      }
    });
  }

  private loadBrandPicture() {
    this.brandsPicturesUrls = [];
    this.brandFiltredDataSource.forEach((brand: ReducedBrand) => {
      this.brandsPicturesUrls.push(brand.UrlPicture);
    });
    if (this.brandsPicturesUrls.length > NumberConstant.ZERO) {
      this.brandService.getPictures(this.brandsPicturesUrls, false).subscribe(brandPictures => {
        this.fillBrandPictures(brandPictures);
      });
    }
  }

  private fillBrandPictures(brandPictures) {
    this.brandFiltredDataSource.map((brand: ReducedBrand) => {
      if (brand.UrlPicture) {
        let dataPicture = brandPictures.objectData.find(value => value.FulPath === brand.UrlPicture);
        if (dataPicture) {
          brand.Picture = `${SharedConstant.PICTURE_BASE}${dataPicture.Data}`;
        }
      }
    });
  }
  public close(data) {
    if (data) {
      this.brandDataSource = data.data;
      this.brandFiltredDataSource = this.brandDataSource.slice(0);
      if(this.itemForm){
      this.IdVehicleBrand.setValue(data.data[data.total - 1].Id);
      this.Selected.emit(this.IdVehicleBrand.value);
    }
    }
  }
}
