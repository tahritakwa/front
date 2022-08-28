import { Component, OnInit, Input } from '@angular/core';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { isPlainObject, isBoolean } from '../../../stark-permissions/utils/utils';
import { Module } from '../../../models/auth/module.model';
import { SubModule } from '../../../models/auth/submodule.model';

@Component({
  selector: 'app-role-config-category-treeview',
  templateUrl: './role-config-category-treeview.component.html',
  styleUrls: ['./role-config-category-treeview.component.scss']
})

export class RoleConfigCategoryTreeviewComponent implements OnInit {
  /* Form Group */
  @Input() roleConfigData: any[];
  @Input() allRoleConfigData: any[];
  @Input() searching;
  @Input() modules;
  @Input() filtredMenu;
  selectedKeyForRoleConfig: any[] = [];
  selectedKeyForRoleConfigCategory: any[] = [];
  public allRolesConstant = SharedConstant.ALLROLE;

  constructor() {
  }

  ngOnInit(): void {
  }

  /**
   * Initialization of checked or unchecked element of treeView
   * */
  // public initListOfRoleConfig(): void {
  //   if (this.roleConfigCategoryData && this.roleConfigCategoryData.length > 0 ) {
  //     // Fetch list of module
  //     this.roleConfigCategoryData.forEach(rConfigCategory => {
  //       rConfigCategory.IsToCheckModule = undefined;
  //       if (rConfigCategory.RoleConfig && rConfigCategory.RoleConfig.length > 0) {
  //         rConfigCategory.RoleConfig.forEach(rConfigelement => {
  //           if (this.allRoleConfigData != null && this.allRoleConfigData.find(x => x.Id === rConfigelement.Id) === undefined) {
  //             this.allRoleConfigData.push(rConfigelement);
  //           }
  //         });
  //         rConfigCategory.RoleConfig.forEach(rConfig => {
  //           // Set isToCheck to true if element isActive
  //        rConfig.IsToCheckModule = rConfig.IsActive ? rConfig.IsActive : undefined;
  //        });
  //        const rConfigLength = rConfigCategory.RoleConfig .filter(x => x.IsActive === true).length;
  //        rConfigCategory.IsToCheckModule = rConfigLength === rConfigCategory.RoleConfig.length ? true : undefined;
  //        if (rConfigCategory.IsToCheckModule === undefined) {
  //         rConfigCategory.IsIndeterminate = rConfigLength >= 1 && rConfigLength < rConfigCategory.RoleConfig.length ? true : undefined;
  //        }
  //       }
  //     });
  //   }
  // }



