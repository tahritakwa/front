import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ActionService } from '../../services/action/action.service';
import { Filter, Operation, Operator, OrderBy, OrderByDirection, PredicateFormat, Relation } from '../../../shared/utils/predicate';
import { AdministrativeDocumentConstant } from '../../../constant/payroll/administrative-document-constant';
import { LeaveRequestConstant } from '../../../constant/payroll/leave.constant';
import { ActionFilterTypeEnum } from '../../../models/crm/enums/actionFilterType.enum';
import { ActionConstant } from '../../../constant/crm/action.constant';
import { TranslateService } from '@ngx-translate/core';
import frLocale from 'fullcalendar/dist/locale/fr.js';
import {DatePipe} from '@angular/common';
import {SharedCrmConstant} from '../../../constant/crm/sharedCrm.constant';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {FormModalDialogService} from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import {CrmConstant} from '../../../constant/crm/crm.constant';
import {Employee} from '../../../models/payroll/employee.model';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {ReminderEventService} from '../../services/reminder-event/reminder-event.service';
import {ReminderEventComponent} from '../reminder-event/reminder-event.component';
import {DetailActionComponent} from '../action/detail-action/detail-action.component';
import {GenericCrmService} from '../../generic-crm.service';
import { EventService } from '../../services/event/event.service';
import {LocalStorageService} from '../../../login/Authentification/services/local-storage-service';
import {UserService} from '../../../administration/services/user/user.service';
import {GrowlService} from '../../../../COM/Growl/growl.service';
import {EventComponent} from '../event/event/event.component';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  private static BLUE_COLOR = '#1a53ff';
  private static RED_COLOR = '#ff0d00';
  private static YELLOW_COLOR = '#d4d20f';
  private static GREEN_COLOR = '#00FF00';
  private static PURPLE_COLOR = '#EE82EE';
  headerConfig;
  locale;
  events: any[];
  actions: any[];
  leaves: any[];
  showModal = false;
  predicate: PredicateFormat;
  predicateCalendar : PredicateFormat;
  public actionsFilter = ActionFilterTypeEnum;
  public selectedFilter = ActionConstant.MY_ACTIONS_RIMINDERS;
  public chosenFilterNumber = this.actionsFilter.ACTION_MY_ACTIONS;
  public connectedUser;
  public selectedDate;
  public listResponsiblesUsers: Array<Employee>;
  public listResponsiblesUsersFiltred: Array<Employee>;
  public showCommercialDropDown = false;
  public selectedCommercial;
  eventsDate: any [];
  private connectedUserId: any;
  public listUsers = [];
  public listUsersFilter = [];

  /**
   *
   * @param actionsService
   * @param leaveService
   * @param translate
   * @param datePipe
   * @param employeeService
   * @param formModalDialogService
   * @param viewRef
   * @param reminderEventService
   * @param genericCrmService
   */
  constructor(private  actionsService: ActionService,
              private  translate: TranslateService,
              private datePipe: DatePipe,
              private formModalDialogService: FormModalDialogService,
              private eventService: EventService,
              private viewRef: ViewContainerRef,
              private reminderEventService: ReminderEventService,
              private genericCrmService: GenericCrmService,
              private localStorageService: LocalStorageService,
              private userService: UserService,
              private growlService: GrowlService) {
  }

  ngOnInit() {
    this.getConnectedUser();
    this.events = [];
    this.headerConfig = {
      right: 'prev,next today',
      center: 'title',
      left: 'month,agendaWeek,agendaDay'
    };
    this.loadUsersList();
    this.getUserByEmail();
    this.getLocale();


  }

  /**
   * get the list of employees to select to whom the action is attributed to
   */


  getEventsList() {
    this.eventService.getJavaGenericService().getEntityList(CrmConstant.BY_USER).subscribe((result) => {
      if (result) {
        this.fillResultContentEvent(result);
      }
    });
  }


  loadCurrentUserEventAndActionAndRappel() {
    this.getAllActionsByCommercial(this.connectedUserId);
    this.getReminderByCommercial(this.connectedUserId);
    this.getAllEventByCommercial(this.connectedUserId);
  }

  getAllEventByCommercial(commercialId) {
    this.eventService.getEvntsByCommercial(commercialId, false).subscribe((result) => {
      if (result) {
        this.fillResultContentEvent(result);
      }
    });
  }

  fillEventInCalendar(event) {
    this.events.push({
      title: event.name,
      start: event.startDate ? this.transformDate(event.startDate) : '',
      end: event.endDate ? this.getActionsEndDate(event.endDate, event.startDate, event.duration) : '',
      color: CalendarComponent.PURPLE_COLOR,
      type: "EVENT",
      event: event
    });
  }

  fillResultContentEvent(result) {
    this.eventsDate = [];
    this.eventsDate = result;
    this.eventsDate.forEach(eventsDate => {
      this.fillEventInCalendar(eventsDate);
    });
  }

  getLocale() {

    if (this.localStorageService.getLanguage() !== 'en') {
      this.locale = frLocale;
    } else {
      this.locale = 'en';
    }


  }

  handleEventClick(e) {
    this.selectedDate = e.date;
    this.showModal = true;
  }

  showEvent(event) {
    if (event && event.calEvent.type === CrmConstant.ACTION) {
      this.showAction(event.calEvent.action);
    }
    if (event && event.calEvent.type === CrmConstant.REMINDER) {
      this.showReminder(event.calEvent.reminder);
    }
    if (event && event.calEvent.type === CrmConstant.EVENT) {
      this.showEventCRM(event.calEvent.event);
    }
  }

  showAction(action) {
    this.formModalDialogService.openDialog(action.name, DetailActionComponent, this.viewRef, this.updateCalendar.bind(this),
      {actionData: action}, false, SharedConstant.MODAL_DIALOG_SIZE_ML);
  }

  showReminder(reminderEvent) {
    this.formModalDialogService.openDialog(reminderEvent.name, ReminderEventComponent, this.viewRef, this.updateCalendar.bind(this),
      {reminderData: reminderEvent}, false, SharedConstant.MODAL_DIALOG_SIZE_ML);
  }
  showEventCRM(event) {
    this.formModalDialogService.openDialog(event.name, EventComponent, this.viewRef, this.updateCalendar.bind(this),
      {eventData: event}, false, SharedConstant.MODAL_DIALOG_SIZE_ML);
  }
  getDate(date): Date {
    if (date) {
      return new Date(date);
    }
  }

  updateCalendar() {
    this.filterAction(this.chosenFilterNumber);
  }

  /*
  * Calculate and return the reminder end date from reminder start date
  * */
  getRappelEndDate(startDate): string {
    if (startDate) {
      const reminderEndDate = new Date(startDate);
      reminderEndDate.setHours(reminderEndDate.getHours() + 1);
      return this.transformDate(reminderEndDate);
    }
  }

  /*
  * Calculate and return the Action end date from start date and duration
  * if end date equal to start date
  * */
  getActionsEndDate(date, startDate, dur: number): string {
    if (date) {
      const endDate = new Date(date);
      const actionStartDate = new Date(startDate);
      if (endDate.getDate() === actionStartDate.getDate()) {
        const actionDate = actionStartDate;
        actionDate.setMinutes(actionStartDate.getMinutes() + dur ? dur : NumberConstant.SIXTY);
        return this.transformDate(actionDate);
      }
      return this.transformDate(endDate);
    }
  }

  getActionsList() {
    this.actionsService.getJavaGenericService().getEntityList(CrmConstant.BY_USER).subscribe((result) => {
      if (result) {
        this.fillResultContent(result);
      }
    });
  }

  closeModel() {
    this.showModal = false;

  }

  initAfterSave() {
    this.closeModel();
    this.filterAction(this.chosenFilterNumber);
  }



  public preparePredicate(employeeId): void {
    this.predicate = new PredicateFormat();
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(LeaveRequestConstant.ID_EMPLOYEE_NAVIGATION),
      new Relation(LeaveRequestConstant.ID_LEAVE_TYPE_NAVIGATION), new Relation(LeaveRequestConstant.TREATED_BY_NAVIGATION)]);
    this.predicate.OrderBy = new Array<OrderBy>();
    this.predicate.OrderBy.push(new OrderBy(LeaveRequestConstant.ID, OrderByDirection.desc));
    this.predicate.Operator = Operator.and;
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Operator = 0;
    this.predicate.pageSize = 10;
    this.predicate.page = 1;
    this.prepareCollaboraterPredicate(employeeId);
  }

  prepareCollaboraterPredicate(employeeId) {
    this.predicate.Filter.push(new Filter(AdministrativeDocumentConstant.EMPLOYEE_ID,
      Operation.eq, employeeId));
  }

  getConnectedUser() {
    this.connectedUser = this.localStorageService.getUser();
  }

  getAllActionsByCommercial(commercialId) {
    this.actionsService.getActionsByCommercial(commercialId, false).subscribe((result) => {
      if (result) {
        this.fillResultContent(result);
      }
    });
  }

  fillReminderDate(action) {
    this.events.push({
      title: `${this.translate.instant('REMINDER_DATE')} ${action.name}`,
      start: action.startDate ? this.transformDate(action.reminderDate) : '',
      end: action.endDate ? this.getRappelEndDate(action.reminderDate) : '',
      color: CalendarComponent.YELLOW_COLOR,
      type: CrmConstant.REMINDER_DATE
    });
  }

  fillActionInCalendar(action) {
    this.events.push({
      title: action.name,
      start: action.startDate ? this.transformDate(action.startDate) : '',
      end: action.endDate ? this.getActionsEndDate(action.endDate, action.startDate, action.duration) : '',
      color: CalendarComponent.BLUE_COLOR,
      type: CrmConstant.ACTION,
      action: action
    });
  }

  fillResultContent(result) {
    this.actions = [];
    this.actions = result;
    this.actions.forEach(action => {
      if (action.reminderDate) {
        this.fillReminderDate(action);
      }
      this.fillActionInCalendar(action);
    });
  }

  filterAction(chosenFilter) {
    this.events = [];
    this.chosenFilterNumber = chosenFilter;
    if (chosenFilter === this.actionsFilter.ACTION_ALL) {
      this.selectedFilter = ActionConstant.ALL_ACTIONS;
      this.showCommercialDropDown = false;
      this.selectedCommercial = undefined;
      this.getActionsList();
      this.getReminderByCommercial(this.connectedUserId);
      this.getEventsList();
    }
    if (chosenFilter === this.actionsFilter.ACTION_MY_ACTIONS) {
      this.selectedFilter = ActionConstant.MY_ACTIONS_RIMINDERS;
      this.showCommercialDropDown = false;
      this.selectedCommercial = undefined;
      this.getAllActionsByCommercial(this.connectedUserId);
      this.getReminderByCommercial(this.connectedUserId);
      this.getAllEventByCommercial(this.connectedUserId);
    }
    if (chosenFilter === this.actionsFilter.ACTION_BY_COMMERCIAL) {
      this.selectedFilter = ActionConstant.BY_COLLABORATER;
      this.showCommercialDropDown = true;
      this.getActionsAndLeaveByCommercial(this.selectedCommercial);
    }
  }

  transformDate(date) {
    return this.datePipe.transform(date, SharedCrmConstant.YYYY_MM_DD_HH_MM_SS);
  }

  private getReminderByCommercial(commercialId) {
    this.reminderEventService.getReminderByCommercial(commercialId).subscribe((result) => {
      if (result) {
        this.fillReminderEvnInCalendar(result);
      }
    });
  }

  private transformLeaveDate(leaveDate, leaveTime) {
    const date = new Date(leaveDate);
    date.setHours(leaveTime.slice(0, 2), leaveTime.slice(3, 5));
    return date;
  }

  getActionsAndLeaveByCommercial(commercialId) {
    this.events = [];
    this.selectedCommercial = commercialId;
    if (!this.genericCrmService.isNullOrUndefinedOrEmpty(commercialId)) {
      this.getAllActionsByCommercial(commercialId);
      this.getAllEventByCommercial(commercialId);
    }
  }

  fillReminderEvnInCalendar(reminderList) {
    reminderList.forEach(reminder => {
      this.events.push({
        title: reminder.name,
        start: reminder.reminderDate ? this.transformDate(reminder.reminderDate) : '',
        end: reminder.reminderDate ? this.getRappelEndDate(reminder.reminderDate) : '',
        color: CalendarComponent.GREEN_COLOR,
        type: CrmConstant.REMINDER,
        reminder: reminder
      });
    });
  }

  private getALLReminders() {
    this.reminderEventService.getJavaGenericService().getEntityList().subscribe(reminders => {
      if (reminders) {
        this.fillReminderEvnInCalendar(reminders);
      }
    });

  }

  handleFilterResponsables(responsableSearched) {
    this.listResponsiblesUsers = this.listResponsiblesUsersFiltred.filter(responsable => responsable.FullName.toLowerCase()
      .indexOf(responsableSearched.toLowerCase()) !== -1);

  }


  getUserByEmail() {
    this.userService.getByEmail(this.connectedUser.Email).toPromise().then(
      (user) => {
        this.connectedUserId = user.Id;
        this.loadCurrentUserEventAndActionAndRappel();
      }
    );
  }

  loadUsersList() {
    this.predicate = PredicateFormat.prepareEmptyPredicate();
    this.userService.processDataServerSide(this.predicate).subscribe(data => {
      this.listUsers = data.data.filter(user => user.Email !== this.connectedUser.Email);
      this.listUsersFilter = data.data.filter(user => user.Email !== this.connectedUser.Email);
      this.filterUsers();
    }, () => {
      this.growlService.ErrorNotification(this.translate.instant(SharedCrmConstant.FAILURE_OPERATION));
    }, () => {
    });
  }
  filterUsers(){
    this.listUsersFilter = this.listUsersFilter.filter(responsable => responsable.FullName != null);
    this.removeDuplicateUsers();
    this.listUsers = this.listUsersFilter;
  }
  removeDuplicateUsers(){
    this.listUsersFilter = this.listUsersFilter.reduce((a, b) => {
      if (!a.find(data => data.Email === b.Email)) {
        a.push(b);
      }
      return a;
    }, []);
  }
  handleResponsablesFilter(userSearched) {
    this.listUsers = this.listUsersFilter.filter(responsable =>   responsable.FullName.toLowerCase()
      .includes(userSearched.toLowerCase()));
  }
}
