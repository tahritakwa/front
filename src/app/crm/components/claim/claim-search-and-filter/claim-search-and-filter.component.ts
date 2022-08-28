import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {ClaimsFilterEnum} from '../../../../models/crm/enums/claimsFilter.enum';
import {EnumValues} from 'enum-values';
import {ClaimsGravityEnum} from '../../../../models/crm/enums/claimsGravity.enum';
import {ClaimsCategoryEnum} from '../../../../models/crm/enums/claimsCategory.enum';
import {ClaimCrmService} from '../../../services/claim/claim.service';
import {OrganisationService} from '../../../services/organisation/organisation.service';
import {TranslateService} from '@ngx-translate/core';
import {Operation} from '../../../../../COM/Models/operations';
import {NumberConstant} from '../../../../constant/utility/number.constant';
import {ClaimConstants} from '../../../../constant/crm/claim.constant';
import {Organisation} from '../../../../models/crm/organisation.model';
import {TiersService} from '../../../../purchase/services/tiers/tiers.service';
import {AddNewOpportunityComponent} from '../../opportunity/add-new-opportunity/add-new-opportunity.component';
import {ClaimType} from '../../../../models/crm/enums/claimType.enum';
import {ClaimConstant} from '../../../../constant/helpdesk/claim.constant';
import {Filter} from '../../../../models/crm/Filter';

@Component({
  selector: 'app-claim-search-and-filter',
  templateUrl: './claim-search-and-filter.component.html',
  styleUrls: ['./claim-search-and-filter.component.scss']
})
export class ClaimSearchAndFilterComponent implements OnInit, OnChanges {

  @Input() public dataFromKendo;
  @Input() public page;
  @Output() sendData: EventEmitter<any> = new EventEmitter<any>();
  @Input() isArchivingMode: boolean;
  @Input() filters: Array<Filter>;


  public claimsResultOfSearch;
  public claimsResultOfFilter;

  public gravitiesList = [];
  public categoriesList = [];
  public organizationsList = [];

  public dataToSearchWith;

  public claimsFilter = ClaimsFilterEnum;
  public chosenFilterNumber: number = ClaimsFilterEnum.ALL_CLAIMS;
  public chosenFilterLabel = ClaimsFilterEnum[ClaimsFilterEnum.ALL_CLAIMS];
  private filterValue;
  public ALL_GRAVITIES = this.translate.instant('ALL_GRAVITIES');
  public ALL_ORGANISATION = this.translate.instant('ALL_ORGANISATION');
  public ALL_CATEGORIES = this.translate.instant('ALL_CATEGORIES');
  public selectAllOrganization: Organisation = new Organisation(null, this.translate.instant(this.ALL_ORGANISATION));

  constructor(private claimService: ClaimCrmService, private organizationsService: OrganisationService,
              private translate: TranslateService, private tiersService: TiersService) {

  }

  ngOnInit() {
    this.initCategoriesDopDown();
    this.initGravitiesDropDown();
    this.initOrganizationsDropDown();
  }

  ngOnChanges() {
    if ((this.page + NumberConstant.ONE)) {
      this.search();
    }
  }

  filter(chosenFilter) {
    this.chosenFilterNumber = this.claimsFilter.ALL_CLAIMS;
    switch (chosenFilter) {
      case this.claimsFilter.ALL_CLAIMS : {
        this.chosenFilterLabel = ClaimsFilterEnum[ClaimsFilterEnum.ALL_CLAIMS];
        if (this.dataToSearchWith) {
          this.searchWithNoFilter();
        } else {
          this.sendData.emit(this.dataFromKendo);
        }
      }
        break;
      case this.claimsFilter.BY_GRAVITY : {
        this.chosenFilterLabel = ClaimsFilterEnum[ClaimsFilterEnum.BY_GRAVITY];
      }
        break;
      case this.claimsFilter.BY_TYPE : {
        this.chosenFilterLabel = ClaimsFilterEnum[ClaimsFilterEnum.BY_TYPE];
      }
        break;
      case this.claimsFilter.BY_ORGANIZATION: {
        this.getIdsClientOrganizationRelatedToClientClaim();
        this.chosenFilterLabel = ClaimsFilterEnum[ClaimsFilterEnum.BY_ORGANIZATION];
      }
        break;
    }
  }

  initGravitiesDropDown() {
    this.gravitiesList = EnumValues.getNamesAndValues(ClaimsGravityEnum);
  }

  filterByGravity(chosenGravity) {
    this.chosenFilterNumber = this.claimsFilter.BY_GRAVITY;
    this.filterValue = chosenGravity;
    if (this.dataToSearchWith) {
      this.searchWithGravityFilter(chosenGravity);
    } else {
      this.onlyFilterByGravity(chosenGravity);
    }
  }

