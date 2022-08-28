import { FiscalYearStateEnumerator } from '../enumerators/fiscal-year-state-enumerator.enum';

export class FiscalYear {
	id: number;
	name = '';
	startDate: Date;
	endDate: Date;
	closingState: FiscalYearStateEnumerator;

	constructor(id?: number, name?: string, startDate?: Date, endDate?: Date, closingState?: FiscalYearStateEnumerator) {
		this.id = id;
		this.name = name;
		this.startDate = startDate;
		this.endDate = endDate;
		this.closingState = closingState;
	}
}
