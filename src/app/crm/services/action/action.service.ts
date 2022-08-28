import {Inject, Injectable, Input} from '@angular/core';
import {ResourceServiceJava} from '../../../shared/services/resource/resource.serviceJava';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../../COM/config/app.config';
import {Observable} from 'rxjs/Observable';
import {Operation} from '../../../../COM/Models/operations';
import {ActionConstant} from '../../../constant/crm/action.constant';

@Injectable()
export class ActionService extends ResourceServiceJava {

   public isArchivingMode = false;
   public fromRelatedArchiving = false;

  constructor(@Inject(HttpClient) httpClient, private httpClients: HttpClient, @Inject(AppConfig) appConfigCrm) {
    super(httpClient, appConfigCrm, 'crm', 'action');
  }

  public setArchivingModes(isArchivingMode: boolean, fromRelatedArchiving?: boolean) {
    this.isArchivingMode = isArchivingMode;
    this.fromRelatedArchiving = fromRelatedArchiving;
  }
  getIsArchivingMode() {
    return this.isArchivingMode;
  }

  getFromRelatedArchiving() {
    return this.fromRelatedArchiving;
  }
  resetArchivingMode() {
    this.isArchivingMode = false;
    this.fromRelatedArchiving = false;
  }
  public getAllActions(page, size, isArchived,sort): Observable<any> {
    return this.callService(Operation.GET, '/allActions/isArchived/' + isArchived + `?page=${page}&size=${size}&sort=${sort}`);
  }

  public getActionsBySearchValue(searchValue, page, size, isArchived): Observable<any> {
    return this.callService(Operation.GET, ActionConstant.SEARCH + searchValue + ActionConstant.IS_ARCHIVED + isArchived + `?page=${page}&size=${size}`);
  }


  public getUpcomingActionBySearchValue(searchValue, page, size, isArchived): Observable<any> {
    return this.callService(Operation.GET, ActionConstant.SEARCH + searchValue + ActionConstant.UPCOMING_ACTIONS +
      ActionConstant.IS_ARCHIVED + isArchived + `?page=${page}&size=${size}`);
  }

  public getContactUpcomingActionBySearchValue(searchValue, contactId, page, size, isArchived): Observable<any> {
    return this.callService(Operation.GET, ActionConstant.SEARCH + searchValue + ActionConstant.UPCOMING_ACTIONS
      + ActionConstant.CONTACT_PATH + contactId + ActionConstant.IS_ARCHIVED + isArchived + `?page=${page}&size=${size}`);
  }

  public getUpcomingActionBySearchValueAndCommercial(searchValue, page, size, commercialId, isArchived): Observable<any> {
    return this.callService(Operation.GET, ActionConstant.SEARCH + searchValue + ActionConstant.UPCOMING_ACTIONS
      + ActionConstant.IS_ARCHIVED + isArchived + `?page=${page}&size=${size}`);
  }

  public getContactUpcomingActionBySearchValueAndCommercial(searchValue, page, size, commercialId, contactId, isArchived): Observable<any> {
    return this.callService(Operation.GET, ActionConstant.SEARCH + searchValue + ActionConstant.UPCOMING_ACTIONS +
      ActionConstant.COMMERCIAL_ID + commercialId + ActionConstant.CONTACT_PATH + contactId
      + ActionConstant.IS_ARCHIVED + isArchived + `?page=${page}&size=${size}`);
  }

  public getPreviousActionBySearchValue(searchValue, page, size, isArchived): Observable<any> {
    return this.callService(Operation.GET, ActionConstant.SEARCH + searchValue + ActionConstant.PREVIOUS_ACTIONS +
      +ActionConstant.IS_ARCHIVED + isArchived + `?page=${page}&size=${size}`);
  }

  public getPreviousContactActionBySearchValue(searchValue, contactId, page, size, isArchived): Observable<any> {
    return this.callService(Operation.GET, ActionConstant.SEARCH + searchValue + ActionConstant.PREVIOUS_ACTIONS
      + ActionConstant.CONTACT_PATH + contactId + ActionConstant.IS_ARCHIVED + isArchived + `?page=${page}&size=${size}`);
  }

  public getPreviousActionBySearchValueAndCommercial(searchValue, page, size, commercialId, isArchived): Observable<any> {
    return this.callService(Operation.GET, ActionConstant.SEARCH + searchValue + ActionConstant.PREVIOUS_ACTIONS +
      ActionConstant.IS_ARCHIVED + isArchived + `?page=${page}&size=${size}`);
  }

  public getContactPreviousActionBySearchValueAndCommercial(searchValue, page, size, commercialId, contactId, isArchived): Observable<any> {
    return this.callService(Operation.GET, ActionConstant.SEARCH + searchValue + ActionConstant.PREVIOUS_ACTIONS
      + ActionConstant.CONTACT_PATH + contactId + ActionConstant.IS_ARCHIVED + isArchived + `?page=${page}&size=${size}`);
  }

  public getUpcomingActions(page, size, isArchived): Observable<any> {
    return this.callService(Operation.GET, ActionConstant.UPCOMING_ACTIONS +
      ActionConstant.IS_ARCHIVED + isArchived + `?page=${page}&size=${size}`);
  }

  public getContactUpcomingActions(contactId, page, size, isArchived): Observable<any> {
    return this.callService(Operation.GET, ActionConstant.UPCOMING_ACTIONS + ActionConstant.CONTACT_PATH + contactId
      + ActionConstant.IS_ARCHIVED + isArchived + `?page=${page}&size=${size}`);
  }

  public getUpcomingActionByCommercial(commercialId, page, size, isArchived): Observable<any> {
    return this.callService(Operation.GET, ActionConstant.COMMERCIAL_ID + commercialId + ActionConstant.UPCOMING_ACTIONS
      + ActionConstant.IS_ARCHIVED + isArchived + `?page=${page}&size=${size}`);
  }

  public getContactUpcomingActionByCommercial(commercialId, contactId, page, size, isArchived): Observable<any> {
    return this.callService(Operation.GET, ActionConstant.COMMERCIAL_ID + commercialId + ActionConstant.UPCOMING_ACTIONS
      + ActionConstant.CONTACT_PATH + contactId + ActionConstant.IS_ARCHIVED + isArchived + `?page=${page}&size=${size}`);
  }

  public getPreviousActions(page, size, isArchived): Observable<any> {
    return this.callService(Operation.GET, ActionConstant.PREVIOUS_ACTIONS + ActionConstant.IS_ARCHIVED + isArchived +
      `?page=${page}&size=${size}`);
  }

  public getContactPreviousActions(contactId, page, size, isArchived): Observable<any> {
    return this.callService(Operation.GET, ActionConstant.PREVIOUS_ACTIONS +
      ActionConstant.CONTACT_PATH + contactId + ActionConstant.IS_ARCHIVED + isArchived + `?page=${page}&size=${size}`);
  }

