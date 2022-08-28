import {EventEmitter, Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ResourceServiceJava} from '../../shared/services/resource/resource.serviceJava';
import {AppConfig} from '../../../COM/config/app.config';
import {SharedCrmConstant} from '../../constant/crm/sharedCrm.constant';
import {OpportunityConstant} from '../../constant/crm/opportunityConstant';
import {Operation} from '../../../COM/Models/operations';


@Injectable()
export class OpportunityService extends ResourceServiceJava {

  employeeListId: any[];
  public result: any;
  public oppSaved: EventEmitter<boolean> = new EventEmitter();

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfigCrm) {
    super(httpClient, appConfigCrm, SharedCrmConstant.CRM_URL, OpportunityConstant.MODULE_NAME);
  }

  getOpportunityByCategoryWithPagination(type, page, size, sort, isArchived) {
    return this.callService(Operation.GET, 'pageable/' + OpportunityConstant.OBJECT
      .concat('/').concat(type).concat('/').concat(OpportunityConstant.IS_ARCHIVED).concat(isArchived)
      .concat(`?page=${page}&size=${size}&sort=${sort}`));
  }

  getOppByIdOrganisation(id, page, size, sort, isArchived) {
    return this.callService(Operation.GET, OpportunityConstant.ORGANISATIONId_FILTER.concat(id).concat('/')
      .concat(OpportunityConstant.IS_ARCHIVED).concat(isArchived).concat(`?page=${page}&size=${size}&sort=${sort}`));
  }

  getOppByIdContact(id, page, size, sort, isArchived) {
    return this.callService(Operation.GET, OpportunityConstant.OPPORTUNITY_BY_ID_CONTACT.concat(id)
      .concat(OpportunityConstant.IS_ARCHIVED).concat(isArchived).concat(`?page=${page}&size=${size}&sort=${sort}`));
  }

  getOppByIdClientOrganisation(id, page, size, sort, isArchived) {
    return this.callService(Operation.GET, OpportunityConstant.ORGANISATIONIdClient_FILTER.concat(id).concat('/')
      .concat(OpportunityConstant.IS_ARCHIVED).concat(isArchived).concat(`?page=${page}&size=${size}&sort=${sort}`));
  }

  getOppByTypeCategory(type, page, isArchived) {
    return this.callService(Operation.GET, OpportunityConstant.TYPE_CATEGORY_FILTER
      .concat(type)
      .concat(OpportunityConstant.SEPARATOR)
      .concat(OpportunityConstant.PAGE)
      .concat(OpportunityConstant.SEPARATOR)
      .concat(page)
      .concat(OpportunityConstant.IS_ARCHIVED)
      .concat(isArchived));
  }

  getOpportunityConcernedAndResponsable(id) {
    return this.callService(Operation.GET, OpportunityConstant.LIST.concat(id));
  }

  getOpportunityByCategory(id) {
    return this.callService(Operation.GET, OpportunityConstant.OBJECT.concat(OpportunityConstant.SEPARATOR).concat(id));
  }

  convertAllOpportunitiesToClients(oppToConvert) {
    return this.callService(Operation.POST, OpportunityConstant.CONVERT_ALL_OPPORTUNITIES_OPPORTUNITY, oppToConvert);
  }

  convertFromOpportunity(contactToConvert) {
    return this.callService(Operation.POST, OpportunityConstant.CONVERT_FROM_OPPORTUNITY, contactToConvert);
  }

  opportunitiesByEmplyeeAndCategory(employeeId: any, categoryId: any) {
    return this.callService(Operation.GET, OpportunityConstant.EMPLOYEE.concat(OpportunityConstant.SEPARATOR)
      .concat(employeeId).concat(OpportunityConstant.SEPARATOR).concat(OpportunityConstant.OBJECT).concat(OpportunityConstant.SEPARATOR).concat(categoryId));
  }

  opportunitiesByCategoryAndEmplyeeForDataGrid(employeeId: any, category: any, page) {
    return this.callService(Operation.GET, OpportunityConstant.EMPLOYEE.concat(OpportunityConstant.SEPARATOR)
      .concat(employeeId).concat(OpportunityConstant.SEPARATOR).concat(OpportunityConstant.OBJECT).concat(OpportunityConstant.SEPARATOR).concat(category).concat(OpportunityConstant.SEPARATOR).concat(OpportunityConstant.PAGE).concat(OpportunityConstant.SEPARATOR).concat(page));

  }

  opportunitiesByCategoryAndEmplyeeForDataGridAndIsArchived(employeeId: any, category: any, page, isArchived) {
    return this.callService(Operation.GET, OpportunityConstant.EMPLOYEE.concat(OpportunityConstant.SEPARATOR)
      .concat(employeeId).concat(OpportunityConstant.SEPARATOR).concat(OpportunityConstant.OBJECT)
      .concat(OpportunityConstant.SEPARATOR).concat(category).concat(OpportunityConstant.SEPARATOR)
      .concat(OpportunityConstant.PAGE).concat(OpportunityConstant.SEPARATOR).concat(page)
      .concat(OpportunityConstant.IS_ARCHIVED)
      .concat(isArchived));
  }

  opportunitiesByArticleAndCategory(articleId: any, category: any) {
    return this.callService(Operation.GET, OpportunityConstant.PRODUCT.concat(OpportunityConstant.SEPARATOR)
      .concat(articleId).concat(OpportunityConstant.SEPARATOR).concat(OpportunityConstant.OBJECT).concat('/').concat(category));
  }

  opportunitiesByCategoryAndProductForDataGrid(productId: any, category: any, page, isArchived) {
    return this.callService(Operation.GET, OpportunityConstant.PRODUCT.concat(OpportunityConstant.SEPARATOR)
      .concat(productId).concat(OpportunityConstant.SEPARATOR).concat(OpportunityConstant.OBJECT)
      .concat(OpportunityConstant.SEPARATOR).concat(category).concat(OpportunityConstant.SEPARATOR)
      .concat(OpportunityConstant.PAGE).concat(OpportunityConstant.SEPARATOR).concat(page)
      .concat(OpportunityConstant.IS_ARCHIVED).concat(isArchived));
  }


  getOpportunityByCategoryAndIsArchiving(id, isArchived) {
    return this.callService(Operation.GET, OpportunityConstant.OBJECT.concat(OpportunityConstant.SEPARATOR).concat(id)
      .concat(OpportunityConstant.IS_ARCHIVED).concat(isArchived));

  }
}
