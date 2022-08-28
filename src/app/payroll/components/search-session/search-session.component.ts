import { Component, EventEmitter, Output } from "@angular/core";
import { SharedConstant } from "../../../constant/shared/shared.constant";
import { Filter, Operation, Operator, PredicateFormat } from "../../../shared/utils/predicate";

@Component({
    selector: 'app-search-session',
    templateUrl: './search-session.component.html',
    styleUrls: ['./search-session.component.scss']
})
export class SearchSessionComponent {
    // the sender of the data to the parent
    @Output() sendData = new EventEmitter<any>();

    sessionString: string;
    constructor() {
    }
    /**
  * Construct the predicate for filter the tiers list and send it to the list tiers component
  */
    public filter() {
        /**
         * tiers predicate contains filter list
         * Operator OR
         */
        const sessionPredicate = new PredicateFormat();
        sessionPredicate.Operator = Operator.or;
        sessionPredicate.Filter = new Array<Filter>();
        sessionPredicate.Filter.push(new Filter(SharedConstant.CODE, Operation.contains, this.sessionString, false, true));
        sessionPredicate.Filter.push(new Filter(SharedConstant.TITLE, Operation.contains, this.sessionString, false, true));

        this.sendData.emit({ 'predicate': sessionPredicate });
    }
}