  public getPreviousActionsCommercial(commercialId, page, size, isArchived): Observable<any> {
    return this.callService(Operation.GET, ActionConstant.COMMERCIAL_ID + commercialId + ActionConstant.PREVIOUS_ACTIONS +
      ActionConstant.IS_ARCHIVED + isArchived + `?page=${page}&size=${size}`);
  }

  public getPreviousContactActionsCommercial(commercialId, contactId, page, size, isArchived): Observable<any> {
    return this.callService(Operation.GET, ActionConstant.COMMERCIAL_ID + commercialId + ActionConstant.PREVIOUS_ACTIONS +
      ActionConstant.CONTACT_PATH + contactId + ActionConstant.IS_ARCHIVED + isArchived + `?page=${page}&size=${size}`);
  }

  public getSearchedAndFilteredByOpportunityIdActions(searchValue, opportunityId, page, size, isArchived): Observable<any> {
    return this.callService(Operation.GET, ActionConstant.SEARCH + searchValue +
      ActionConstant.OPPORTUNITY_ID + opportunityId + ActionConstant.IS_ARCHIVED + isArchived + `?page=${page}&size=${size}`);
  }

  public getSearchedAndFilteredByOpportunityIdActionsContact(searchValue, opportunityId, contactId, page, size, isArchived): Observable<any> {
    return this.callService(Operation.GET, ActionConstant.SEARCH + searchValue +
      ActionConstant.OPPORTUNITY_ID + opportunityId + ActionConstant.CONTACT_PATH + contactId + ActionConstant.IS_ARCHIVED + isArchived
      + `?page=${page}&size=${size}`);
  }

  public getFilteredByOpportunityIdActions(opportunityId, page, size, isArchived): Observable<any> {
    return this.callService(Operation.GET, ActionConstant.OPPORTUNITY_ID + opportunityId +
      ActionConstant.IS_ARCHIVED + isArchived + `?page=${page}&size=${size}`);
  }

  public getFilteredByOpportunityIdActionsContact(opportunityId, contactId, page, size, isArchived): Observable<any> {
    return this.callService(Operation.GET, ActionConstant.OPPORTUNITY_ID + opportunityId +
      ActionConstant.CONTACT_PATH + contactId + ActionConstant.IS_ARCHIVED + isArchived + `?page=${page}&size=${size}`);
  }

  public getSearchedAndFilteredByOpportunityIdAndCommercialIdActions(searchValue, opportunityId, commercialId, page, size, isArchived): Observable<any> {
    return this.callService(Operation.GET, ActionConstant.SEARCH + searchValue + ActionConstant.OPPORTUNITY_ID + opportunityId +
      ActionConstant.COMMERCIAL_ID + commercialId + ActionConstant.IS_ARCHIVED + isArchived + `?page=${page}&size=${size}`);
  }

  public getSearchedAndFilteredByOpportunityIdAndCommercialIdActionsContact(searchValue, opportunityId, commercialId, contactId,
                                                                            page, size, isArchived): Observable<any> {
    return this.callService(Operation.GET, ActionConstant.SEARCH + searchValue + ActionConstant.OPPORTUNITY_ID + opportunityId +
      ActionConstant.COMMERCIAL_ID + commercialId + ActionConstant.CONTACT_PATH + contactId +
      ActionConstant.IS_ARCHIVED + isArchived + `?page=${page}&size=${size}`);
  }

  public getFilteredByOpportunityIdAndCommercialIdActions(opportunityId, commercialId, page, size, isArchived): Observable<any> {
    return this.callService(Operation.GET, ActionConstant.OPPORTUNITY_ID + opportunityId +
      ActionConstant.COMMERCIAL_ID + commercialId + ActionConstant.IS_ARCHIVED + isArchived + `?page=${page}&size=${size}`);
  }

  public getFilteredByOpportunityIdAndCommercialIdActionsContact(opportunityId, commercialId, contactId,
                                                                 page, size, isArchived): Observable<any> {
    return this.callService(Operation.GET, ActionConstant.OPPORTUNITY_ID + opportunityId +
      ActionConstant.COMMERCIAL_ID + commercialId + ActionConstant.CONTACT_PATH + contactId +
      ActionConstant.IS_ARCHIVED + isArchived + `?page=${page}&size=${size}`);
  }

  public getSearchedAndFilteredByContactIdActions(searchValue, contactId, page, size, isArchived): Observable<any> {
    return this.callService(Operation.GET, ActionConstant.SEARCH + searchValue +
      ActionConstant.CONTACT_ID + contactId + ActionConstant.IS_ARCHIVED + isArchived + `?page=${page}&size=${size}`);
  }

  public getFilteredByContactIdActions(contactId, page, size, isArchived): Observable<any> {
    return this.callService(Operation.GET, ActionConstant.CONTACT_ID + contactId + ActionConstant.IS_ARCHIVED +
      isArchived + `?page=${page}&size=${size}`);
  }

  public getSearchedAndFilteredByContactIdAndCommercialIdActions(searchValue, contactId, commercialId,
                                                                 page, size, isArchived): Observable<any> {
    return this.callService(Operation.GET, ActionConstant.SEARCH + searchValue + ActionConstant.CONTACT_ID + contactId +
      ActionConstant.COMMERCIAL_ID + commercialId + ActionConstant.IS_ARCHIVED + isArchived + `?page=${page}&size=${size}`);
  }

  public getFilteredByContactIdAndCommercialIdActions(contactId, commercialId, page, size, isArchived): Observable<any> {
    return this.callService(Operation.GET, ActionConstant.CONTACT_ID + contactId +
      ActionConstant.COMMERCIAL_ID + commercialId + ActionConstant.IS_ARCHIVED + isArchived + `?page=${page}&size=${size}`);
  }


  public getSearchedAndFilteredByOrganizationIdActions(searchValue, organizationId, page, size, isArchived): Observable<any> {
    return this.callService(Operation.GET, ActionConstant.SEARCH + searchValue +
      ActionConstant.ORGANIZATION_ID + organizationId + ActionConstant.IS_ARCHIVED + isArchived + `?page=${page}&size=${size}`);
  }

  public getFilteredByOrganizationIdActions(organizationId, page, size, isArchived): Observable<any> {
    return this.callService(Operation.GET, ActionConstant.ORGANIZATION_ID + organizationId
      + ActionConstant.IS_ARCHIVED + isArchived + `?page=${page}&size=${size}`);
  }

  public getSearchedAndFilteredByOrganizationIdAndCommercialIdActions(searchValue, organizationId,
                                                                      commercialId, page, size,
                                                                      isArchived): Observable<any> {
    return this.callService(Operation.GET, ActionConstant.SEARCH + searchValue + ActionConstant.ORGANIZATION_ID + organizationId +
      ActionConstant.COMMERCIAL_ID + commercialId + ActionConstant.IS_ARCHIVED + isArchived + `?page=${page}&size=${size}`);
  }