  private onlyFilterByGravity(chosenGravity) {
    if (this.filterValue !== this.ALL_GRAVITIES) {
      this.filterByGravityWithoutSearch(chosenGravity);
    } else {
      this.sendData.emit(this.dataFromKendo);
    }
  }

  private searchWithGravityFilter(chosenGravity) {
    if (this.filterValue !== this.ALL_GRAVITIES) {
      this.searchAndFilterByGravity(chosenGravity);
    } else {
      this.searchWithNoFilter();
    }
  }

  private filterByGravityWithoutSearch(chosenGravity) {
    this.claimService.callService(Operation.GET, ClaimConstants.BY_GRAVITY + chosenGravity.name + ClaimConstants._SEARCH
      + ClaimConstants.NO +  ClaimConstant.ARCHIVED + this.isArchivingMode + ClaimConstants.PAGE + this.getPage()).subscribe((_data) => {
      if (_data) {
        this.claimService.setAllClaimsOrganizationName(_data);
        this.claimsResultOfFilter = {value: true, data: _data.claimDtoList, totalElements: _data.totalElements, filter: 'Gravity'};
        this.sendData.emit(this.claimsResultOfFilter);
      }
    });
  }

  private searchAndFilterByGravity(chosenGravity) {
    this.claimService.callService(Operation.GET, ClaimConstants.BY_GRAVITY + chosenGravity.name + ClaimConstants._SEARCH
      + this.dataToSearchWith  +  ClaimConstant.ARCHIVED + this.isArchivingMode + ClaimConstants.PAGE + this.getPage())
      .subscribe((_data) => {
      if (_data) {
        this.claimService.setAllClaimsOrganizationName(_data);
        this.claimsResultOfFilter = {value: true, data: _data.claimDtoList, totalElements: _data.totalElements, filter: 'Gravity'};
        this.sendData.emit(this.claimsResultOfFilter);
      }
    });
  }

  initCategoriesDopDown() {
    this.categoriesList = EnumValues.getNamesAndValues(ClaimsCategoryEnum);
  }

  filterByCategory(chosenCategory) {
    this.chosenFilterNumber = this.claimsFilter.BY_TYPE;
    this.filterValue = chosenCategory;
    if (this.dataToSearchWith) {
      this.searchAndFilterByCategory(chosenCategory);
    } else {
      this.onlyFilterByCategory(chosenCategory);
    }
  }

  private onlyFilterByCategory(chosenCategory) {
    if (this.filterValue !== this.ALL_CATEGORIES) {
      this.filterWithoutSearch(chosenCategory);
    } else {
      this.sendData.emit(this.dataFromKendo);
    }
  }

  private filterWithoutSearch(chosenCategory) {
    this.claimService.callService(Operation.GET, ClaimConstants.BY_CATEGORY + chosenCategory.name + ClaimConstants._SEARCH
      + ClaimConstants.NO  +  ClaimConstant.ARCHIVED + this.isArchivingMode + ClaimConstants.PAGE + this.getPage()).subscribe((_data) => {
      if (_data) {
        this.claimService.setAllClaimsOrganizationName(_data);
        this.claimsResultOfFilter = {value: true, data: _data.claimDtoList, totalElements: _data.totalElements, filter: 'Category'};
        this.sendData.emit(this.claimsResultOfFilter);
      }
    });
  }

  private searchAndFilterByCategory(chosenCategory) {
    if (this.filterValue !== this.ALL_CATEGORIES) {
      this.searchWithCategoryFilter(chosenCategory);
    } else {
      this.searchWithNoFilter();
    }
  }

  private searchWithCategoryFilter(chosenCategory) {
    this.claimService.callService(Operation.GET, ClaimConstants.BY_CATEGORY + chosenCategory.name + ClaimConstants._SEARCH
      + this.dataToSearchWith  +  ClaimConstant.ARCHIVED + this.isArchivingMode  + ClaimConstants.PAGE + this.getPage())
      .subscribe((_data) => {
      if (_data) {
        this.claimService.setAllClaimsOrganizationName(_data);
        this.claimsResultOfFilter = {value: true, data: _data.claimDtoList, totalElements: _data.totalElements, filter: 'Category'};
        this.sendData.emit(this.claimsResultOfFilter);
      }
    });
  }

