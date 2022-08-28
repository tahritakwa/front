import {
  Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList, ViewContainerRef,
  TemplateRef, ViewRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionService } from '../../services/session/session.service';
import { SessionBonus } from '../../../models/payroll/session-bonus.model';
import { Session } from '../../../models/payroll/session.model';
import { SessionConstant } from '../../../constant/payroll/session.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { ExchangeBonusDataService } from '../../services/exchange-bonus-data/exchange-bonus-data.service';
import { SessionBonusSection } from '../../../models/payroll/session-bonus-section.model';
import { AttendanceConstant } from '../../../constant/payroll/attendance.constant';
import { VariableBonusesSectionComponent } from '../../components/variable-bonuses-section/variable-bonuses-section.component';
import { PayrollSessionState } from '../../../models/enumerators/session-state.enum';
import { StarkRolesService } from '../../../stark-permissions/service/roles.service';
import { isNullOrUndefined } from 'util';
import { notEmptyValue } from '../../../stark-permissions/utils/utils';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';

@Component({
  selector: 'app-variable-bonuses',
  templateUrl: './variable-bonuses.component.html',
  styleUrls: ['./variable-bonuses.component.scss']
})

export class VariableBonusesComponent implements OnInit, OnDestroy {
  // array of SessionBonus
  public sessionBonusList: SessionBonus[] = [];

  childHasNoError: boolean;
  public idSession: number;
  sessionInfos: Session = new Session();
  showErrorMessage = false;
  public isClosed = false;
  public bonusIsSelected: any;
  // Reference of the New view created
  viewReference: any;
  public payrollSessionState = PayrollSessionState;
  index = 0;
  // array of Objects sended from children
  dataReceiverArray: any[] = [];
  // list of sessionBonus passed from child to the parent component
  public SessionBonusesList: SessionBonus[] = [];
  /**
   *childComps
   */
  @ViewChildren(VariableBonusesSectionComponent) childComps: QueryList<VariableBonusesSectionComponent>;
  /*
   *viewContainer
   */
  @ViewChild('vc', {read: ViewContainerRef}) viewContainer: ViewContainerRef;

  @ViewChild('s', { read: TemplateRef }) template: TemplateRef<null>;
  isGridValid = true;
  private subscriptions: Subscription[] = [];
  /*
   * permissions
   */
  public hasUpdatePayrollSessionPermission: boolean;
  public hasAffectSessionBonusPermission: boolean;
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private sessionService: SessionService,
              private exchangeBonusDataService: ExchangeBonusDataService,
              public authService: AuthService) {
    this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
      this.idSession = params[SharedConstant.ID_LOWERCASE] || 0;
    }));
    this.getSession(this.idSession);
  }

  /**
   * Add an another bonus component section to the page
   */
  public cloneTemplate(sessionBonusList?: SessionBonus[], BonusId?: number) {
    const sessionBonusListToUpdate = sessionBonusList ? sessionBonusList : [];
    const BonusIdToUpdate = BonusId ? BonusId : 0;
    const view: ViewRef = this.viewContainer.createEmbeddedView(this.template);
    /*
      Call Exchange Service to save data
    */
    const sessionBonusSection = new SessionBonusSection();
    sessionBonusSection.index = this.index;
    sessionBonusSection.BonusId = BonusIdToUpdate;
    sessionBonusSection.sessionId = this.idSession;
    sessionBonusSection.viewReference = Object.assign({}, view);
    sessionBonusSection.sessionBonusList = Object.assign({}, sessionBonusListToUpdate);
    this.exchangeBonusDataService.appendBonusSessionToSharedData(sessionBonusSection);
    this.index++;
  }

  /**
   * this method will be called to retrieve the session object from the server
   */
  getSession(id) {
    this.subscriptions.push(this.sessionService.getById(id)
      .subscribe(
        data => {
          this.sessionInfos = data;
          this.isClosed = this.sessionInfos.State === PayrollSessionState.Closed;
          this.sessionInfos.Month = new Date(this.sessionInfos.Month);
        }
      ));
  }

  /**
   * this method will be called to retrieve the session object from the server
   */
  getBonusSession(id) {
    this.subscriptions.push(this.sessionService.getSessionBonusOrderedByBonusId(id)
      .subscribe(
        data => {
          if (data) {
            const key = Object.keys(data);
            if (key !== null) {
              key.forEach(prop => {
                  const value = data[prop];
                  this.cloneTemplate(value, ((prop as any) as number));
                }
              );
            }
          }
        }
      ));
  }

  /**
   * Initialise the component
   */
  ngOnInit() {
    this.hasUpdatePayrollSessionPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.UPDATE_SESSION);
    this.hasAffectSessionBonusPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.AFFECT_SESSION_BONUS);
    this.getBonusSession(this.idSession);
    if (this.sessionInfos === undefined || this.sessionInfos === null) {
      this.router.navigate([SessionConstant.SESSION_URL]);
    }
  }

  /**
   * Retrieve data from the component child
   */
  receiveData(childViewContext) {
    const childViewData = this.dataReceiverArray.filter(x => x.index === childViewContext.index)[0];
    if (childViewData !== undefined) {
      // Edit an item already exist in the dataReceiverArray
      const index = this.dataReceiverArray.indexOf(childViewData);
      this.dataReceiverArray[index].data = childViewContext.data;
    } else {
      // add New item in the dataReceiverArray
      this.dataReceiverArray.push(childViewContext);
    }
  }

  receiveValidation(event) {
    this.isGridValid = event;
  }

  /**
   * this method will be called to navigate to next url
   */
  public onNextClick() {
    this.sessionInfos.State = PayrollSessionState.Bonus;
    this.subscriptions.push(this.sessionService.updateSessionStates(this.sessionInfos).subscribe(res => {
      this.router.navigateByUrl(SessionConstant.LOAN_SESSION_URL.concat(this.idSession.toString()), {skipLocationChange: true});
    }));
  }

  /**
   *  Remove an added bonus section from the page
   */
  deleteViewFromContainer(reference, data) {
    // find the index of the view from a reference
    const position = this.viewContainer.indexOf(data);
    // remove the view
    this.viewContainer.remove(position);
    // remove all ligne in the data receiver with the view index
    this.dataReceiverArray = this.dataReceiverArray.filter(x => x.index !== reference);
  }

  /**
   * Go to previous state of session
   */
  public onPreviousClik(): void {
    this.router.navigateByUrl(AttendanceConstant.ATTENDANCE_URL.concat(this.idSession.toString()), {skipLocationChange: true});
  }

  receiveBonusSelected($event) {
    this.bonusIsSelected = $event;
  }

  ngOnDestroy(): void {
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }
}