  public getFilteredOrganizationIdAndCommercialIdActions(organizationId, commercialId, page, size, isArchived): Observable<any> {
    return this.callService(Operation.GET, ActionConstant.ORGANIZATION_ID + organizationId +
      ActionConstant.COMMERCIAL_ID + commercialId + ActionConstant.IS_ARCHIVED + isArchived
      + `?page=${page}&size=${size}`);
  }

  public getSearchedAndFilteredByStateActions(searchValue, state, page, size, isArchived): Observable<any> {
    return this.callService(Operation.GET, ActionConstant.SEARCH + searchValue +
      ActionConstant.STATE + state + ActionConstant.IS_ARCHIVED + isArchived + `?page=${page}&size=${size}`);
  }

  public getSearchedAndFilteredByPriorityActions(searchValue, priority, page, size, isArchived): Observable<any> {
    return this.callService(Operation.GET, ActionConstant.SEARCH + searchValue +
      ActionConstant.PRIORITY_PATH + priority + ActionConstant.IS_ARCHIVED + isArchived + `?page=${page}&size=${size}`);
  }

  public getSearchedAndFilteredByStateContactActions(searchValue, state, contactId, page, size, isArchived): Observable<any> {
    return this.callService(Operation.GET, ActionConstant.SEARCH + searchValue +
      ActionConstant.STATE + state + ActionConstant.CONTACT_PATH + contactId + ActionConstant.IS_ARCHIVED + isArchived
      + `?page=${page}&size=${size}`);
  }
  public getSearchedAndFilteredByPriorityContactActions(searchValue, priority, contactId, page, size, isArchived): Observable<any> {
    return this.callService(Operation.GET, ActionConstant.SEARCH + searchValue +
      ActionConstant.PRIORITY_PATH + priority + ActionConstant.CONTACT_PATH + contactId + ActionConstant.IS_ARCHIVED + isArchived
      + `?page=${page}&size=${size}`);
  }

  public getFilteredByStateActions(state, page, size, isArchived): Observable<any> {
    return this.callService(Operation.GET,
      ActionConstant.STATE + state + ActionConstant.IS_ARCHIVED + isArchived + `?page=${page}&size=${size}`);
  }

  public getFilteredByPriorityActions(priority, page, size, isArchived): Observable<any> {
    return this.callService(Operation.GET,
      ActionConstant.PRIORITY_PATH + priority + ActionConstant.IS_ARCHIVED + isArchived + `?page=${page}&size=${size}`);
  }

  public getFilteredByStateContactActions(state, contactId, page, size, isArchived): Observable<any> {
    return this.callService(Operation.GET,
      ActionConstant.STATE + state + ActionConstant.CONTACT_PATH + contactId +
      ActionConstant.IS_ARCHIVED + isArchived + `?page=${page}&size=${size}`);
  }

  public getFilteredByPriorityContactActions(priority, contactId, page, size, isArchived): Observable<any> {
    return this.callService(Operation.GET,
      ActionConstant.PRIORITY_PATH + priority + ActionConstant.CONTACT_PATH + contactId +
      ActionConstant.IS_ARCHIVED + isArchived + `?page=${page}&size=${size}`);
  }

  public getSearchedAndFilteredByStateAndCommercialIdActions(searchValue, state, commercialId, page, size, isArchived): Observable<any> {
    return this.callService(Operation.GET, ActionConstant.SEARCH + searchValue + ActionConstant.STATE + state +
      ActionConstant.COMMERCIAL_ID + commercialId + ActionConstant.IS_ARCHIVED + isArchived + `?page=${page}&size=${size}`);
  }

  public getSearchedAndFilteredByPriorityAndCommercialIdActions(searchValue, priority, commercialId, page, size, isArchived): Observable<any> {
    return this.callService(Operation.GET, ActionConstant.SEARCH + searchValue + ActionConstant.PRIORITY_PATH + priority +
      ActionConstant.COMMERCIAL_ID + commercialId + ActionConstant.IS_ARCHIVED + isArchived + `?page=${page}&size=${size}`);
  }

  public getSearchedAndFilteredByStateAndCommercialIdActionsContact(searchValue, state, commercialId,
                                                                    contactId, page, size, isArchived): Observable<any> {
    return this.callService(Operation.GET, ActionConstant.SEARCH + searchValue + ActionConstant.STATE + state +
      ActionConstant.COMMERCIAL_ID + commercialId + ActionConstant.CONTACT_PATH + contactId +
      ActionConstant.IS_ARCHIVED + isArchived + `?page=${page}&size=${size}`);
  }

  public getSearchedAndFilteredByPriorityAndCommercialIdActionsContact(searchValue, priority, commercialId,
                                                                    contactId, page, size, isArchived): Observable<any> {
    return this.callService(Operation.GET, ActionConstant.SEARCH + searchValue + ActionConstant.PRIORITY_PATH + priority +
      ActionConstant.COMMERCIAL_ID + commercialId + ActionConstant.CONTACT_PATH + contactId +
      ActionConstant.IS_ARCHIVED + isArchived + `?page=${page}&size=${size}`);
  }

  public getFilteredByStateAndCommercialIdActions(state, commercialId, page, size, isArchived): Observable<any> {
    return this.callService(Operation.GET, ActionConstant.STATE + state +
      ActionConstant.COMMERCIAL_ID + commercialId + ActionConstant.IS_ARCHIVED + isArchived + `?page=${page}&size=${size}`);
  }

  public getFilteredByPriorityAndCommercialIdActions(priority, commercialId, page, size, isArchived): Observable<any> {
    return this.callService(Operation.GET, ActionConstant.PRIORITY_PATH + priority +
      ActionConstant.COMMERCIAL_ID + commercialId + ActionConstant.IS_ARCHIVED + isArchived + `?page=${page}&size=${size}`);
  }

  public getFilteredByStateAndCommercialIdActionsContact(state, commercialId, contactId, page, size, isArchived): Observable<any> {
    return this.callService(Operation.GET, ActionConstant.STATE + state +
      ActionConstant.COMMERCIAL_ID + commercialId + ActionConstant.CONTACT_PATH + contactId +
      ActionConstant.IS_ARCHIVED + isArchived + `?page=${page}&size=${size}`);
  }

  public getFilteredByPriorityAndCommercialIdActionsContact(priority, commercialId, contactId, page, size, isArchived): Observable<any> {
    return this.callService(Operation.GET, ActionConstant.PRIORITY_PATH + priority +
      ActionConstant.COMMERCIAL_ID + commercialId + ActionConstant.CONTACT_PATH + contactId +
      ActionConstant.IS_ARCHIVED + isArchived + `?page=${page}&size=${size}`);
  }

