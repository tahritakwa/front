import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { CandidacyConstant } from '../../../constant/rh/candidacy.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { RecruitmentState } from '../../../models/enumerators/recruitment-state.enum';
import { Recruitment } from '../../../models/rh/recruitment.model';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { Filter, Operation, PredicateFormat, Relation } from '../../../shared/utils/predicate';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { CandidacySteperComponent } from '../../components/candidacy-steper/candidacy-steper.component';
import { RecruitmentService } from '../../services/recruitment/recruitment.service';
import { RecruitmentNeedComponent } from '../recruitment-need/recruitment-need.component';

@Component({
  selector: 'app-add-recruitment',
  templateUrl: './add-recruitment.component.html',
  styleUrls: ['./add-recruitment.component.scss']
})
export class AddRecruitmentComponent implements OnInit, OnDestroy {

  @ViewChild('recruitmentNeedViewChild') recruitmentNeedViewChild: RecruitmentNeedComponent;
  @ViewChild('candidacySteperiewChild') candidacySteperiewChild: CandidacySteperComponent;
  // # begin attribut region
  hideCardBody = false;
  recruitmentId = 0;
  currentRecruitment: Recruitment;
  isRecruitmentReady = false;
  // recruitment processus permission
  public hasFullRecuitmentPermission: boolean;
  // # end attribut region
  private subscriptions: Subscription[] = [];
  recruitmentState = RecruitmentState;

  constructor(private activatedRoute: ActivatedRoute, private recruitmentService: RecruitmentService,
    protected validationService: ValidationService, public authService: AuthService) {
    this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
      this.recruitmentId = params[SharedConstant.ID_LOWERCASE] || NumberConstant.ZERO;
    }));
    if (this.recruitmentId !== NumberConstant.ZERO) {
      this.getRecruitmentToUpdate();
    }
  }

  // # begin ng region
  ngOnInit() {
    this.hasFullRecuitmentPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.FULL_RECRUITMENT);
  }
  // # end ng region

  // # begin method region
  prepareCandidacyPradicate() {
    const myPredicate = new PredicateFormat();
    myPredicate.Filter = new Array<Filter>();
    myPredicate.Filter.push(new Filter(CandidacyConstant.ID_RECRUITMENT, Operation.eq, this.recruitmentId));
    myPredicate.Relation = new Array<Relation>();
    myPredicate.Relation.push.apply(myPredicate.Relation,
      [new Relation(CandidacyConstant.ID_CANDIDATE_NAVIGATION)]);
    myPredicate.Relation.push.apply(myPredicate.Relation,
      [new Relation(CandidacyConstant.ID_RECRUTEMENT_NAVIGATION)]);
    myPredicate.Relation.push.apply(myPredicate.Relation,
      [new Relation(CandidacyConstant.INTERVIEW)]);
    myPredicate.Relation.push.apply(myPredicate.Relation,
      [new Relation(CandidacyConstant.OFFER)]);
    return myPredicate;
  }

  getRecruitmentToUpdate() {
    this.subscriptions.push(this.recruitmentService.getById(this.recruitmentId).subscribe(result => {
      this.currentRecruitment = result as Recruitment;
      this.isRecruitmentReady = true;
    }));
  }

  refreshRecruitmentNeed() {
    if (this.recruitmentNeedViewChild) {
      this.subscriptions.push(this.recruitmentService.getById(this.recruitmentId).subscribe((data) => {
        this.currentRecruitment = data;
        this.recruitmentNeedViewChild.ngOnInit();
      }));
    }
  }
  // # end method region

  changeCurrentRecruitment($event) {
    this.currentRecruitment = $event;
  }

  isFormChanged(): boolean {
    if (this.candidacySteperiewChild.candidacyViewChild.formGroup.touched) {
      return true;
    }
    return false;
  }

  /**
   * this method will be called by CanDeactivateGuard service to check the leaving component possibility
   */
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.candidacySteperiewChild && this.candidacySteperiewChild.candidacyViewChild.formGroup) {
      return this.validationService.handleCanDeactivateToLeaveCurrentComponent(this.isFormChanged.bind(this));
    }
    return this.recruitmentNeedViewChild.canDeactivate();
  }

  ngOnDestroy(): void {
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }

}
