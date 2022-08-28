import { EnumValues } from 'enum-values';
import { Component, Input, OnInit } from '@angular/core';
import { TiersService } from '../../../../purchase/services/tiers/tiers.service';
import { SharedConstant } from '../../../../constant/shared/shared.constant';
import { TranslateService } from '@ngx-translate/core';
import { CodeToNameDocument } from '../../../../models/enumerators/document.enum';
import * as moment from 'moment';
import { TiersConstants } from '../../../../constant/purchase/tiers.constant';
import { isNotNullOrUndefinedAndNotEmptyValue } from '../../../../stark-permissions/utils/utils';
import { DashboardService } from '../../../../dashboard/services/dashboard.service';
import { LanguageService } from '../../../services/language/language.service';
import { UserCurrentInformationsService } from '../../../services/utility/user-current-informations.service';
import {LocalStorageService} from '../../../../login/Authentification/services/local-storage-service';

const NO_CONTACT_TO_SHOW = 'NO_CONTACT_TO_SHOW';

@Component({
  selector: 'app-profile-tier-general',
  templateUrl: './profile-tier-general.component.html',
  styleUrls: ['./profile-tier-general.component.scss']
})
export class ProfileTierGeneralComponent implements OnInit {

  @Input() tier;
  tierGeneral;
  language: string;
  seniority: string;
  lastAction = '';
  Revenue = '';
  LeftToPay = '';
  lastActionTime = '';
  DocNameEnum: any;
  public contactNoDataFound: string;
  topTierTitle = 'TOP_TIERS';
  TierRank: any;


  constructor(protected translate: TranslateService, private localStorageService : LocalStorageService,
      public tiersService: TiersService, public dashService: DashboardService) {
    this.language = this.localStorageService.getLanguage();
      moment.locale(this.language);
    this.DocNameEnum = EnumValues.getNamesAndValues(CodeToNameDocument);
    if (isNotNullOrUndefinedAndNotEmptyValue(this.tier) && this.tier.Contact.length === 0) {
      this.translateContactDataMessage();
    }
  }

  ngOnInit() {
    this.InitGeneralTab();
  }

  private translateContactDataMessage() {
    const typeId = this.tier.IdTypeTiers;
    const type = typeId === TiersConstants.SUPPLIER_TYPE ? TiersConstants.SUPPLIER : TiersConstants.CUSTOMER;
    const message = this.translate.instant(NO_CONTACT_TO_SHOW);
    this.contactNoDataFound = message.concat(this.translate.instant(type).toLowerCase());
  }

  InitGeneralTab() {
    this.topTierTitle = this.tier.IdTypeTiers === TiersConstants.SUPPLIER_TYPE ? TiersConstants.TOP_SUPPLIER : TiersConstants.TOP_CUSTOMER;
    const today = new Date();
    const creationdate = new Date(this.tier.CreationDate);
    if (this.tier.CreationDate) {
      if (creationdate.toDateString() === today.toDateString()) {
        this.seniority = this.translate.instant('TODAY');
      } else {
        this.seniority = moment(creationdate).from(today, true);
      }
    }

    this.dashService.getTierRank(this.tier.Id).subscribe(data => {
      if (data.length > 0) {
        this.TierRank = (data[0].RankByTTCAmount);
      }
    });
    this.tiersService.getGeneralTier(this.tier).subscribe(data => {
      this.tierGeneral = data;
      this.LeftToPay = this.formattoCurrency(this.tierGeneral.LeftToPay);
      this.Revenue = this.formattoCurrency(this.tierGeneral.Revenue);
      if (this.tierGeneral.LastDocumentAdded) {
        this.lastAction = this.getLastAction(this.tierGeneral);
        this.lastActionTime = moment(this.tierGeneral.LastDocumentAdded.DocumentDate).fromNow();
      }
    });
  }

  getLastAction(tierGeneral) {
    const DocType = this.translate.instant(this.getDocumentType(tierGeneral.LastDocumentAdded));
    let translatedAction = this.translate.instant('LAST_ACTION_TIER');
    translatedAction = this.addDetails(translatedAction, DocType);
    return translatedAction;
  }

  addDetails(translatedAction: string, DocType: string): any {
    let msgWithParam: string;
    msgWithParam = translatedAction.toString().replace('{Username}', this.tierGeneral.UserFullName);
    msgWithParam = msgWithParam.toString().replace('{DocumentType}', DocType);
    msgWithParam = msgWithParam.toString().replace('{DocumentCode}', this.tierGeneral.LastDocumentAdded.Code);
    return msgWithParam;
  }

  getDocumentType(LastDocumentAdded) {
    return this.DocNameEnum.filter(x => x.name === LastDocumentAdded.DocumentTypeCode)[0].value;
  }

  formattoCurrency(value = 0) {
    const valueFormatted = value.toLocaleString('fr-FR', {
      style: 'currency',
      currency: this.tier.IdCurrencyNavigation.Code,
      minimumFractionDigits: this.tier.IdCurrencyNavigation.Precision
    });
    return valueFormatted;
  }

  pictureTierSrc(tiers) {
    if (tiers.PictureFileInfo) {
      return SharedConstant.PICTURE_BASE + tiers.PictureFileInfo.Data;
    }
  }
}
