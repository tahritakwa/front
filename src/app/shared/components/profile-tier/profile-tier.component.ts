import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrencyService } from '../../../administration/services/currency/currency.service';
import { TiersService } from '../../../purchase/services/tiers/tiers.service';
import { TiersConstants } from '../../../constant/purchase/tiers.constant';
import { SwalWarring } from '../swal/swal-popup';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';

@Component({
  selector: 'app-profile-tier',
  templateUrl: './profile-tier.component.html',
  styleUrls: ['./profile-tier.component.scss']
})
export class ProfileTierComponent implements OnInit {
  tiersTypeInput: number;
  tiersType: number;
  tierInput: any;
  public tier: any;
  tiersListURL: string;
  isOpenLastArticles = false;
  @ViewChild('BackToList') backToList: ElementRef;
  hasDeleteCustomerPermission = false;
  hasCustomerListPermission = false;
  hasUpdateCustomerPermission = false;
  hasShowCustomerPermission = false;
 public hasDeleteSupllierPermission = false;
 public hasUpdateSupllierPermission = false;
 public pictureTierSrc: any;
 public hasListPermission = false;

  constructor(public tiersService: TiersService, private router: Router,
    private swalWarring: SwalWarring,
    private activatedRoute: ActivatedRoute, public currencyService: CurrencyService, private authService: AuthService) {
    this.tiersTypeInput = this.activatedRoute.snapshot.data['tiersId'];
    this.tierInput = this.activatedRoute.snapshot.data['tiersToUpdate'];
  }

  ngOnInit() {
    this.hasDeleteCustomerPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.DELETE_CUSTOMER);
    this.hasUpdateCustomerPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_CUSTOMER);
    this.hasShowCustomerPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_CUSTOMER);
    this.hasDeleteSupllierPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.DELETE_SUPPLIER);
    this.hasUpdateSupllierPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_SUPPLIER);
    this.hasCustomerListPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.LIST_CUSTOMER);

    this.tier = this.tierInput;
    this.tiersType = this.tier.IdTypeTiers;
    if(this.tiersType && this.tiersType == TiersConstants.CUSTOMER_TYPE)
    {
      this.hasListPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.LIST_CUSTOMER);
    }else if( this.tiersType && this.tiersType == TiersConstants.SUPPLIER_TYPE)
    {
      this.hasListPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.LIST_SUPPLIER);
    }
    this.tiersListURL = (this.tiersType === TiersConstants.CUSTOMER_TYPE) ? TiersConstants.CUSTOMER_LIST_URL
      : TiersConstants.SUPPLIERS_LIST_URL;
    this.getPictureTierSrc();
  }

  getPictureTierSrc() {
    if (this.tierInput.UrlPicture) {
      this.tiersService.getPicture(this.tierInput.UrlPicture).subscribe((res: any) => {
        this.pictureTierSrc = SharedConstant.PICTURE_BASE + res;
      });
    }
  }

  public goToAdvancedEdit(dataItem) {
    if (this.tiersType === TiersConstants.CUSTOMER_TYPE) {
      this.router.navigateByUrl(TiersConstants.CUSTOMER_ADVANCED_EDIT_URL
        + dataItem.Id, { queryParams: dataItem, skipLocationChange: true });

    } else {
      this.router.navigateByUrl(TiersConstants.SUPPLIER_ADVANCED_EDIT_URL
        + dataItem.Id, { queryParams: dataItem, skipLocationChange: true });
    }
  }

  deletePhone(tier) {
    const tierType = (this.tiersType === TiersConstants.CUSTOMER_TYPE) ? TiersConstants.CUSTOMER
      : TiersConstants.SUPPLIER;
    this.swalWarring.CreateDeleteSwal(tierType, TiersConstants.TIER_PRONOUN).then((result) => {
      if (result.value) {
        this.tiersService.removeTiers(tier).subscribe(res => {
          this.backToList.nativeElement.click();
        });
      }
    });
  }
  gotoLink(platform) {
    let url
    switch (platform) {
      case 'fb':
        url = SharedConstant.FACEBOOK_LINK + this.tier.Facebook;
        break;
      case 'tw':
        url = SharedConstant.TWITTER_LINK + this.tier.Twitter;
        break;
      case 'li':
        url = SharedConstant.LINKEDIN_LINK + this.tier.Linkedin;
        break;
      default:
        break;
    }
    window.open(url, '_blank');
  }

}
