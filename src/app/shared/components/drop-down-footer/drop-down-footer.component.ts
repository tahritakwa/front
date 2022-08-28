import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-drop-down-footer',
  templateUrl: './drop-down-footer.component.html',
  styleUrls: ['./drop-down-footer.component.scss']
})
export class DropDownFooterComponent implements OnInit {

  @Input() addNew: Function; // add new item action button
  @Input() nextPage: Function;
  @Input() Pager: Function;
  @Input() total: number;
  @Input() skip: number;
  @Input() take: number;
  @Input() hideBtn: boolean;
  public array = [];
  public from: number;
  public to: number;
  public nbPages: number;
  public pageNumberFrom: number;

  ngOnInit(): void {
    this.initPagerData();
  }

  public initPagerData(total?) {
    if (total !== null && total !== undefined) {
      this.total = total;
    }
    this.nbPages = this.total % this.take === 0 ? (this.total / this.take) : Math.floor(this.total / this.take) + 1;
    const pageNumber = Math.floor(this.skip / this.take);
    this.pageNumberFrom = Math.floor(pageNumber / 10) * 10;
    this.array = [];
    const pageNumberTo = this.pageNumberFrom + 10 < this.nbPages ? this.pageNumberFrom + 10 : this.nbPages;
    for (let i = this.pageNumberFrom; i < pageNumberTo; i++) {
      this.array.push(i + 1);
    }
    this.from = this.skip === 0 ? 1 : this.skip;
    this.to = this.skip / this.take < this.array.length - 1 ? ((this.skip / this.take) + 1) * this.take : this.total;
  }

}
