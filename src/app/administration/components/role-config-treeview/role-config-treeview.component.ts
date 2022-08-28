import { Component, OnInit, Input } from '@angular/core';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';
import { FunctionnalityByRole } from '../../../models/administration/functionnality-by-role.model';
import { ModuleByRole } from '../../../models/administration/module-by-role.model';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-role-config-treeview',
  templateUrl: './role-config-treeview.component.html',
  styleUrls: ['./role-config-treeview.component.scss']
})

export class RoleConfigTreeviewComponent implements OnInit {
  /* Form Group */
  @Input() roleConfigData: any[];
  @Input() moduleData: any[];
  @Input() allModuleData: any[];
  @Input() functionnalityData: any[];
  @Input() allFunctionnalityData: any[];
  selectedKeyForModule: any[] = [];
  selectedKeyForRoleConfig: any[] = [];

  constructor() {
  }

  ngOnInit(): void {
  }

  /**
   * Initialization of checked or unchecked element of treeView
   * */
  public initListOfRoleConfig(): void {
    if (this.roleConfigData && this.roleConfigData.length > 0 ) {
      // Fetch list of module
      this.roleConfigData.forEach(rConfig => {
        // Set isToCheck to true if element isActive
        rConfig.IsToCheckModule = rConfig.IsActive ? rConfig.IsActive : undefined;

        if (!isNullOrUndefined(rConfig.FunctionalityConfig)) {
          rConfig.FunctionalityConfig.forEach(featelement => {
            if (this.allFunctionnalityData != null && this.allFunctionnalityData.find(x => x.Id === featelement.Id) === undefined)
            {
              this.allFunctionnalityData.push(featelement);
            }
          });
        }
  
        if (!isNullOrUndefined(rConfig.ModuleConfig)) {
          rConfig.ModuleConfig.forEach(modelement => {
            if (this.allModuleData != null && this.allModuleData.find(x => x.Id === modelement.Id) === undefined)
            {
              this.allModuleData.push(modelement);
            }
    
          });
        }
        

      });
    }
  }



  /**
   * Selection module
   * @param $event
   * @param isToCheck
   * @param isActive
   */
  public handleSelectionRoleConfig($event, isToCheck?: boolean, isActive?: boolean): void {
    if ($event && $event.dataItem) {
      
      if($event.dataItem.Code === "ALLROLE" || $event.dataItem.RoleName === "All Role")
      {
        this.roleConfigData.forEach(b => {
          if (b.Code != "ALLROLE" && b.RoleName != "All Role" ) {
           b.IsActive = true;
           b.IsToCheck = true;
           b.IsToCheckModule = true;
          }
         });
      }
      this.selectedKeyForRoleConfig = [];
        this.selectedKeyForRoleConfig.push($event.index);
    }
  }


 
  

  /**
   * Check module
   * @param event
   * @param dataItem
   */
  private checkRoleConfigValue(event: any, dataItem) {
    if (event && dataItem) {
      // Change state of checkbox of current module
      dataItem.IsActive = event.checked;
      dataItem.IsToCheckModule = dataItem.IsActive ? dataItem.IsActive : undefined;
      dataItem.IsIndeterminate = undefined;
      
      if (dataItem.FunctionalityConfig != null && dataItem.FunctionalityConfig != undefined) {
        dataItem.FunctionalityConfig.forEach(featelement => {
          if (this.allFunctionnalityData.find(x => x.Id === featelement.Id) === undefined)
          {
            let functoadd = new FunctionnalityByRole();
            functoadd.IdFunctionality = featelement.Id;
            this.functionnalityData.push(functoadd);
          }
        });
      }

      if (dataItem.ModuleConfig != null && dataItem.ModuleConfig != undefined) {
        dataItem.ModuleConfig.forEach(modelement => {
          if (this.allModuleData.find(x => x.Id === modelement.Id) === undefined)
          {
            let modtoadd = new ModuleByRole();
            modtoadd.IdModule = modelement.Id;
            this.moduleData.push(modtoadd);
          }
        });
      }

      
      
    }
  }

  

  /**
   * Change state of checkbox
   * @param parentNode
   * @param moduleParent
   * @param children
   * @param isModule
   */
  private changeStateOfCheckBox(parentNode, moduleParent, children, isModule): void {

    let listOfCompterOfCheckedState = 0;
    let listOfCompterOfNoneState = 0;
    let idx = 0;
    let item;
    if (children) {
      // calculate number of Checked or unchecked element
      while (item = children[idx]) {
        let childElement: any;
        if (isModule) {
          childElement = document.getElementById(item.IdModule);
        } else {
          childElement = document.getElementById(item.IdFunctionality);
        }
        if (childElement.checked) {
          listOfCompterOfCheckedState++;
        } else if (!childElement.indeterminate) {
          listOfCompterOfNoneState++;
        }
        idx += 1;
      }

      // if list of checked children equals to list of children of current element ==> check checkbox of current element
      if (listOfCompterOfCheckedState === children.length) {
        moduleParent.IsActive = true;
        moduleParent.IsToCheckModule = true;
        moduleParent.IsIndeterminate = undefined;
        parentNode.checked = true;
        parentNode.indeterminate = false;
      } else if (listOfCompterOfNoneState === children.length) {
        // if list of unChecked children equals to list of children of current element ==> uncheck checkbox of current element
        moduleParent.IsActive = false;
        moduleParent.IsToCheckModule = undefined;
        moduleParent.IsIndeterminate = undefined;
        parentNode.checked = false;
        parentNode.indeterminate = false;
      } else {
        // Indeterminate checkbox of current element
        moduleParent.IsActive = true;
        moduleParent.IsToCheckModule = undefined;
        moduleParent.IsIndeterminate = true;
        parentNode.checked = false;
        parentNode.indeterminate = true;
      }
    }
  }

  public loadModulesAndFeatures() {
    this.roleConfigData.forEach(rConfig => {
      
      if (rConfig.IsActive) {
        
        if (rConfig.FunctionalityConfig != null && rConfig.FunctionalityConfig != undefined) {
          rConfig.FunctionalityConfig.forEach(featelement => {
            if (this.functionnalityData != null && this.functionnalityData.find(x => x.Id === featelement.Id) === undefined)
            {
              // let functoadd = new FunctionnalityByRole();
              // functoadd.IdFunctionality = featelement.Id;
              // functoadd.IsActive = true;
              // functoadd.IdRole = 0;
              // this.functionnalityData.push(functoadd);
              this.functionnalityData.push(featelement);
            }
          });
        }
  
        if (rConfig.ModuleConfig != null && rConfig.ModuleConfig != undefined) {
          rConfig.ModuleConfig.forEach(modelement => {
            if (this.moduleData != null && this.moduleData.find(x => x.Id === modelement.Id) === undefined)
            {
              // let modtoadd = new ModuleByRole();
              // modtoadd.IdModule = modelement.Id;
              // modtoadd.parentId = modelement.parentId;
              // modtoadd.IsActive = true;
              // modtoadd.IdRole = 0;
              // this.moduleData.push(modtoadd);
              this.moduleData.push(modelement);
            }
          });
        }

      }

    });
    
  }

  public fetchChildren(node: any): Observable<any[]> {
    return of(node.childElement);
  }


  public hasChildren(node: any): boolean {
    return (node.childElement && node.childElement.length > 0);
  }

  public hasChildrenModule(node: any): boolean {
    return (node.ChildrenModule && node.ChildrenModule.length > 0);
  }

  public fetchChildrenModule(node: any): Observable<any[]> {
    return of(node.ChildrenModule);
  }
}
