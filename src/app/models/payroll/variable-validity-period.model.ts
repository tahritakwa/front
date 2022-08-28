import { Resource } from "../shared/ressource.model";
import { Variable } from "./variable.model";

export class VariableValidityPeriod extends Resource{
    StartDate: Date;
    State: number;
    Formule: string;
    IdVariable: number;
    IdVariableNavigation: Variable;
}
