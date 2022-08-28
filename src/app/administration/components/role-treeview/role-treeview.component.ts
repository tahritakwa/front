import { Component, OnInit, Input } from '@angular/core';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-role-treeview',
  templateUrl: './role-treeview.component.html',
  styleUrls: ['./role-treeview.component.scss']
})

export class RoleTreeviewComponent implements OnInit {
  /* Form Group */
  @Input() moduleData: any[];
  @Input() functionnalityData: any[];
  @Input() allFunctionnalityData: any[];
  selectedKeyForModule: any[] = [];

  constructor() {
  }

  ngOnInit(): void {
  }

  /**
   * Initialization of checked or unchecked element of treeView
   * */
  public initListOfModule(): void {
    if (this.moduleData && this.moduleData.length > 0 && this.allFunctionnalityData && this.allFunctionnalityData.length > 0) {
      // Fetch list of module
      this.moduleData.forEach(moduleParent => {
        // Set isToCheck to true if element isActive
        moduleParent.IsToCheckModule = moduleParent.IsActive ? moduleParent.IsActive : undefined;
        if (moduleParent.ChildrenModule) {
          this.initListOfModuleChildren(moduleParent);
        }
      });
    }
  }

  /**
   * Initialization of checked or unchecked module children of current module
   * */
  private initListOfModuleChildren(moduleParent) {
    let isIndeterminate: boolean;
    // Fetch list of module children
    moduleParent.ChildrenModule.forEach(moduleChild => {
      // Set isToCheck to true if element isActive
      moduleChild.IsToCheckModule = moduleChild.IsActive ? moduleChild.IsActive : undefined;
      isIndeterminate = this.initListOfFunctionnality(moduleChild);
      // Set parent node to indeterminate
      if (moduleParent.IsActive && isIndeterminate) {
        moduleParent.IsToCheckModule = undefined;
        moduleParent.IsIndeterminate = true;
      }
    });
  }

  /**
   * Initialization of checked or unchecked functionnality of current module
   * */
  private initListOfFunctionnality(moduleChild): boolean {
    let isIndeterminate: boolean;
    if (moduleChild.IsActive) {
      // Get list of functionnality where isActive == false
      const funcData = this.allFunctionnalityData.filter(x =>
        moduleChild.IdModuleNavigation.FunctionnalityModule.find(y => y.IdFunctionnality === x.IdFunctionality && !x.IsActive));
      // if parent is active and one or many functionnality is not active ==> set parent node to indeterminate
      if (funcData && funcData.length > 0) {
        moduleChild.IsToCheckModule = undefined;
        moduleChild.IsIndeterminate = true;
        isIndeterminate = true;
      }
    } else {
      isIndeterminate = true;
    }
    return isIndeterminate;
  }

  /**
   * Selection module
   * @param $event
   * @param isToCheck
   * @param isActive
   */
  public handleSelectionModule($event, isToCheck?: boolean, isActive?: boolean): void {
    if ($event && $event.dataItem) {
      // if module has children module ==> show list of functionnality releated to selected module and sub modules
      if ($event.dataItem.ChildrenModule) {
        this.functionnalityData = [];
        // fetch list of sub module
        $event.dataItem.ChildrenModule.forEach(moduleByRole => {
          // Get list of functionnality of current sub module
          this.functionnalityData = this.functionnalityData.concat(this.allFunctionnalityData.filter(x =>
            moduleByRole.IdModuleNavigation.FunctionnalityModule.find(y => y.IdFunctionnality === x.IdFunctionality)));
          // If IsToCheck ==true ==> change state of checkbox of current sub module
          if (isToCheck) {
            moduleByRole.IsActive = isActive;
          }
        });
      } else {
        // Get list of functionnality of selected module
        this.functionnalityData = this.allFunctionnalityData.filter(x => $event.dataItem.IdModuleNavigation.FunctionnalityModule.find(y =>
          y.IdFunctionnality === x.IdFunctionality));
        // If IsToCheck ==true ==> change state of checkbox of selected module
        if (isToCheck) {
          $event.dataItem.IsActive = isActive;
        }
      }
      // If IsToCheck ==true ==> change state of checkbox of functionnality releated to selected module and sub modules
      if (isToCheck) {
        this.selectedKeyForModule = [];
        this.selectedKeyForModule.push($event.index);
        this.functionnalityData.forEach(functData => {
          functData.IsActive = isActive;
        });
      }
    }
  }