  /**
   * Selection module
   * @param $event
   * @param isToCheck
   * @param isActive
   */
  public handleSelectionRoleConfig({ index, dataItem }): void {

    const indexes = index.split('_');//generates an array [MODULE_INDEX, SUBMODULE_INDEX, PERMISSION_INDEX]
    if(indexes.length==1){//module selected
      if(!this.searching){
      const moduleAtIndex:Module = this.modules[indexes[0]];
      for (let subModuleIndex=0; subModuleIndex<moduleAtIndex.subModules.length; subModuleIndex++) {//checking all submodules for this module
        const subModuleAtIndex:SubModule = moduleAtIndex.subModules[subModuleIndex];
        if(moduleAtIndex.IsIndeterminate){
          moduleAtIndex.subModules[subModuleIndex].isChecked= true;
        }else {
          moduleAtIndex.subModules[subModuleIndex].isChecked=!moduleAtIndex.isChecked;
        }

        moduleAtIndex.IsIndeterminate = false;
        for (let permissionIndex=0; permissionIndex<subModuleAtIndex.permissions.length; permissionIndex++) {//checking or un-checking all permissions for this submodule
          if(subModuleAtIndex.IsIndeterminate){
            subModuleAtIndex.permissions[permissionIndex].isChecked = true;
          }else {
            subModuleAtIndex.permissions[permissionIndex].isChecked=!moduleAtIndex.isChecked;
          }
          subModuleAtIndex.IsIndeterminate = false;
        }
      }
      dataItem.isChecked =dataItem.IsIndeterminate? true: !dataItem.isChecked;
      dataItem.IsIndeterminate = false;
    }else{
      const moduleAtIndex:Module = this.filtredMenu[indexes[0]];
      var indexOfModel = this.modules.findIndex(x=> x.id === moduleAtIndex.id);
      for (let subModuleIndex=0; subModuleIndex<moduleAtIndex.subModules.length; subModuleIndex++) {
        const subModuleAtIndex:SubModule = moduleAtIndex.subModules[subModuleIndex];
        if(moduleAtIndex.IsIndeterminate){
          moduleAtIndex.subModules[subModuleIndex].isChecked= true;
          this.modules[indexOfModel].subModules[subModuleIndex].isChecked=true;
        }else {
          moduleAtIndex.subModules[subModuleIndex].isChecked=!moduleAtIndex.isChecked;
          this.modules[indexOfModel].subModules[subModuleIndex].isChecked = !moduleAtIndex.isChecked;
        }

        moduleAtIndex.IsIndeterminate = false;
        for (let permissionIndex=0; permissionIndex<subModuleAtIndex.permissions.length; permissionIndex++) {
          if(subModuleAtIndex.IsIndeterminate){
            subModuleAtIndex.permissions[permissionIndex].isChecked = true;
            this.modules[indexOfModel].subModules[subModuleIndex].permissions[permissionIndex].isChecked=true;
          }else {
            subModuleAtIndex.permissions[permissionIndex].isChecked=!moduleAtIndex.isChecked;
            this.modules[indexOfModel].subModules[subModuleIndex].permissions[permissionIndex].isChecked=!moduleAtIndex.isChecked;
          }
          subModuleAtIndex.IsIndeterminate = false;
        }
      }
      dataItem.isChecked =dataItem.IsIndeterminate? true: !dataItem.isChecked;
      dataItem.IsIndeterminate = false;
      this.modules[indexOfModel].isChecked =  dataItem.isChecked;
      this.modules[indexOfModel].IsIndeterminate =  dataItem.IsIndeterminate;

    }

  } else if(indexes.length==2){//submodule selected
    if(!this.searching){
      const subModuleAtIndex:SubModule = this.modules[indexes[0]].subModules[indexes[1]];
      for (let permissionIndex=0; permissionIndex<subModuleAtIndex.permissions.length; permissionIndex++) {//checking or un-checking all permissions for this submodule
        if(subModuleAtIndex.IsIndeterminate){
          subModuleAtIndex.permissions[permissionIndex].isChecked = true;
        }else {
          subModuleAtIndex.permissions[permissionIndex].isChecked=!subModuleAtIndex.isChecked;
        }
      }
      dataItem.isChecked = dataItem.IsIndeterminate? true: !dataItem.isChecked;
      dataItem.IsIndeterminate = false;
      subModuleAtIndex.IsIndeterminate = false;
      subModuleAtIndex.isChecked = dataItem.isChecked;
      if(this.modules[indexes[0]].subModules.filter(x => x.isChecked).length == this.modules[indexes[0]].subModules.length){
        this.modules[indexes[0]].isChecked = true;
        this.modules[indexes[0]].IsIndeterminate = false;
      } else if(this.modules[indexes[0]].subModules.filter(x => x.isChecked).length == 0){
        this.modules[indexes[0]].isChecked = false;
        this.modules[indexes[0]].IsIndeterminate = false;
      } else {
        this.modules[indexes[0]].IsIndeterminate = true;
      }
      } else {
        const subModuleAtIndex:SubModule = this.filtredMenu[indexes[0]].subModules[indexes[1]];
        var indexOfModel = this.modules.findIndex(x=> x.id === this.filtredMenu[indexes[0]].id);
      for (let permissionIndex=0; permissionIndex<subModuleAtIndex.permissions.length; permissionIndex++) {//checking or un-checking all permissions for this submodule
        if(subModuleAtIndex.IsIndeterminate){
          subModuleAtIndex.permissions[permissionIndex].isChecked = true;
          this.modules[indexOfModel].subModules[indexes[1]].permissions[permissionIndex].isChecked=true;
        }else {
          subModuleAtIndex.permissions[permissionIndex].isChecked=!subModuleAtIndex.isChecked;
          this.modules[indexOfModel].subModules[indexes[1]].permissions[permissionIndex].isChecked=!subModuleAtIndex.isChecked;
        }
      }
      dataItem.isChecked = dataItem.IsIndeterminate? true: !dataItem.isChecked;
      dataItem.IsIndeterminate = false;
      this.modules[indexOfModel].subModules[indexes[1]].isChecked =  dataItem.isChecked;
      this.modules[indexOfModel].subModules[indexes[1]].IsIndeterminate =  dataItem.IsIndeterminate;

      subModuleAtIndex.IsIndeterminate = false;
      subModuleAtIndex.isChecked = dataItem.isChecked;
      this.modules[indexOfModel].subModules[indexes[1]].IsIndeterminate = false;
      this.modules[indexOfModel].subModules[indexes[1]].isChecked = dataItem.isChecked;

      if(this.modules[indexOfModel].subModules.filter(x => x.isChecked).length == this.modules[indexOfModel].subModules.length){
        this.modules[indexOfModel].isChecked = true;
        this.modules[indexOfModel].IsIndeterminate = false;
        this.filtredMenu[indexes[0]].isChecked = true;
        this.filtredMenu[indexes[0]].IsIndeterminate = false;

      } else if(this.modules[indexOfModel].subModules.filter(x => x.isChecked).length == 0){
        this.modules[indexOfModel].isChecked = false;
        this.modules[indexOfModel].IsIndeterminate = false;
        this.filtredMenu[indexes[0]].isChecked = false;
        this.filtredMenu[indexes[0]].IsIndeterminate = false;
      } else {
        this.modules[indexes[0]].IsIndeterminate = true;
        this.filtredMenu[indexes[0]].IsIndeterminate = true;
      }
      }
    } else {
      if(!this.searching){
      dataItem.isChecked = !dataItem.isChecked;
      this.modules[indexes[0]].subModules[indexes[1]].permissions[indexes[2]].isChecked = dataItem.isChecked;
      if(this.modules[indexes[0]].subModules[indexes[1]].permissions.filter(x => x.isChecked).length == this.modules[indexes[0]].subModules[indexes[1]].permissions.length){
        this.modules[indexes[0]].subModules[indexes[1]].isChecked = true;
        this.modules[indexes[0]].subModules[indexes[1]].IsIndeterminate = false;
      } else if(this.modules[indexes[0]].subModules[indexes[1]].permissions.filter(x => x.isChecked).length == 0){
        this.modules[indexes[0]].subModules[indexes[1]].isChecked = false;
        this.modules[indexes[0]].subModules[indexes[1]].IsIndeterminate = false;
      } else {
        this.modules[indexes[0]].subModules[indexes[1]].IsIndeterminate = true;
        this.modules[indexes[0]].subModules[indexes[1]].isChecked = false;
      }
      if(this.modules[indexes[0]].subModules.filter(x => x.isChecked).length == this.modules[indexes[0]].subModules.length){
        this.modules[indexes[0]].isChecked = true;
        this.modules[indexes[0]].IsIndeterminate = false;
      } else if(this.modules[indexes[0]].subModules.filter(x => x.isChecked).length == 0 && this.modules[indexes[0]].subModules.filter(x => x.IsIndeterminate).length == 0){
        this.modules[indexes[0]].isChecked = false;
        this.modules[indexes[0]].IsIndeterminate = false;
      } else {
        this.modules[indexes[0]].IsIndeterminate = true;
        this.modules[indexes[0]].isChecked = false;
      }
      }else {
        dataItem.isChecked = !dataItem.isChecked;
        var modelIndex = this.modules.findIndex(x=> x.id === this.filtredMenu[indexes[0]].id );
        this.modules[modelIndex].subModules[indexes[1]].permissions[indexes[2]].isChecked = dataItem.isChecked;

      if(this.modules[modelIndex].subModules[indexes[1]].permissions.filter(x => x.isChecked).length == this.modules[modelIndex].subModules[indexes[1]].permissions.length){
        this.modules[modelIndex].subModules[indexes[1]].isChecked = true;
        this.modules[modelIndex].subModules[indexes[1]].IsIndeterminate = false;
        this.filtredMenu[indexes[0]].subModules[indexes[1]].isChecked = true;
        this.filtredMenu[indexes[0]].subModules[indexes[1]].IsIndeterminate = false;
      } else if(this.modules[modelIndex].subModules[indexes[1]].permissions.filter(x => x.isChecked).length == 0){
        this.modules[modelIndex].subModules[indexes[1]].isChecked = false;
        this.modules[modelIndex].subModules[indexes[1]].IsIndeterminate = false;
        this.filtredMenu[indexes[0]].subModules[indexes[1]].isChecked = false;
        this.filtredMenu[indexes[0]].subModules[indexes[1]].IsIndeterminate = false;
      } else {
        this.modules[modelIndex].subModules[indexes[1]].IsIndeterminate = true;
        this.modules[modelIndex].subModules[indexes[1]].isChecked = false;
        this.filtredMenu[indexes[0]].subModules[indexes[1]].IsIndeterminate = true;
        this.filtredMenu[indexes[0]].subModules[indexes[1]].isChecked = false;
      }
      if(this.modules[modelIndex].subModules.filter(x => x.isChecked).length == this.modules[modelIndex].subModules.length){
        this.modules[modelIndex].isChecked = true;
        this.modules[modelIndex].IsIndeterminate = false;
        this.filtredMenu[indexes[0]].isChecked = true;
        this.filtredMenu[indexes[0]].IsIndeterminate = false;
      } else if(this.modules[modelIndex].subModules.filter(x => x.isChecked).length == 0 && this.modules[modelIndex].subModules.filter(x => x.IsIndeterminate).length == 0){
        this.modules[modelIndex].isChecked = false;
        this.modules[modelIndex].IsIndeterminate = false;
        this.filtredMenu[indexes[0]].isChecked = false;
        this.filtredMenu[indexes[0]].IsIndeterminate = false;
      } else {
        this.modules[modelIndex].IsIndeterminate = true;
        this.modules[modelIndex].isChecked = false;
        this.filtredMenu[indexes[0]].IsIndeterminate = true;
        this.filtredMenu[indexes[0]].isChecked = false;
      }
      }
    }

  }

