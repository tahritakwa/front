import { Component, OnInit, EventEmitter, Input, Output, ViewContainerRef } from '@angular/core';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { TranslationKeysConstant } from '../../../constant/shared/translation-keys.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { AddTiersComponent } from '../../../shared/components/add-tiers/add-tiers.component';
import { TiersService } from '../../../purchase/services/tiers/tiers.service';
import { ListCustomerComponent } from '../list-customer/list-customer.component';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { FileService } from '../../../shared/services/file/file-service.service';
import {PagerSettings} from '@progress/kendo-angular-grid';
import {TiersConstants} from '../../../constant/purchase/tiers.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
const pictureBase = 'data:image/png;base64,';

@Component({
  selector: 'app-card-customer',
  templateUrl: './card-customer.component.html',
  styleUrls: ['./card-customer.component.scss']
})

export class CardCustomerComponent extends ListCustomerComponent implements OnInit {
  @Input() data: any[] = [];
  @Input() isCardView: any;
  @Output() DoPaginte = new EventEmitter();
  // Number of the total trainings
  @Input() totalCustomers = NumberConstant.ZERO;
  @Input() totalCards;
  @Input() cardstate;
  @Input() gridSettings;
  public customerProfileLink = TiersConstants.CUSTOMER_PROFILE_URL;

  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  defaultPictureUrl = 'assets/image/no-picture.png';
  public pictureSrc: any;
  private imageGrid = [];

  constructor(public tiersService: TiersService, protected swalWarrings: SwalWarring,
    private viewRef: ViewContainerRef, private formModalDialogService: FormModalDialogService,
    protected router: Router, protected fb: FormBuilder, public translate: TranslateService,
    protected validationService: ValidationService, protected fileServiceService: FileService, public authService: AuthService) {
    super(tiersService, router, swalWarrings, fb, translate, validationService, fileServiceService, authService);
  }

  ngOnInit() {
    this.hasShowPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_CUSTOMER);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_CUSTOMER);
    this.data.forEach((customer, index) => {
      this.getPictureSrc(customer.UrlPicture, index);
    });
  }
  paginate(event) {
    this.DoPaginte.emit(event);
  }

  /**get picture */
  getPictureSrc(UrlPicture:string, index): any {
    if(UrlPicture) {
    this.tiersService.getPicture(UrlPicture).subscribe((data)=> {
      this.pictureSrc ='data:image/png;base64,'+data;
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
  saveCustomer(data?) {
    data.isFromCard = true;
    const dataToSend = data ? data : undefined;
    const TITLE = data ? TranslationKeysConstant.EDIT_TRAINING : TranslationKeysConstant.ADD_TRAINING;
    this.formModalDialogService.openDialog(TITLE, AddTiersComponent,
      this.viewRef, this.initGridDataSource.bind(this), dataToSend, true, SharedConstant.MODAL_DIALOG_SIZE_M);
  }

  /**
  * Delete training
  */
  deleteCustomer(customer, i) {
    this.swalWarrings.CreateSwal("Supprimer ce client").then((result) => {
      if (result.value) {
        // remove the training
        this.tiersService.remove(customer).subscribe(res => {
          if (this.data.length === NumberConstant.ONE) {
            // it's about the deletion of the last element in the page
            // so we have to load the previous page after removing this element
            this.state = {
              skip: this.state.skip - this.state.take,
              take: this.totalCards,
            };
          }
          this.data.splice(i,1);
          this.initGridDataSource();
        });
      }
    });
  }
}
