import {Component, OnDestroy, OnInit} from '@angular/core';
import {GeneralSettingsService} from '../../../shared/services/general-settings/general-settings.service';
import {GeneralSettings} from '../../../models/shared/general-settings';
import {GeneralSettingsConstant} from '../../../constant/shared/general-settings.constant';
import {GrowlService} from '../../../../COM/Growl/growl.service';
import {SwalWarring} from '../../../shared/components/swal/swal-popup';
import {BackgroundJobConstants} from '../../../shared/utils/background-job-constants';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {TranslateService} from '@ngx-translate/core';
import {Observable} from 'rxjs/Observable';
import {ValidationService} from '../../../shared/services/validation/validation.service';
import {PermissionConstant} from '../../../Structure/permission-constant';
import {Subscription} from 'rxjs/Subscription';
import { AuthService } from '../../../login/Authentification/services/auth.service';

@Component({
  selector: 'app-configure-review-manager',
  templateUrl: './configure-review-manager.component.html',
  styleUrls: ['./configure-review-manager.component.scss']
})
export class ConfigureReviewManagerComponent implements OnInit, OnDestroy {

  // priority values
  priorityLevels: string[] = ['1', '2', '3'];
  superiorLevels: string[] = ['1', '2', '3', '4', '5'];
  // data list holder
  reviewManagerSettings: Array<GeneralSettings> = [];

  // settings
  administratorPrioritySetting: GeneralSettings;
  superiorPrioritySetting: GeneralSettings;
  teamManagerPrioritySetting: GeneralSettings;
  superiorLevelPrioritySetting: GeneralSettings;
  public dropdownChanged = false;
  public hasUpdatePermission: boolean;
  private subscriptions: Subscription[] = [];

  constructor(private generalSettingsService: GeneralSettingsService,
              private growlService: GrowlService,
              private translateService: TranslateService,
              private swalWarrings: SwalWarring,
              private validationService: ValidationService,
              private authService: AuthService) {
    this.administratorPrioritySetting = new GeneralSettings();
    this.superiorPrioritySetting = new GeneralSettings();
    this.teamManagerPrioritySetting = new GeneralSettings();
    this.superiorLevelPrioritySetting = new GeneralSettings();
  }

  ngOnInit() {
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.UPDATE_GENERALSETTINGS);
    this.initReviewManagerSettings();
  }

  public confirmUpdate() {
    this.swalWarrings.CreateSwal(GeneralSettingsConstant.UPDATE_SETTING_CONFIRMATION_TEXT, GeneralSettingsConstant.WARNING,
      SharedConstant.VALIDATION_CONFIRM).then((result) => {
      if (result.value) {
        this.update();
      } else {
        this.growlService.InfoNotification(this.translateService.instant(BackgroundJobConstants.NO_CHANGES_HAVE_BEEN_MADE));
      }
    });
  }

  onValueChange() {
    this.dropdownChanged = true;
  }

  isFormChanged(): boolean {
    return this.dropdownChanged;
  }

  /**
   * this method will be called by CanDeactivateGuard service to check the leaving component possibility
   */
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.validationService.handleCanDeactivateToLeaveCurrentComponent(this.isFormChanged.bind(this));
  }

  ngOnDestroy(): void {
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }

  private initReviewManagerSettings() {
    this.subscriptions.push(this.generalSettingsService.getReviewManagerSettings().subscribe(data => {
      this.reviewManagerSettings = data;
      this.getAdministrationPriority();
      this.getSuperiorPriority();
      this.getTeamManagerPriority();
      this.getSuperiorLevel();
    }));
  }

  private update() {
    const prioritySetting = [];
    prioritySetting.push(this.administratorPrioritySetting);
    prioritySetting.push(this.superiorPrioritySetting);
    prioritySetting.push(this.teamManagerPrioritySetting);
    prioritySetting.push(this.superiorLevelPrioritySetting);
    this.dropdownChanged = false;
    this.subscriptions.push(this.generalSettingsService.updateReviewManagerSettings(prioritySetting).subscribe());
  }

  // prepare settings
  private getAdministrationPriority() {
    this.administratorPrioritySetting = this.reviewManagerSettings.find(x => x.Field === GeneralSettingsConstant.ADMINISTRATION_PRIORITY);
  }

  private getSuperiorPriority() {
    this.superiorPrioritySetting = this.reviewManagerSettings.find(x => x.Field === GeneralSettingsConstant.SUPERIOR_PRIORITY);
  }

  private getTeamManagerPriority() {
    this.teamManagerPrioritySetting = this.reviewManagerSettings.find(x => x.Field === GeneralSettingsConstant.TEAM_MANAGER_PRIORITY);
  }

  private getSuperiorLevel() {
    this.superiorLevelPrioritySetting = this.reviewManagerSettings.find(x => x.Field === GeneralSettingsConstant.SUPERIOR_Level);
  }

}