  // public checkIsAllRole(itemToCheck) {
  //   return (isPlainObject(itemToCheck) || !isBoolean(itemToCheck)) &&
  //   ((itemToCheck.Code.trim() === SharedConstant.ALLROLE || itemToCheck.Label.trim() === SharedConstant.ALLROLE) ||
  //   (itemToCheck.Code.trim() === SharedConstant.AllRole || itemToCheck.Label.trim() === SharedConstant.AllRole));;
  // }

  // public checkIsSuperAdmin(itemToCheck) {
  //   return (isPlainObject(itemToCheck) || !isBoolean(itemToCheck)) &&
  //   ((itemToCheck.Code.trim() === SharedConstant.SUPERADMIN || itemToCheck.Label.trim() === SharedConstant.SUPERADMIN) ||
  //   (itemToCheck.Code.trim() === SharedConstant.SuperAdmin || itemToCheck.Label.trim() === SharedConstant.SuperAdmin));
  // }

  /**
   * * handleSelectionSuperAdmin
   * */
// public handleSelectionSuperAdmin($event) {
//   let checkValue;
//   if (!$event.dataItem.IsActive || $event.dataItem.IsActive === undefined) {
//     checkValue = true;
//   }
//   $event.dataItem.IsActive = checkValue;
//   $event.dataItem.IsToCheck = checkValue;
//   $event.dataItem.IsToCheckModule = checkValue;

//   $event.dataItem.IsActive = checkValue;
//   $event.dataItem.IsToCheck = checkValue;
//   $event.dataItem.IsToCheckModule = checkValue;

//   this.roleConfigCategoryData.forEach(rConfigCategory => {
//     if (rConfigCategory.RoleConfig && rConfigCategory.RoleConfig.length > 0) {
//       rConfigCategory.RoleConfig.forEach(b => {
//         if (this.checkIsSuperAdmin(b)) {
//           b.IsToDisable = false;
//         } else if (!this.checkIsAllRole(b)) {
//           b.IsToDisable = checkValue === true ? true : false;
//         }
//         b.IsActive = checkValue;
//         b.IsToCheck = checkValue;
//         b.IsToCheckModule = checkValue;
//       });
//     }
//     if (this.checkIsSuperAdmin(rConfigCategory)) {
//        rConfigCategory.IsToDisable = false;
//      } else if (!this.checkIsAllRole(rConfigCategory)) {
//        rConfigCategory.IsToDisable = checkValue === true ? true : false;
//      }
//      rConfigCategory.IsActive = checkValue;
//      rConfigCategory.IsToCheck = checkValue;
//      rConfigCategory.IsToCheckModule = checkValue;
//    });
// }

/**
 * handleSelectionAllRole
 */
// public handleSelectionAllRole($event) {
//   let checkValue;
//   if (!$event.dataItem.IsActive || $event.dataItem.IsActive === undefined) {
//     checkValue = true;
//   }
//   $event.dataItem.IsActive = checkValue;
//   $event.dataItem.IsToCheck = checkValue;
//   $event.dataItem.IsToCheckModule = checkValue;
//   this.roleConfigCategoryData.forEach(rConfigCategory => {
//     if (rConfigCategory.RoleConfig && rConfigCategory.RoleConfig.length > 0) {
//       rConfigCategory.RoleConfig.forEach(b => {
//         if (!this.checkIsAllRole(b) && !this.checkIsSuperAdmin(b)) {
//           b.IsActive = checkValue;
//           b.IsToCheck = checkValue;
//           b.IsToCheckModule = checkValue;
//          }
//       });
//     }
//     if (!this.checkIsAllRole(rConfigCategory) && !this.checkIsSuperAdmin(rConfigCategory)) {
//       rConfigCategory.IsActive = checkValue;
//       rConfigCategory.IsToCheck = checkValue;
//       rConfigCategory.IsToCheckModule = checkValue;
//      }
//    });
// }

// public handleSelection($event, isToCheck?: boolean, isActive?: boolean) {
//   if ($event && $event.dataItem) {
//     // if module has children module ==> show list of functionnality releated to selected module and sub modules
//     if ($event.dataItem.RoleConfig) {
//       this.roleConfigData = [];
//       // fetch list of sub module
//       if ($event.dataItem.RoleConfig) {
//         $event.dataItem.RoleConfig.forEach(moduleByRole => {
//           // If IsToCheck ==true ==> change state of checkbox of current sub module
//           if (isToCheck) {
//             moduleByRole.IsActive = isActive;
//           }
//         });
//       }
//     } else {
//       // If IsToCheck ==true ==> change state of checkbox of selected module
//       if (isToCheck) {
//         $event.dataItem.IsActive = isActive;
//       }

//     }
//     // If IsToCheck ==true ==> change state of checkbox of functionnality releated to selected module and sub modules
//     if (isToCheck) {
//       this.selectedKeyForRoleConfig = [];
//       this.selectedKeyForRoleConfig.push($event.index);
//     }
//   }
// }
  // public loadModulesAndFeatures() {
  //   this.roleConfigCategoryData.forEach(rConfigCategory => {
  //     if (rConfigCategory.RoleConfig  && rConfigCategory.RoleConfig.length > 0) {
  //       rConfigCategory.RoleConfig.forEach(rConfigelement => {
  //         if (this.roleConfigData != null && this.roleConfigData.find(x => x.Id === rConfigelement.Id) === undefined) {
  //           this.roleConfigData.push(rConfigelement);
  //         }
  //       });