  public getSearchedAndFilteredByTypeActions(searchValue, type, page, size, isArchived): Observable<any> {
    return this.callService(Operation.GET, ActionConstant.SEARCH + searchValue +
      ActionConstant.TYPE + type + ActionConstant.IS_ARCHIVED + isArchived + `?page=${page}&size=${size}`);
  }

  public getSearchedAndFilteredByTypeActionsContact(searchValue, type, contactId, page, size, isArchived): Observable<any> {
    return this.callService(Operation.GET, ActionConstant.SEARCH + searchValue +
      ActionConstant.TYPE + type + ActionConstant.CONTACT_PATH + contactId +
      ActionConstant.IS_ARCHIVED + isArchived + `?page=${page}&size=${size}`);
  }

  public getFilteredByTypeActions(type, page, size, isArchived): Observable<any> {
    return this.callService(Operation.GET,
      ActionConstant.TYPE + type + ActionConstant.IS_ARCHIVED + isArchived + `?page=${page}&size=${size}`);
  }

  public getFilteredByTypeActionsContact(type, contactId, page, size, isArchived): Observable<any> {
    return this.callService(Operation.GET,
      ActionConstant.TYPE + type + ActionConstant.CONTACT_PATH + contactId +
      ActionConstant.IS_ARCHIVED + isArchived + `?page=${page}&size=${size}`);
  }

  public getSearchedAndFilteredByTypeAndCommercialIdActions(searchValue, type, commercialId, page, size, isArchived): Observable<any> {
    return this.callService(Operation.GET, ActionConstant.SEARCH + searchValue + ActionConstant.TYPE + type +
      ActionConstant.COMMERCIAL_ID + commercialId + ActionConstant.IS_ARCHIVED + isArchived + `?page=${page}&size=${size}`);
  }

  public getSearchedAndFilteredByTypeAndCommercialIdActionsContact(searchValue, type, commercialId, contactId, page, size, isArchived): Observable<any> {
    return this.callService(Operation.GET, ActionConstant.SEARCH + searchValue + ActionConstant.TYPE + type +
      ActionConstant.COMMERCIAL_ID + commercialId + ActionConstant.CONTACT_PATH + contactId +
      ActionConstant.IS_ARCHIVED + isArchived + `?page=${page}&size=${size}`);
  }

  public getFilteredByTypeAndCommercialIdActions(type, commercialId, page, size, isArchived): Observable<any> {
    return this.callService(Operation.GET, ActionConstant.TYPE + type +
      ActionConstant.COMMERCIAL_ID + commercialId + ActionConstant.IS_ARCHIVED + isArchived + `?page=${page}&size=${size}`);
  }

  public getFilteredByTypeAndCommercialIdActionsContact(type, commercialId, contactId, page, size, isArchived): Observable<any> {
    return this.callService(Operation.GET, ActionConstant.TYPE + type +
      ActionConstant.COMMERCIAL_ID + commercialId + ActionConstant.CONTACT_PATH + contactId + ActionConstant.IS_ARCHIVED + isArchived
      + `?page=${page}&size=${size}`);

  }

  public getSearchedActionsByCommercial(searchValue, commercialId, page, size, isArchived): Observable<any> {
    return this.callService(Operation.GET, ActionConstant.SEARCH + searchValue + ActionConstant.COMMERCIAL_ID + commercialId +
      ActionConstant.IS_ARCHIVED + isArchived + `?page=${page}&size=${size}`);
  }

  public getAllActionsByCommercial(commercialId, page, size, isArchived): Observable<any> {
    return this.callService(Operation.GET, ActionConstant.COMMERCIAL_ID + commercialId
      + ActionConstant.IS_ARCHIVED + isArchived + `?page=${page}&size=${size}`);
  }

  public getActionsByCommercial(commercialId, isArchived): Observable<any> {
    return this.callService(Operation.GET, ActionConstant.CALANDER_URL +
      ActionConstant.COMMERCIAL_ID + commercialId + ActionConstant.IS_ARCHIVED + isArchived);
  }

  public getPreviousActionsAndByOrganizationAndUserConnected(search, organizationId, id, page, size, isArchived) {
    return this.getJavaGenericService().getData(ActionConstant.PREVIOUS_ACTIONS_BY_ORGANIZATION_AND_USER_URL +
      ActionConstant.IS_ARCHIVED + isArchived +
      `?searchValue=${search}&organizationId=${organizationId}&commercialId=${id}&page=${page}&size=${size}`);
  }

  public getPreviousActionsAndByOrganization(search, organizationId, page, size, isArchived) {
    return this.getJavaGenericService().getData(ActionConstant.PREVIOUS_ACTIONS_BY_ORGANIZATION_URL +
      ActionConstant.IS_ARCHIVED + isArchived +
      `?searchValue=${search}&organizationId=${organizationId}&page=${page}&size=${size}`);
  }

  public getUpcomingActionsAndByOrganizationAndUserConnected(search, organizationId, connectedUserId, page, size, isArchived) {
    return this.getJavaGenericService().getData(ActionConstant.UPCOMING_ACTIONS_BY_ORGANIZATION_AND_USER_URL +
      ActionConstant.IS_ARCHIVED + isArchived +
      `?searchValue=${search}&organizationId=${organizationId}&commercialId=${connectedUserId}&page=${page}&size=${size}`
    );
  }

  public getUpcomingActionsAndByOrganization(search, organizationId, page, size, isArchived) {
    return this.getJavaGenericService().getData(ActionConstant.UPCOMING_ACTIONS_BY_ORGANIZATION_URL +
      ActionConstant.IS_ARCHIVED + isArchived +
      `?searchValue=${search}&organizationId=${organizationId}&page=${page}&size=${size}`
    );
  }

  public getActionByStateAndByOrganizationAndUserConnected(search, organizationId, connectedUserId, page, size, state, isArchived) {
    return this.getJavaGenericService().getData(`${ActionConstant.ACTION_BY_STATE_AND_BY_ORGANIZATION_AND_USER_URL}` +
      `${ActionConstant.IS_ARCHIVED}${isArchived}` +
      `?searchValue=${search}&organizationId=${organizationId}&commercialId=${connectedUserId}&` +
      `state=${state}&page=${page}&size=${size}`);
  }

  public getActionByPriorityAndByOrganizationAndUserConnected(search, organizationId, connectedUserId, page, size, priority, isArchived) {
    return this.getJavaGenericService().getData(`${ActionConstant.ACTION_BY_PRIORITY_AND_BY_ORGANIZATION_AND_USER_URL}` +
      `${ActionConstant.IS_ARCHIVED}${isArchived}` +
      `?searchValue=${search}&organizationId=${organizationId}&commercialId=${connectedUserId}&` +
      `priority=${priority}&page=${page}&size=${size}`);
  }

