import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ResourceServiceJava} from '../../../shared/services/resource/resource.serviceJava';
import {AppConfig} from '../../../../COM/config/app.config';
import {ClaimType} from '../../../models/crm/enums/claimType.enum';
import {TiersService} from '../../../purchase/services/tiers/tiers.service';
import {GenericCrmService} from '../../generic-crm.service';
import {NumberConstant} from '../../../constant/utility/number.constant';

@Injectable()
export class ClaimCrmService extends ResourceServiceJava {
  constructor(private tiersService: TiersService, private genericCrmService: GenericCrmService,
              @Inject(HttpClient) httpClient, @Inject(AppConfig) appConfigCrm) {
    super(httpClient, appConfigCrm, 'crm', 'claim');
  }

  public setAllClaimsOrganizationName(_data) {
    const idTiers: number [] = [];
    this.getIdsTiers(_data, idTiers);
    if (idTiers.length > NumberConstant.ZERO) {
      this.tiersService.getTiersListByArray(idTiers).subscribe(claims => {
        for (const claim of _data.claimDtoList) {
          if (claim.claimType === ClaimType.CLIENT) {
            const filteredClaim = claims.filter(claimToSearch => claimToSearch.Id === claim.idClientOrganization)[0];
            if (filteredClaim && filteredClaim.Name) {
              claim.organizationName = filteredClaim.Name;
            }
          }
        }
      });
    }
  }

  public getIdsTiers(_data, idTiers: any[]) {
    for (const claim of _data.claimDtoList) {
      if (claim.claimType === ClaimType.CLIENT && !this.genericCrmService.isNullOrUndefinedOrEmpty(claim.idClientOrganization)) {
        idTiers.push(claim.idClientOrganization);
      }
    }
  }
}