  //       rConfigCategory.RoleConfig.forEach(rConfig => {
  //         if (rConfig.IsActive) {
  //         }
  //       });
  //     }
  //   });
  // }

  public fetchChildren(node: any): Observable<any[]> {
    return of(node.items);
  }

  // public hasChildren(node: any): boolean {
  //   return (node.RoleConfig && node.RoleConfig.length > 0);
  // }

  // public hasChildrenModule(node: any): boolean {
  //   return (node.RoleConfig && node.RoleConfig.length > 0);
  // }

  // public fetchChildrenModule(node: any): Observable<any[]> {
  //   return of(node.RoleConfig);
  // }

   /**
   * Check module
   * @param event
   * @param dataItem
   */
  // public checkRoleConfigValue(event?: any, dataItem?) {
  //   if (event && dataItem ) {
  //     if (this.checkIsSuperAdmin(dataItem)) {
  //       // Change state of checkbox of current module
  //       dataItem.IsActive = dataItem.IsActive;
  //       event.checked = dataItem.IsActive;
  //       dataItem.IsToCheckModule = dataItem.IsActive ? dataItem.IsActive : undefined;
  //       dataItem.IsIndeterminate = undefined;
  //     } else if (!this.checkIsAllRole(dataItem) && !this.checkIsSuperAdmin(dataItem)) {
  //       // Change state of checkbox of current module
  //       dataItem.IsActive = event.checked;
  //       dataItem.IsToCheckModule = dataItem.IsActive ? dataItem.IsActive : undefined;
  //       dataItem.IsIndeterminate = undefined;
  //       // If checked node has children module
  //     if (dataItem.RoleConfig) {
  //       // fetch list of sub modules
  //       this.checkModuleChildrenValue(dataItem);
  //     }
  //     // If checked node has list of functionnality
  //     if (dataItem.IdRoleConfigCategoryNavigation) {
  //       // If Node has parent
  //       if (event.parentNode) {
  //         this.checkRoleConfigParentValue(dataItem.IdRoleConfigCategoryNavigation);
  //       }
  //     }
  //   }
  //   }
  //  }