  initOrganizationsDropDown() {
    this.organizationsList = [];
    this.organizationsService.getJavaGenericService().getEntityList(ClaimConstants.RELATED_TO_CLAIM).subscribe((data) => {
      this.organizationsList = this.organizationsList.concat(data);
    });
  }
  private getIdsClientOrganizationRelatedToClientClaim() {
    this.claimService.callService(Operation.GET, ClaimConstants.BY_ID_CLIENT).subscribe(data => {
      this.tiersService.getTiersListByArray(data).subscribe((tiers) => {
        tiers.forEach(tiersDetail => {
          this.organizationsList.push(this.convertClientToOrganisation(tiersDetail));
        });
      });
    });
  }
  convertClientToOrganisation(client): Organisation {
    return new Organisation(client.Id, client.Name, client.Email, client.Phone,
      client.Adress, client.Description, client.Fax1, client.Linkedin, client.Facebook, client.Twitter,
      null, null, this.translate.instant(AddNewOpportunityComponent.TRANSLATE_CUSTOMER), client.Id);
  }
  filterByOrganization(chosenOrganization) {
    this.chosenFilterNumber = this.claimsFilter.BY_ORGANIZATION;
    this.filterValue = chosenOrganization;
    if (this.dataToSearchWith) {
      this.filterAndSearch(chosenOrganization);
    } else {
      this.onlyFilterByOrganization(chosenOrganization);
    }
  }

  private onlyFilterByOrganization(chosenOrganization) {
    if (this.filterValue.id !== null) {
      this.checkTypeAndFilter(chosenOrganization);
    } else {
      this.sendData.emit(this.dataFromKendo);
    }
  }

  private checkTypeAndFilter(chosenOrganization) {
    if (chosenOrganization.idClient) {
      this.searchWithoutFilteringByOrganization(chosenOrganization, ClaimType.CLIENT);
    } else {
      this.searchWithoutFilteringByOrganization(chosenOrganization, ClaimType.PROSPECT);
    }
  }

  private searchWithoutFilteringByOrganization(chosenOrganization , type) {
    this.claimService.callService(Operation.GET, ClaimConstants.BY_ORGANISATION + chosenOrganization.id + ClaimConstants.TYPE +
       type + ClaimConstants._SEARCH + ClaimConstants.NO + ClaimConstant.ARCHIVED + this.isArchivingMode +
      ClaimConstants.PAGE + this.getPage()).subscribe((_data) => {
      if (_data) {
        this.claimService.setAllClaimsOrganizationName(_data);
        this.claimsResultOfFilter = {value: true, data: _data.claimDtoList, totalElements: _data.totalElements, filter: 'Organisation'};
        this.sendData.emit(this.claimsResultOfFilter);
      }
    });
  }
  private filterAndSearch(chosenOrganization) {
    if (this.filterValue.id !== null) {
      if (chosenOrganization.idClient) {
        this.searchAndFilterByOrganization(chosenOrganization, ClaimType.CLIENT);
      } else {
        this.searchAndFilterByOrganization(chosenOrganization, ClaimType.PROSPECT);
      }
    } else {
      this.searchWithNoFilter();
    }
  }

  private searchAndFilterByOrganization(chosenOrganization, type) {
    this.claimService.callService(Operation.GET, ClaimConstants.BY_ORGANISATION + chosenOrganization.id
      + ClaimConstants.TYPE + type + ClaimConstants._SEARCH + this.dataToSearchWith + ClaimConstant.ARCHIVED + this.isArchivingMode +
      ClaimConstants.PAGE + this.getPage()).subscribe((_data) => {
      if (_data) {
        this.claimService.setAllClaimsOrganizationName(_data);
        this.claimsResultOfFilter = {value: true, data: _data.claimDtoList, totalElements: _data.totalElements, filter: 'Organisation'};
        this.sendData.emit(this.claimsResultOfFilter);
      }
    });
  }

  search() {
    switch (this.chosenFilterNumber) {
      case ClaimsFilterEnum.BY_GRAVITY: {
        this.filterByGravity(this.filterValue);
        break;
      }
      case ClaimsFilterEnum.BY_TYPE: {
        this.filterByCategory(this.filterValue);
        break;
      }
      case ClaimsFilterEnum.BY_ORGANIZATION: {
        this.filterByOrganization(this.filterValue);
        break;
      }
      default : {
        this.dataToSearchWith ? this.searchWithNoFilter() : this.sendData.emit(this.dataFromKendo);
        break;
      }
    }
  }

  searchWithNoFilter() {
    this.claimService.callService(Operation.GET, ClaimConstants.SEARCH + this.dataToSearchWith +
      ClaimConstant.ARCHIVED + this.isArchivingMode + ClaimConstants.PAGE + this.getPage()).subscribe((_data) => {
      if (_data) {
        this.claimService.setAllClaimsOrganizationName(_data);
        this.claimsResultOfSearch = {value: true, data: _data.claimDtoList, totalElements: _data.totalElements, filter: 'Search'};
        this.sendData.emit(this.claimsResultOfSearch);
      }
    });
  }
  getPage() {
    return this.page ? ((this.page / NumberConstant.TEN ) + NumberConstant.ONE) : (this.page  + NumberConstant.ONE) ;
  }
}