  public getActionByStateAndByOrganization(search, organizationId, page, size, state, isArchived) {
    return this.getJavaGenericService().getData(ActionConstant.ACTION_BY_STATE_AND_BY_ORGANIZATION_URL +
      ActionConstant.IS_ARCHIVED + isArchived +
      `?searchValue=${search}&organizationId=${organizationId}&state=${state}&page=${page}&size=${size}`
    );
  }

  public getActionByPriorityAndByOrganization(search, organizationId, page, size, priority, isArchived) {
    return this.getJavaGenericService().getData(ActionConstant.ACTION_BY_PRIORITY_AND_BY_ORGANIZATION_URL +
      ActionConstant.IS_ARCHIVED + isArchived +
      `?searchValue=${search}&organizationId=${organizationId}&priority=${priority}&page=${page}&size=${size}`
    );
  }

  public getActionByTypeAndByOrganizationActionsAndUserConnected(search, organizationId, connectedUserId, page, size, type, isArchived) {
    return this.getJavaGenericService().getData(ActionConstant.ACTION_BY_TYPE_AND_BY_ORGANIZATION_AND_USER_URL +
      ActionConstant.IS_ARCHIVED + isArchived +
      `?searchValue=${search}&organizationId=${organizationId}&commercialId=${connectedUserId}&` +
      `type=${type}&page=${page}&size=${size}`);
  }

  public getActionByTypeAndByOrganizationActions(search, organizationId, page, size, type, isArchived) {
    return this.getJavaGenericService().getData(ActionConstant.ACTION_BY_TYPE_AND_BY_ORGANIZATION_URL +
      ActionConstant.IS_ARCHIVED + isArchived +
      `?searchValue=${search}&organizationId=${organizationId}&type=${type}&page=${page}&size=${size}`);
  }

  public getActionByOpportunityAndByOrganizationAndUserConnected(search, organizationId, connectedUserId,
                                                                 page, size, opportunityId,
                                                                 isArchived) {
    return this.getJavaGenericService().getData(ActionConstant.ACTION_BY_OPPORTUNITY_AND_ORGANIZATION_AND_USER_URL +
      ActionConstant.IS_ARCHIVED + isArchived +
      `?searchValue=${search}&organizationId=${organizationId}&commercialId=${connectedUserId}&` +
      `opportunityId=${opportunityId}&page=${page}&size=${size}`
    );
  }

  public getActionByOpportunityAndByOrganization(search, organizationId, page, size, opportunityId, isArchived) {
    return this.getJavaGenericService().getData(ActionConstant.ACTION_BY_OPPORTUNITY_AND_ORGANIZATION_URL +
      ActionConstant.IS_ARCHIVED + isArchived +
      `?searchValue=${search}&organizationId=${organizationId}&opportunityId=${opportunityId}&page=${page}&size=${size}`
    );
  }

  public getActionsByContactAndByOrganizationAndUserConnected(search, organizationId, connectedUserId, page, size, contactId, isArchived) {
    return this.getJavaGenericService().getData(ActionConstant.ACTIONS_BY_CONTACT_AND_ORGANIZATION_AND_USER_URL +
      ActionConstant.IS_ARCHIVED + isArchived +
      `?searchValue=${search}&organizationId=${organizationId}&commercialId=${connectedUserId}&` +
      `contactId=${contactId}&page=${page}&size=${size}`);
  }

  public getActionsByContactAndByOrganization(search, organizationId, page, size, contactId, isArchived) {
    return this.getJavaGenericService().getData(ActionConstant.ACTIONS_BY_CONTACT_AND_ORGANIZATION_URL +
      ActionConstant.IS_ARCHIVED + isArchived +
      `?searchValue=${search}&organizationId=${organizationId}&contactId=${contactId}&page=${page}&size=${size}`
    );
  }

  public getPreviousActionsByOpportunityAndUserConnected(search, opportunityId, connectedUserId, page, size, isArchived) {
    return this.getJavaGenericService().getData(ActionConstant.PREVIOUS_ACTIONS_BY_OPPORTUNITY_AND_USER_URL +
      ActionConstant.IS_ARCHIVED + isArchived +
      `?searchValue=${search}&opportunityId=${opportunityId}&commercialId=${connectedUserId}&page=${page}&size=${size}`
    );
  }

  public getPreviousActionsByOpportunity(search, opportunityId, page, size, isArchived) {
    return this.getJavaGenericService().getData(ActionConstant.PREVIOUS_ACTIONS_BY_OPPORTUNITY_URL +
      ActionConstant.IS_ARCHIVED + isArchived +
      `?searchValue=${search}&opportunityId=${opportunityId}&page=${page}&size=${size}`);
  }

  public getUpcomingActionAndByOpportunityAndUserConnected(search, opportunityId, connectedUserId, page, size, isArchived) {
    return this.getJavaGenericService().getData(ActionConstant.UPCOMING_ACTIONS_BY_OPPORTUNITY_AND_USER_URL +
      ActionConstant.IS_ARCHIVED + isArchived +
      `?searchValue=${search}&opportunityId=${opportunityId}&` + `commercialId=${connectedUserId}&page=${page}&size=${size}`
    );
  }

  public getUpcomingActionAndByOpportunity(search, opportunityId, page, size, isArchived) {
    return this.getJavaGenericService().getData(ActionConstant.UPCOMING_ACTIONS_BY_OPPORTUNITY_URL +
      ActionConstant.IS_ARCHIVED + isArchived +
      `?searchValue=${search}&opportunityId=${opportunityId}&page=${page}&size=${size}`);
  }

  public getActionByStateAndByOpportunityAndUserConnected(search, opportunityId, connectedUserId, page, size, state, isArchived) {
    return this.getJavaGenericService().getData(ActionConstant.ACTION_BY_STATE_AND_BY_OPPORTUNITY_AND_USER_URL +
      ActionConstant.IS_ARCHIVED + isArchived +
      `?searchValue=${search}&opportunityId=${opportunityId}&commercialId=${connectedUserId}` +
      `&state=${state}&page=${page}&size=${size}`);
  }

  public getActionByPriorityAndByOpportunityAndUserConnected(search, opportunityId, connectedUserId, page, size, priority, isArchived) {
    return this.getJavaGenericService().getData(ActionConstant.ACTION_BY_PRIORITY_AND_BY_OPPORTUNITY_AND_USER_URL +
      ActionConstant.IS_ARCHIVED + isArchived +
      `?searchValue=${search}&opportunityId=${opportunityId}&commercialId=${connectedUserId}` +
      `&priority=${priority}&page=${page}&size=${size}`);
  }

  public getActionByStateAndByOpportunity(search, opportunityId, page, size, state, isArchived) {
    return this.getJavaGenericService().getData(ActionConstant.ACTION_BY_STATE_AND_BY_OPPORTUNITY_URL +
      ActionConstant.IS_ARCHIVED + isArchived +
      `?searchValue=${search}&opportunityId=${opportunityId}&state=${state}&page=${page}&size=${size}`);
  }