  /**
   * Check module parent
   * @param dataItem
   */
  // private checkRoleConfigParentValue(dataItem) {
  //   const roleConfigParent = this.roleConfigCategoryData.find(x => x.Id === dataItem.Id);
  //   if (roleConfigParent && (!this.checkIsAllRole(roleConfigParent && !this.checkIsSuperAdmin(roleConfigParent)))) {
  //     const parentNode: any = document.getElementById(roleConfigParent.Code);
  //     // Change state of checkbox of parent node of current module
  //     this.changeStateOfCheckBox(parentNode, roleConfigParent, roleConfigParent.RoleConfig, true);
  //   }
  // }

  /**
   * Check module children
   * @param dataItem
   */
  // private checkModuleChildrenValue(dataItem) {
  //   dataItem.RoleConfig.forEach(children => {
  //     // Change state of checkbox of sub modules
  //     children.IsActive = dataItem.IsActive;
  //     children.IsToCheckModule = children.IsActive ? children.IsActive : undefined;
  //     children.IsIndeterminate = undefined;
  //   });
  // }
  /**
   * Change state of checkbox
   * @param parentNode
   * @param moduleParent
   * @param children
   * @param isModule
   */
  // private changeStateOfCheckBox(parentNode, moduleParent, children, isModule): void {

