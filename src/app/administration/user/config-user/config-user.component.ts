import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PredicateFormat, Filter, Operation, Relation } from '../../../shared/utils/predicate';
import { ModuleByUserService } from '../../services/module/module.service';
import { RoleConstant } from '../../../constant/Administration/role.constant';
import { UserService } from '../../services/user/user.service';
import { ObjectToSend } from '../../../models/sales/object-to-save.model';
import { User } from '../../../models/administration/user.model';
import { ModuleByUser } from '../../../models/administration/module-by-user.model';
import { FunctionnalityByUser } from '../../../models/administration/functionnality-by-user.model';
import { RoleTreeviewComponent } from '../../components/role-treeview/role-treeview.component';

@Component({
  selector: 'app-config-user',
  templateUrl: './config-user.component.html',
  styleUrls: ['./config-user.component.scss']
})

export class ConfigUserComponent implements OnInit {
  /* Form Group */
  moduleData: ModuleByUser[] = new Array<ModuleByUser>();
  functionnalityData: FunctionnalityByUser[] = new Array<FunctionnalityByUser>();
  allFunctionnalityData: FunctionnalityByUser[] = new Array<FunctionnalityByUser>();
  predicateForUserConfig: PredicateFormat;
  private id: number;
  private objectToSave: ObjectToSend;

  @ViewChild(RoleTreeviewComponent) private treeViewRole: RoleTreeviewComponent;

  constructor(public moduleByUserService: ModuleByUserService,
    private activatedRoute: ActivatedRoute,
    private router: Router, private serviceUser: UserService) {
    this.activatedRoute.params.subscribe(params => {
      this.id = +params['id'] || 0;
    });
  }

  private preparePredicate(): void {
    this.predicateForUserConfig = new PredicateFormat();
    this.predicateForUserConfig.Filter = new Array<Filter>();
    this.predicateForUserConfig.Filter.push(new Filter('IdUser', Operation.eq, this.id));
    this.predicateForUserConfig.Relation = new Array<Relation>();
    this.predicateForUserConfig.Relation.push.apply(this.predicateForUserConfig.Relation, [new Relation(RoleConstant.MODULE_BY_USER)]);
  }

  saveUserRoleConfig() {
    const valueToSaveForUser: User = new User();
    valueToSaveForUser.Id = this.id;
    valueToSaveForUser.FunctionnalityByUser = this.allFunctionnalityData;
    valueToSaveForUser.ModuleByUser = this.moduleData;
    this.objectToSave = new ObjectToSend(valueToSaveForUser);
    // this.serviceUser.updateRights(this.objectToSave).subscribe(data => {
    //   this.router.navigate([UserConstant.USER_URL_LIST], { skipLocationChange: true });
    // });
  }

  initalizeModulesAndFunctionnalities() {
    this.preparePredicate();
    this.moduleByUserService.getModulesByUser(this.predicateForUserConfig).subscribe(data => {
      this.moduleData = data;
      this.treeViewRole.moduleData = data;
      this.treeViewRole.initListOfModule();
    });
    this.moduleByUserService.getFunctionnalitiesByUser(this.predicateForUserConfig).subscribe(data => {
      this.allFunctionnalityData = data;
      this.treeViewRole.allFunctionnalityData = data;
      this.treeViewRole.initListOfModule();
    });
  }

  ngOnInit(): void {
    this.initalizeModulesAndFunctionnalities();
  }
}