  public getActionByPriorityAndByOpportunity(search, opportunityId, page, size, priority, isArchived) {
    return this.getJavaGenericService().getData(ActionConstant.ACTION_BY_PRIORITY_AND_BY_OPPORTUNITY_URL +
      ActionConstant.IS_ARCHIVED + isArchived +
      `?searchValue=${search}&opportunityId=${opportunityId}&priority=${priority}&page=${page}&size=${size}`);
  }

  public getActionsByTypeAndByOpportunityAndUserConnected(search, opportunityId, connectedUserId, page, size, type, isArchived) {
    return this.getJavaGenericService().getData(ActionConstant.ACTION_BY_TYPE_AND_BY_OPPORTUNITY_AND_USER_URL +
      ActionConstant.IS_ARCHIVED + isArchived +
      `?searchValue=${search}&opportunityId=${opportunityId}&commercialId=${connectedUserId}` +
      `&type=${type}&page=${page}&size=${size}`);
  }

  public getActionsByTypeAndByOpportunity(search, opportunityId, page, size, type, isArchived) {
    return this.getJavaGenericService().getData(ActionConstant.ACTION_BY_TYPE_AND_BY_OPPORTUNITY_URL +
      ActionConstant.IS_ARCHIVED + isArchived +
      `?searchValue=${search}&opportunityId=${opportunityId}&type=${type}&page=${page}&size=${size}`);
  }

  public getActionsByOrganizationAndByOpportunityAndUserConnected(search, opportunityId, connectedUserId, page, size,
                                                                  organizationId, isArchived) {
    return this.getJavaGenericService().getData(ActionConstant.ACTION_BY_ORGANIZATION_AND_OPPORTUNITY_AND_USER_URL +
      ActionConstant.IS_ARCHIVED + isArchived +
      `?searchValue=${search}&organizationId=${organizationId}&commercialId=${connectedUserId}` +
      `&opportunityId=${opportunityId}&page=${page}&size=${size}`);
  }

  public getActionsByOrganizationAndByOpportunity(search, opportunityId, page, size, organizationId, isArchived) {
    return this.getJavaGenericService().getData(ActionConstant.ACTION_BY_ORGANIZATION_AND_OPPORTUNITY_URL +
      ActionConstant.IS_ARCHIVED + isArchived +
      `?searchValue=${search}&organizationId=${organizationId}&opportunityId=${opportunityId}&page=${page}&size=${size}`);
  }

  public getActionsByContactAndByOpportunityAndUserConnected(search, opportunityId, connectedUserId,
                                                             page, size, contactId, isArchived) {
    return this.getJavaGenericService().getData(ActionConstant.ACTIONS_BY_CONTACT_AND_OPPORTUNITY_AND_USER_URL +
      ActionConstant.IS_ARCHIVED + isArchived +
      `?searchValue=${search}&opportunityId=${opportunityId}&commercialId=${connectedUserId}` +
      `&contactId=${contactId}&page=${page}&size=${size}`);
  }

  public getActionsByContactAndByOpportunity(search, opportunityId, page, size, contactId, isArchived) {
    return this.getJavaGenericService().getData(ActionConstant.ACTIONS_BY_CONTACT_AND_OPPORTUNITY_URL +
      ActionConstant.IS_ARCHIVED + isArchived +
      `?searchValue=${search}&opportunityId=${opportunityId}&contactId=${contactId}&page=${page}&size=${size}`);
  }

  public getPreviousActionsByOrganizationClientAndUserConnected(search, organizationId, connectedUserId, page, size, isArchived) {
    return this.getJavaGenericService().getData(ActionConstant.PREVIOUS_ACTIONS_BY_ORGANIZATION_CLIENT_AND_USER_URL +
      ActionConstant.IS_ARCHIVED + isArchived +
      `?searchValue=${search}&organizationId=${organizationId}&commercialId=${connectedUserId}&page=${page}&size=${size}`
    );
  }

  public getPreviousActionsByOrganizationClient(search, organizationId, page, size, isArchived) {
    return this.getJavaGenericService().getData(ActionConstant.PREVIOUS_ACTIONS_BY_ORGANIZATION_CLIENT_URL +
      ActionConstant.IS_ARCHIVED + isArchived +
      `?searchValue=${search}&organizationId=${organizationId}&page=${page}&size=${size}`);
  }

  public getUpcomingActionsByOrganizationClientActionsAndUserConnected(search, organizationId, connectedUserId, page, size, isArchived) {
    return this.getJavaGenericService().getData(ActionConstant.UPCOMING_ACTIONS_BY_ORGANIZATION_CLIENT_AND_USER_URL +
      ActionConstant.IS_ARCHIVED + isArchived +
      `?searchValue=${search}&organizationId=${organizationId}&commercialId=${connectedUserId}&page=${page}&size=${size}`
    );
  }

  public getUpcomingActionsByOrganizationClientActions(search, organizationId, page, size, isArchived) {
    return this.getJavaGenericService().getData(ActionConstant.UPCOMING_ACTIONS_BY_ORGANIZATION_CLIENT_URL +
      ActionConstant.IS_ARCHIVED + isArchived +
      `?searchValue=${search}&organizationId=${organizationId}&page=${page}&size=${size}`
    );
  }

  public getActionsByStateAndByOrganizationClientAndUserConnected(search, organizationId, connectedUserId, page, size, state, isArchived) {
    return this.getJavaGenericService().getData(ActionConstant.ACTION_BY_STATE_AND_BY_ORGANIZATION_CLIENT_AND_USER_URL +
      ActionConstant.IS_ARCHIVED + isArchived +
      `?searchValue=${search}&organizationId=${organizationId}&commercialId=${connectedUserId}` +
      `&state=${state}&page=${page}&size=${size}`);
  }

  public getActionsByPriorityAndByOrganizationClientAndUserConnected(search, organizationId, connectedUserId, page, size, priority, isArchived) {
    return this.getJavaGenericService().getData(ActionConstant.ACTION_BY_PRIORITY_AND_BY_ORGANIZATION_CLIENT_AND_USER_URL +
      ActionConstant.IS_ARCHIVED + isArchived +
      `?searchValue=${search}&organizationId=${organizationId}&commercialId=${connectedUserId}` +
      `&priority=${priority}&page=${page}&size=${size}`);
  }

  public getActionsByStateAndByOrganizationClient(search, organizationId, page, size, state, isArchived) {
    return this.getJavaGenericService().getData(ActionConstant.ACTION_BY_STATE_AND_BY_ORGANIZATION_CLIENT_URL +
      ActionConstant.IS_ARCHIVED + isArchived +
      `?searchValue=${search}&organizationId=${organizationId}&state=${state}&page=${page}&size=${size}`);
  }

