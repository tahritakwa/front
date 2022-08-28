import { Component, OnDestroy, OnInit } from '@angular/core';
import { AccountingConfigurationService } from '../../accounting/services/configuration/accounting-configuration.service';
import { AccountingConfigurationConstant } from '../../constant/accounting/accounting-configuration.constant';
import { Subscription } from 'rxjs/Subscription';
import { CrmConfigurationService } from '../../crm/services/Configuration/crm-configuration.service';
import { CrmConstant } from '../../constant/crm/crm.constant';
import { CompanyService } from '../services/company/company.service';
import { MailingConfigurationService } from '../../mailing/services/mailing-configuration/mailing-configuration.service';
import { MailingConstant } from '../../constant/mailing/mailing.constant';
import { RoleConfigConstant } from '../../Structure/_roleConfigConstant';
import { StarkRolesService } from '../../stark-permissions/service/roles.service';
import { ModulesSettingsService } from '../../shared/services/modulesSettings/modules-settings.service';
import { SharedConstant } from '../../constant/shared/shared.constant';
import { GarageSettingsService } from '../../garage/services/garage-settings/garage-settings.service';
import { RhPayrollSettingsService } from '../../rh/services/rh-payroll-settings/rh-payroll-settings.service';
import { ResourceService } from '../../shared/services/resource/resource.service';
import {ManufacturingConfigurationService} from '../../manufacturing/configuration/manufacturing-configuration.service';
import {ManufacturingConstant} from '../../constant/manufuctoring/manufacturing.constant';
import { AuthEnvironment } from '../../login/Authentification/models/auth-environment';
import { AuthBuildPropertiesService } from '../services/AuthBuildPropertiesService';

@Component({
  selector: 'app-version',
  templateUrl: './version.component.html',
  styleUrls: ['./version.component.scss']
})
export class VersionComponent implements OnInit {
  private subscription: Subscription;

  public crmProperties;
  public manufacturingProperties;
  public mailingProperties;
  public commProperties;
  public accountingBuildProperties;
  public garageProperties;
  public rhPayrollProperties;
  public isRole: boolean;
  public authEnvironment : AuthEnvironment;
  constructor(private manufacturingConfigurationService: ManufacturingConfigurationService,
    private crmConfigurationService: CrmConfigurationService,
    private accountingConfigurationService: AccountingConfigurationService,
    private companyService: CompanyService, private roleService: StarkRolesService,
    private mailingConfigurationService: MailingConfigurationService,
    private garageSettingsService: GarageSettingsService,
    private rhPayrollSettingsService: RhPayrollSettingsService,
    private authBuildPropertiesService: AuthBuildPropertiesService) {
  }

  ngOnInit() {
    this.loadCommRhPropertiesBuild();
    this.loadManufacturingPropertiesBuild();
    this.loadAuthBuildProperties();
    this.companyService.getModulesSettings().subscribe((modules:any) => {
      if (modules != null) {
        //Find if existing crm module
        if (modules.CRM) {
          this.loadCrmPropertiesBuild();
        }
        //Find if existing accounting module
        if (modules.COMPTABILITE) {
          this.loadAccountingBuildProperties();
        }
        //Find if existing accounting module
        if (modules.GARAGE) {
          this.loadGaragePropertiesBuild();
        }
        //Find if existing accounting module
        if (modules.RH) {
          this.loadRhPayrollPropertiesBuild();
        }
      }
    });



    //this.roleService.hasOnlyRoles([RoleConfigConstant.CRM])
    //  .then(isRole => {
    //    if (isRole) {
    //      this.loadCrmPropertiesBuild();
    //      //this.loadMailingPropertiesBuild();
    //    }
    //  });

    //this.loadCommRhPropertiesBuild();
    //this.loadGaragePropertiesBuild();
    //this.loadRhPayrollPropertiesBuild();
    //this.roleService.hasOnlyRoles([RoleConfigConstant.ACCOUNTING])
    //  .then(isRole => {
    //    this.isRole = isRole;
    //    if (isRole) {
    //      this.loadAccountingBuildProperties();
    //    }
    //  });
  }

  private loadCrmPropertiesBuild() {
    this.crmConfigurationService.getJavaGenericService()
      .getData(CrmConstant.CRM_VERSION).subscribe(crmProperties => {
      this.crmProperties = crmProperties;
      this.crmProperties.buildVersion = this.crmProperties.buildVersion.replace('-SNAPSHOT', '');
      this.crmProperties.crmUrl =  crmProperties.crmUrl;
    });
  }
  //private loadMailingPropertiesBuild() {
  //  this.mailingConfigurationService.getJavaGenericService()
  //    .getData(MailingConstant.MAILING_VERSION).subscribe(mailingProperties => {
  //    this.mailingProperties = mailingProperties;
  //  });
  //}
  private loadAccountingBuildProperties() {
    this.accountingConfigurationService.getJavaGenericService()
      .getData(AccountingConfigurationConstant.ACCOUNTING_BUILD_PROPERTIES).subscribe(accountingBuildProperties => {
        this.accountingBuildProperties = accountingBuildProperties;
      });
  }

  private loadCommRhPropertiesBuild() {
    this.companyService.getCommRhVersionProperties().subscribe((commRhProperties: Array<any>) => {
      this.commProperties = commRhProperties;
    });
  }
  private loadGaragePropertiesBuild() {
    this.garageSettingsService.getGarageVersionProperties().subscribe((garageProperties: Array<any>) => {
      this.garageProperties = garageProperties;
    });
  }

  private loadRhPayrollPropertiesBuild() {
    this.rhPayrollSettingsService.getRhPayrollSettings().subscribe((rhPayrollProperties: Array<any>) => {
      this.rhPayrollProperties = rhPayrollProperties;
    });
  }

  private loadManufacturingPropertiesBuild() {
    this.manufacturingConfigurationService.getJavaGenericService()
      .getData(ManufacturingConstant.MANUFACTURING_VERSION).subscribe(manufacturingProperties => {
      this.manufacturingProperties = manufacturingProperties;
      this.manufacturingProperties.buildVersion = this.manufacturingProperties.buildVersion.replace('-SNAPSHOT', '');
      this.manufacturingProperties.manufacturingUrl =  manufacturingProperties.manufacturingUrl;
    });
  }
  private loadAuthBuildProperties() {
    this.authBuildPropertiesService.getAuthBuildProperties().subscribe((data)=>{
      this.authEnvironment = data;
    })
  }

}