  /**
   * Check functionnality
   * @param event
   * @param dataItem
   */
  private checkFunctionnalityValue(event: any, dataItem) {
    if (event && dataItem) {
      // Change state of checkbox of current functionnality
      dataItem.IsActive = event.checked;
      let moduleOfFunctionnality;
      // Fetch list of module
      this.moduleData.forEach(moduleByRole => {
        if (!moduleOfFunctionnality) {
          moduleOfFunctionnality = moduleByRole.ChildrenModule.find(y => y.IdModuleNavigation.FunctionnalityModule.find(z =>
            z.IdFunctionnality === dataItem.IdFunctionality));
        }
      });
      if (moduleOfFunctionnality) {
        // Get parent node
        const parentNode: any = document.getElementById(moduleOfFunctionnality.IdModule);
        // Get list of functionnality brother of  checked functionnalty
        const funcData = this.allFunctionnalityData.filter(x =>
          moduleOfFunctionnality.IdModuleNavigation.FunctionnalityModule.find(y => y.IdFunctionnality === x.IdFunctionality));
        // Change state of checkbox of parent node of checked functionnality
        this.changeStateOfCheckBox(parentNode, moduleOfFunctionnality, funcData, false);

        // Get upper parent of node parent of selected functionnality
        const moduleParent = this.moduleData.find(x => x.IdModule === moduleOfFunctionnality.IdModuleNavigation.IdModuleParent);
        if (moduleParent) {
          const moduleParentNode: any = document.getElementById(moduleParent.IdModule);
          // Change state of checkbox of upper parent of node parent of selected functionnality
          this.changeStateOfCheckBox(moduleParentNode, moduleParent, moduleParent.ChildrenModule, true);

        }
      }
    }
  }


  /**
   * Check module
   * @param event
   * @param dataItem
   */
  private checkModuleValue(event: any, dataItem) {
    if (event && dataItem) {
      // Change state of checkbox of current module
      dataItem.IsActive = event.checked;
      dataItem.IsToCheckModule = dataItem.IsActive ? dataItem.IsActive : undefined;
      dataItem.IsIndeterminate = undefined;
      // If checked node has children module
      if (dataItem.ChildrenModule) {
        // fetch list of sub modules
        this.checkModuleChildrenValue(dataItem);
      }
      // If checked node has list of functionnality
      if (dataItem.IdModuleNavigation) {
        // If node has functionnality
        if (dataItem.IdModuleNavigation.FunctionnalityModule) {
          // Check list of functionnality of checked node
          this.checkedFunctionnality(dataItem, dataItem);
        }

        // If Node has parent
        if (dataItem.IdModuleNavigation.IdModuleParent) {
          this.checkModuleParentValue(dataItem);
        }
      }
    }
  }

  /**
   * Check module parent
   * @param dataItem
   */
  private checkModuleParentValue(dataItem) {
    const moduleParent = this.moduleData.find(x => x.IdModule === dataItem.IdModuleNavigation.IdModuleParent);
    if (moduleParent) {
      const parentNode: any = document.getElementById(moduleParent.IdModule);
      // Change state of checkbox of parent node of current module
      this.changeStateOfCheckBox(parentNode, moduleParent, moduleParent.ChildrenModule, true);
    }
  }

  /**
   * Check module children
   * @param dataItem
   */
  private checkModuleChildrenValue(dataItem) {
    dataItem.ChildrenModule.forEach(children => {
      // Change state of checkbox of sub modules
      children.IsActive = dataItem.IsActive;
      children.IsToCheckModule = children.IsActive ? children.IsActive : undefined;
      children.IsIndeterminate = undefined;
      // Check list of functionnality of sub modules
      this.checkedFunctionnality(dataItem, children);
    });
  }
  /**
   * Change state of Check functionnality
   * @param dataItem
   * @param children
   */
  private checkedFunctionnality(dataItem, children): void {
    // get list of functionnality
    const functData = this.allFunctionnalityData.filter(x =>
      children.IdModuleNavigation.FunctionnalityModule.find(y => y.IdFunctionnality === x.IdFunctionality));
    // fetch list of functionnality
    functData.forEach(functModData => {
      functModData.IsActive = dataItem.IsActive;
    });
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

  public fetchChildren(node: any): Observable<any[]> {
    return of(node.ChildrenModule);
  }

  public hasChildren(node: any): boolean {
    return (node.ChildrenModule && node.ChildrenModule.length > 0);
  }
}