  public getActionsByPriorityAndByOrganizationClient(search, organizationId, page, size, priority, isArchived) {
    return this.getJavaGenericService().getData(ActionConstant.ACTION_BY_PRIORITY_AND_BY_ORGANIZATION_CLIENT_URL +
      ActionConstant.IS_ARCHIVED + isArchived +
      `?searchValue=${search}&organizationId=${organizationId}&priority=${priority}&page=${page}&size=${size}`);
  }

  public getActionsByTypeAndByOrganizationClientAndUserConnected(search, organizationId, connectedUserId, page, size, type,
                                                                 isArchived) {
    return this.getJavaGenericService().getData(ActionConstant.ACTION_BY_TYPE_AND_BY_ORGANIZATION_CLIENT_AND_USER_URL +
      ActionConstant.IS_ARCHIVED + isArchived +
      `?searchValue=${search}&organizationId=${organizationId}&commercialId=${connectedUserId}` +
      `&type=${type}&page=${page}&size=${size}`);
  }

  public getActionsByTypeAndByOrganizationClient(search, organizationId, page, size, type, isArchived) {
    return this.getJavaGenericService().getData(ActionConstant.ACTION_BY_TYPE_AND_BY_ORGANIZATION_CLIENT_URL +
      ActionConstant.IS_ARCHIVED + isArchived +
      `?searchValue=${search}&organizationId=${organizationId}&type=${type}&page=${page}&size=${size}`
    );
  }

  public getActionsByOpportunityAndByOrganizationClientAndUserConnected(search, organizationId, connectedUserId, page, size, opportunityId, isArchived) {
    return this.getJavaGenericService().getData(ActionConstant.ACTION_BY_OPPORTUNITY_AND_ORGANIZATION_CLIENT_AND_USER_URL +
      ActionConstant.IS_ARCHIVED + isArchived +
      `?searchValue=${search}&organizationId=${organizationId}&commercialId=${connectedUserId}` +
      `&opportunityId=${opportunityId}&page=${page}&size=${size}`);
  }

  public getActionsByOpportunityAndByOrganizationClient(search, organizationId, page, size, opportunityId, isArchived) {
    return this.getJavaGenericService().getData(ActionConstant.ACTION_BY_OPPORTUNITY_AND_ORGANIZATION_CLIENT_URL +
      ActionConstant.IS_ARCHIVED + isArchived +
      `?searchValue=${search}&organizationId=${organizationId}&opportunityId=${opportunityId}&page=${page}&size=${size}`
    );
  }

  public getActionByContactAndByOrganizationClientAndUserConnected(search, organizationId, connectedUserId, page, size, contactId,
                                                                   isArchived) {
    return this.getJavaGenericService().getData(ActionConstant.ACTIONS_BY_CONTACT_AND_ORGANIZATION_CLIENT_AND_USER_URL +
      ActionConstant.IS_ARCHIVED + isArchived +
      `?searchValue=${search}&organizationId=${organizationId}&commercialId=${connectedUserId}` +
      `&contactId=${contactId}&page=${page}&size=${size}`);
  }

  public getActionByContactAndByOrganizationClient(search, organizationId, page, size, contactId, isArchived) {
    return this.getJavaGenericService().getData(ActionConstant.ACTIONS_BY_CONTACT_AND_ORGANIZATION_CLIENT_URL +
      ActionConstant.IS_ARCHIVED + isArchived +
      `?searchValue=${search}&organizationId=${organizationId}&contactId=${contactId}&page=${page}&size=${size}`
    );
  }

  public getActionsByOrganizationClientAndConnectedUser(search, organizationId, connectedUserId, page, size, isArchived) {
    return this.getJavaGenericService().getData(ActionConstant.ACTIONS_BY_ORGANIZATION_CLIENT_AND_USER_URL +
      ActionConstant.IS_ARCHIVED + isArchived +
      `?searchValue=${search}&organizationId=${organizationId}&commercialId=${connectedUserId}` +
      `&page=${page}&size=${size}`);
  }

  public getActionsByOrganizationClient(search, organizationId, page, size, isArchived) {
    return this.getJavaGenericService().getData(ActionConstant.ACTIONS_BY_ORGANIZATION_CLIENT_URL +
      ActionConstant.IS_ARCHIVED + isArchived +
      `?searchValue=${search}&organizationId=${organizationId}&page=${page}&size=${size}`
    );
  }

  public getActionByContactAndByOpportunityClientAndConnectedUser(search, opportunityId, connectedUserId, page, size, contactId, isArchived) {
    return this.getJavaGenericService().getData(ActionConstant.ACTION_BY_CONTACT_AND_OPPORTUNITY_CLIENT_AND_USER_URL +
      ActionConstant.IS_ARCHIVED + isArchived +
      `?searchValue=${search}&opportunityId=${opportunityId}&commercialId=${connectedUserId}` +
      `&contactId=${contactId}&page=${page}&size=${size}`);
  }

  public getActionByContactAndByOpportunityClient(search, opportunityId, page, size, contactId, isArchived) {
    return this.getJavaGenericService().getData(ActionConstant.ACTION_BY_CONTACT_AND_OPPORTUNITY_CLIENT_URL +
      ActionConstant.IS_ARCHIVED + isArchived +
      `?searchValue=${search}&opportunityId=${opportunityId}&contactId=${contactId}&page=${page}&size=${size}`);
  }

  public getActionByOrganizationAndByOpportunityClientAndConnectedUser(search, opportunityId, connectedUserId, page, size, organizationId, isArchived) {
    return this.getJavaGenericService().getData(ActionConstant.ACTION_BY_ORGANIZATION_AND_OPPORTUNITY_CLIENT_AND_USER_URL +
      ActionConstant.IS_ARCHIVED + isArchived +
      `?searchValue=${search}&organizationId=${organizationId}&commercialId=${connectedUserId}` +
      `&opportunityId=${opportunityId}&page=${page}&size=${size}`);
  }

  public getActionByOrganizationAndByOpportunityClient(search, opportunityId, page, size, organizationId, isArchived) {
    return this.getJavaGenericService().getData(ActionConstant.ACTION_BY_ORGANIZATION_AND_OPPORTUNITY_CLIENT_URL +
      ActionConstant.IS_ARCHIVED + isArchived +
      `?searchValue=${search}&organizationId=${organizationId}&opportunityId=${opportunityId}` +
      `&page=${page}&size=${size}`);
  }

  public getPreviousActionsByContactClientAndConnectedUser(search, contactId, connectedUserId, page, size, isArchived) {
    return this.getJavaGenericService().getData(ActionConstant.PREVIOUS_ACTIONS_BY_CONTACT_CLIENT_AND_USER_URL +
      ActionConstant.IS_ARCHIVED + isArchived +
      `?searchValue=${search}&contactId=${contactId}&commercialId=${connectedUserId}&page=${page}&size=${size}`);
  }

