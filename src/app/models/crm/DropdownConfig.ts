import {DropdownConfigFiltres} from "./DropdownConfigFiltres";


export class DropdownConfig {
  id: number;
  name: string;
  dropdownType :string;
  dropdownConfigFiltres: Array<DropdownConfigFiltres>;
  possibleToDeleteOrUpdate: boolean;
  possibleToDelete: boolean;
}
