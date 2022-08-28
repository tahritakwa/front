import {Component, EventEmitter, Input, OnInit, Output, ViewContainerRef} from '@angular/core';
import {TiersService} from '../../services/tiers/tiers.service';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {FormModalDialogService} from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import {SwalWarring} from '../../../shared/components/swal/swal-popup';
import {ListSupplierComponent} from '../list-supplier/list-supplier.component';
import {FormBuilder} from '@angular/forms';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {ValidationService} from '../../../shared/services/validation/validation.service';
import {FileService} from '../../../shared/services/file/file-service.service';
import {PagerSettings} from '@progress/kendo-angular-grid';
import {TiersConstants} from '../../../constant/purchase/tiers.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';

@Component({
  selector: 'app-card-suppliers',
  templateUrl: './card-suppliers.component.html',
  styleUrls: ['./card-suppliers.component.scss']
})

export class CardSuppliersComponent extends ListSupplierComponent implements OnInit {
  @Input() data: any[] = [];
  private imageGrid = [];
  @Output() DoPaginte = new EventEmitter();
  // Number of the total trainings
  @Input() totalSuppliers = NumberConstant.ZERO;
  @Input() totalCards;
  @Input() Cardstate;
  @Input() gridSettings;
  @Output() state;
  @Input() haveDeletePermission = false;
  @Input() haveUpdatePermission = false;
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public pictureSrc: any;
  defaultPictureUrl = 'assets/image/no-picture.png';
  public supplierProfileLink = TiersConstants.SUPPLIER_PROFILE_URL;

  constructor(public tiersService: TiersService, protected swalWarrings: SwalWarring,
              protected viewRef: ViewContainerRef, protected formModalDialogService: FormModalDialogService,
              protected router: Router, protected fb: FormBuilder, protected translate: TranslateService,
              protected validationService: ValidationService,
              protected fileServiceService: FileService , public authService: AuthService) {
    super(tiersService, router, swalWarrings, fb, translate, validationService, fileServiceService, authService );
  }

  /**
   * ng init
   */
  ngOnInit() {
    this.data.forEach((supplier, index) => {
      this.getPictureSrc(supplier.UrlPicture, index);
    });
  }

  paginate(event) {
    this.DoPaginte.emit(event);
  }

  /**get picture */
  getPictureSrc(UrlPicture: string, index): any {
    if (UrlPicture) {
      this.tiersService.getPicture(UrlPicture).subscribe((data) => {
        this.pictureSrc = SharedConstant.PICTURE_BASE + data;
        this.imageGrid[index] = this.pictureSrc;
      });
    } else {
      this.imageGrid[index] = this.defaultPictureUrl;
    }
  }


  /**
   * save or edit training
   * @param data
   */
  goToAdvancedEdit(dataItem) {
    this.router.navigateByUrl(TiersConstants.SUPPLIER_ADVANCED_EDIT_URL + dataItem.Id, {queryParams: dataItem, skipLocationChange: true});
  }

  /**
   * Delete training
   */
  deleteSupplier(i, supplier) {
    this.swalWarrings.CreateSwal('Supprimer ce fournisseur').then((result) => {
      if (result.value) {
        // remove the training
        this.tiersService.removeTiers(supplier).subscribe((res) => {
          if (this.data.length === NumberConstant.ONE) {
            // it's about the deletion of the last element in the page
            // so we have to load the previous page after removing this element
            this.state = {
              skip: this.state.skip - this.state.take,
              take: this.totalCards,
            };
          }
          this.data.splice(i, 1);
          this.initGridDataSource(true);
        });
      }
    });
  }
}