  public getPreviousActionsByContactClient(search, contactId, page, size, isArchived) {
    return this.getJavaGenericService().getData(ActionConstant.PREVIOUS_ACTIONS_BY_CONTACT_CLIENT_URL +
      ActionConstant.IS_ARCHIVED + isArchived +
      `?searchValue=${search}&contactId=${contactId}&page=${page}&size=${size}`);
  }

  public getUpcomingActionsByContactClientAndConnectedUser(search, contactId, connectedUserId, page, size, isArchived) {
    return this.getJavaGenericService().getData(ActionConstant.UPCOMING_ACTIONS_BY_CONTACT_CLIENT_AND_USER_URL +
      ActionConstant.IS_ARCHIVED + isArchived +
      `?searchValue=${search}&contactId=${contactId}&commercialId=${connectedUserId}&page=${page}&size=${size}`
    );
  }

  public getUpcomingActionsByContactClient(search, contactId, page, size, isArchived) {
    return this.getJavaGenericService().getData(ActionConstant.UPCOMING_ACTIONS_BY_CONTACT_CLIENT_URL +
      ActionConstant.IS_ARCHIVED + isArchived +
      `?searchValue=${search}&contactId=${contactId}&page=${page}&size=${size}`
    );
  }

  public getActionsByStateAndByContactClientAndConnectedUser(search, contactId, connectedUserId, page, size, state, isArchived) {
    return this.getJavaGenericService().getData(ActionConstant.ACTION_BY_STATE_AND_BY_CONTACT_CLIENT_AND_USER_URL +
      ActionConstant.IS_ARCHIVED + isArchived +
      `?searchValue=${search}&contactId=${contactId}&commercialId=${connectedUserId}` +
      `&state=${state}&page=${page}&size=${size}`);
  }

  public getActionsByPriorityAndByContactClientAndConnectedUser(search, contactId, connectedUserId, page, size, priority, isArchived) {
    return this.getJavaGenericService().getData(ActionConstant.ACTION_BY_PRIORITY_AND_BY_CONTACT_CLIENT_AND_USER_URL +
      ActionConstant.IS_ARCHIVED + isArchived +
      `?searchValue=${search}&contactId=${contactId}&commercialId=${connectedUserId}` +
      `&priority=${priority}&page=${page}&size=${size}`);
  }

  public getActionsByStateAndByContactClient(search, contactId, page, state, size, isArchived) {
    return this.getJavaGenericService().getData(ActionConstant.ACTION_BY_STATE_AND_BY_CONTACT_CLIENT_URL +
      ActionConstant.IS_ARCHIVED + isArchived +
      `?searchValue=${search}&contactId=${contactId}&state=${state}&page=${page}&size=${size}`
    );
  }

  public getActionsByPriorityAndByContactClient(search, contactId, page, size, priority, isArchived) {
    return this.getJavaGenericService().getData(ActionConstant.ACTION_BY_PRIORITY_AND_BY_CONTACT_CLIENT_URL +
      ActionConstant.IS_ARCHIVED + isArchived +
      `?searchValue=${search}&contactId=${contactId}&priority=${priority}&page=${page}&size=${size}`
    );
  }

  public getActionsByTypeAndByContactClientActionsAndConnectedUser(search, contactId, connectedUserId, page, size, type, isArchived) {
    return this.getJavaGenericService().getData(ActionConstant.ACTION_BY_TYPE_AND_BY_CONTACT_CLIENT_AND_USER_URL +
      ActionConstant.IS_ARCHIVED + isArchived +
      `?searchValue=${search}&contactId=${contactId}&commercialId=${connectedUserId}` +
      `&type=${type}&page=${page}&size=${size}`);
  }

  public getActionsByTypeAndByContactClientActions(search, contactId, page, size, type, isArchived) {
    return this.getJavaGenericService().getData(ActionConstant.ACTION_BY_TYPE_AND_BY_CONTACT_CLIENT_URL +
      ActionConstant.IS_ARCHIVED + isArchived +
      `?searchValue=${search}&contactId=${contactId}&type=${type}&page=${page}&size=${size}`);
  }

  public getActionsByOpportunityAndByContactClientAndConnectedUser(search, contactId, connectedUserId, page, size, opportunityId, isArchived) {
    return this.getJavaGenericService().getData(ActionConstant.ACTION_BY_OPPORTUNITY_AND_CONTACT_CLIENT_AND_USER_URL +
      ActionConstant.IS_ARCHIVED + isArchived +
      `?searchValue=${search}&contactId=${contactId}&commercialId=${connectedUserId}` +
      `&opportunityId=${opportunityId}&page=$page}&size=${size}`);
  }

  public getActionsByOpportunityAndByContactClient(search, contactId, page, size, opportunityId, isArchived) {
    return this.getJavaGenericService().getData(ActionConstant.ACTION_BY_OPPORTUNITY_AND_CONTACT_CLIENT_URL +
      ActionConstant.IS_ARCHIVED + isArchived +
      `?searchValue=${search}&contactId=${contactId}&opportunityId=${opportunityId}&page=${page}&size=${size}`
    );
  }

  public getActionsByContactAndByContactClientAndConnectedUser(search, contactId, connectedUserId, page, size, opportunityId, isArchived) {
    return this.getJavaGenericService().getData(ActionConstant.ACTIONS_BY_ORGANIZATION_AND_CONTACT_CLIENT_AND_USER_URL +
      ActionConstant.IS_ARCHIVED + isArchived +
      `?searchValue=${search}&contactId=${contactId}&commercialId=${connectedUserId}` +
      `&organizationId=${opportunityId}&page=${page}&size=${size}`);
  }

  public getActionsByContactAndByContactClient(search, contactId, page, size, opportunityId, isArchived) {
    return this.getJavaGenericService().getData(ActionConstant.ACTIONS_BY_ORGANIZATION_AND_CONTACT_CLIENT_URL +
      ActionConstant.IS_ARCHIVED + isArchived +
      `?searchValue=${search}&contactId=${contactId}&organizationId=${opportunityId}&` +
      `page=${page}&size=${size}`);
  }

  public getActionByContactClientAndConnectedUser(search, contactId, connectedUserId, page, size, isArchived) {
    return this.getJavaGenericService().getData(ActionConstant.ACTIONS_BY_CONTACT_CLIENT_AND_USER_URL +
      ActionConstant.IS_ARCHIVED + isArchived +
      `?searchValue=${search}&contactId=${contactId}&commercialId=${connectedUserId}&page=${page}&size=${size}`);
  }

  public getActionByContactClient(search, contactId, page, size, isArchived) {
    return this.getJavaGenericService().getData(ActionConstant.ACTIONS_BY_CONTACT_CLIENT_URL +
      ActionConstant.IS_ARCHIVED + isArchived +
      `?searchValue=${search}&contactId=${contactId}&page=${page}&size=${size}`);
  }
}
