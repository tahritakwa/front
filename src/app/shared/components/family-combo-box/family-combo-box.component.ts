import { FormControl, FormGroup } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output, ViewContainerRef } from '@angular/core';
import { FamilyService } from '../../../inventory/services/family/family.service';
import { FormModalDialogService } from '../../services/dialog/form-modal-dialog/form-modal-dialog.service';
import { ItemConstant } from '../../../constant/inventory/item.constant';
import { AddFamilyComponent } from '../../../inventory/components/add-family/add-family.component';
import { ReducedFamily } from '../../../models/inventory/reduced-family.model';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { StyleConstant } from '../../../constant/utility/style.constant';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';

@Component({
  selector: 'app-family-combo-box',
  templateUrl: './family-combo-box.component.html',
  styleUrls: ['./family-combo-box.component.scss']
})
export class FamilyComboBoxComponent implements OnInit {
  @Input() itemForm: FormGroup;
  @Input() allowCustom;
  @Output() Selected = new EventEmitter<boolean>();
  @Input() disabled: boolean;
  @Output() idFamily: number;
  public selectedFamilySelected: ReducedFamily;
  public selectedFamily: ReducedFamily;
  public familyDataSource: ReducedFamily[];
  public familyFiltredDataSource: ReducedFamily[];
  @Input() forSearch: boolean;
  @Input() public placeholder = 'FAMILY';
  @Input() isCardView = false;
  @Input() hideAddbtn = false;
  public fieldsetBorderStyle = StyleConstant.BORDER_SOLID;
  public searchedFamilly = SharedConstant.EMPTY;
  public familiesPicturesUrls: string[];
  public hasAddPermission: boolean;
  constructor(private familyService: FamilyService, private authService: AuthService,
    private formModalDialogService: FormModalDialogService, private viewRef: ViewContainerRef) {
  }

  ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.ADD_FAMILY);
    this.initDataSource();
  }

  initDataSource(): void {
    this.familyService.listdropdown().subscribe((data: any) => {
      this.familyDataSource = data.listData;
      this.familyFiltredDataSource = this.familyDataSource.slice(0);
    }, () => {
    }, () => {
      this.loadFamiliesPicture();
    });
  }

  /**
   * filter by code and label
   * @param value
   */
  handleFilter(value: string): void {
    this.familyFiltredDataSource = this.familyDataSource.filter((s) =>
      s.Code.toLowerCase().includes(value.toLowerCase())
      || s.Label.toLocaleLowerCase().includes(value.toLowerCase()));
  }

  /**
   * on change
   * @param $event
   */
  handleChange($event): void {
    this.selectedFamilySelected = this.familyFiltredDataSource.find(x => x.Id === $event);
    this.familyFiltredDataSource = this.familyDataSource.slice(0);
    this.Selected.emit($event);
  }

  /**
   * Add new value
   * */
  addNew(): void {
    const modalTitle = ItemConstant.ADD_FAMILY;
    this.formModalDialogService.openDialog(modalTitle, AddFamilyComponent,
      this.viewRef, this.close.bind(this), null, true, SharedConstant.MODAL_DIALOG_SIZE_M);
  }

  get IdFamily(): FormControl {
    return this.itemForm.get('IdFamily') as FormControl;
  }


  onPictureClick(family) {
    const pictureId = `${family.Id}${family.Label}`;
    const picture = document.getElementById(pictureId);
    if (picture && picture.style.border === StyleConstant.BORDER_BRAND_CARD_SOLID) {
      picture.style.border = StyleConstant.BORDER_NONE;
      this.Selected.emit(undefined);
    } else {
      if (picture) {
        picture.style.border = StyleConstant.BORDER_BRAND_CARD_SOLID;
      }
      this.Selected.emit(family.Id);
    }
  }

  resetAllFamiliesPictureBorders(Id) {
    this.familyFiltredDataSource.forEach(value => {
      if (value.Id !== Id) {
        document.getElementById(`${value.Id}${value.Label}`).style.border = StyleConstant.BORDER_NONE;
      }
    });
  }

  private loadFamiliesPicture() {
    if (this.familyFiltredDataSource) {
      this.familiesPicturesUrls = [];
      this.familyFiltredDataSource.forEach((family: ReducedFamily) => {
        this.familiesPicturesUrls.push(family.UrlPicture);
      });
      if (this.familiesPicturesUrls.length > NumberConstant.ZERO) {
        this.familyService.getPictures(this.familiesPicturesUrls, false).subscribe(familiesPictures => {
          this.fillFamiliesPictures(familiesPictures);
        });
      }
    }
  }

  private fillFamiliesPictures(familiesPictures) {
    this.familyFiltredDataSource.map((family: ReducedFamily) => {
      if (family.UrlPicture) {
        let dataPicture = familiesPictures.objectData.find(value => value.FulPath === family.UrlPicture);
        if (dataPicture) {
          family.Picture = `${SharedConstant.PICTURE_BASE}${dataPicture.Data}`;
        }
      }
    });
  }
  public close(data) {
    if (data) {
      this.familyDataSource = data.data;
      this.familyFiltredDataSource = this.familyDataSource.slice(0);
      this.IdFamily.setValue(data.data[data.total - 1].Id);
      this.Selected.emit(this.IdFamily.value);
    }
  }

}

