import { NumberConstant } from './../../../../constant/utility/number.constant';
import { TiersService } from './../../../../purchase/services/tiers/tiers.service';
import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EnumValues } from 'enum-values';
import { CodeToNameDocument, NameDocumentLink } from '../../../../models/enumerators/document.enum';
import {isNotNullOrUndefinedAndNotEmptyValue} from '../../../../stark-permissions/utils/utils';
import {Tiers} from '../../../../models/achat/tiers.model';

@Component({
  selector: 'app-profile-tier-activities',
  templateUrl: './profile-tier-activities.component.html',
  styleUrls: ['./profile-tier-activities.component.scss']
})
export class ProfileTierActivitiesComponent implements OnInit {
  @Input() tier : Tiers;
  DocNameEnum: any;
  DocLinksEnum: any;
  DocumentList = [];
  tierType: number;


  constructor(protected translate: TranslateService,
    public tiersService: TiersService) {
    this.DocNameEnum = EnumValues.getNamesAndValues(CodeToNameDocument);
    this.DocLinksEnum = EnumValues.getNamesAndValues(NameDocumentLink);

  }

  ngOnInit() {
    this.tiersService.getActivitiesTiers(this.tier).subscribe(data => {
      this.DocumentList = data.map(x => {
        let doc = {
          Time: x.ValidationDate,
          Content: this.translate.instant(this.getDocumentType(x.DocumentType)) + ' ' + x.DocumentCode,
          SubContent: this.getActivities(x),
          MainLink: 'main/' + this.getMainLink(x.DocumentType) + '/show/' + x.DocumentId + '/' + NumberConstant.TWO
        };
        return doc;
      });
    });
    this.getTierType();
  }

  getDocumentType(DocumentType) {
    return this.DocNameEnum.filter(x => x.name === DocumentType)[0].value;
  }
  getMainLink(DocumentType) {
    return this.DocLinksEnum.filter(x => x.name === DocumentType)[0].value;
  }

  getActivities(Document) {
    const DocType = this.translate.instant(this.getDocumentType(Document.DocumentType));
    let translatedAction = this.translate.instant('ACTIVITY_VALID_MSG');
    translatedAction = this.addDetails(translatedAction, Document);
    return translatedAction;
  }
  addDetails(translatedAction: string, Document: any): any {
    let msgWithParam: string;
    msgWithParam = translatedAction.toString().replace('{USER_FULL_NAME}', Document.ValidatorName);
    return msgWithParam;
  }
  getTierType() {
    if (isNotNullOrUndefinedAndNotEmptyValue(this.tier)) {
      this.tierType = this.tier.IdTypeTiers;
    }
  }

}