  //   let listOfCompterOfCheckedState = 0;
  //   let listOfCompterOfNoneState = 0;
  //   let idx = 0;
  //   let item;
  //   if (children) {
  //     // calculate number of Checked or unchecked element
  //     while (item = children[idx]) {
  //       let childElement: any;
  //       if (isModule) {
  //         childElement = document.getElementById(item.Code.trim());
  //       } else {
  //         childElement = document.getElementById(item.IdFunctionality.trim());
  //       }
  //       if (childElement && childElement.checked) {
  //         listOfCompterOfCheckedState++;
  //       } else if (childElement && !childElement.indeterminate) {
  //         listOfCompterOfNoneState++;
  //       }
  //       idx += 1;
  //     }

  //     // if list of checked children equals to list of children of current element ==> check checkbox of current element
  //     if (listOfCompterOfCheckedState === children.length) {
  //       moduleParent.IsActive = true;
  //       moduleParent.IsToCheckModule = true;
  //       moduleParent.IsIndeterminate = undefined;
  //       if (parentNode) {
  //         parentNode.checked = true;
  //         parentNode.indeterminate = false;
  //       }
  //     } else if (listOfCompterOfNoneState === children.length) {
  //       // if list of unChecked children equals to list of children of current element ==> uncheck checkbox of current element
  //       moduleParent.IsActive = false;
  //       moduleParent.IsToCheckModule = undefined;
  //       moduleParent.IsIndeterminate = undefined;
  //       if (parentNode) {
  //         parentNode.checked = false;
  //         parentNode.indeterminate = false;
  //       }
  //     } else {
  //       // Indeterminate checkbox of current element
  //       moduleParent.IsActive = true;
  //       moduleParent.IsToCheckModule = undefined;
  //       moduleParent.IsIndeterminate = true;
  //       if (parentNode) {
  //         parentNode.checked = false;
  //         parentNode.indeterminate = true;
  //       }
  //     }
  //   }
  // }
}
