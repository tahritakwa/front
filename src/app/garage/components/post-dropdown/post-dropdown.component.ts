import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { GarageConstant } from '../../../constant/garage/garage.constant';
import { Post } from '../../../models/garage/post.model';
import { PredicateFormat } from '../../../shared/utils/predicate';
import { PostService } from '../../services/post/post.service';

@Component({
  selector: 'app-post-dropdown',
  templateUrl: './post-dropdown.component.html',
  styleUrls: ['./post-dropdown.component.scss']
})
export class PostDropdownComponent implements OnInit {

  @Input() group: FormGroup;
  @Output() Selected = new EventEmitter<any>();
  postDataSource: Post[];
  postFilterDataSource: Post[];
  selectedValue: Post;
  placeholder = GarageConstant.POST_PLACE_HOLDER;
  constructor(private postService: PostService) {
  }

  ngOnInit() {
    this.intiGridDataSource();
  }

  intiGridDataSource() {
    this.postService.readDropdownPredicateData(new PredicateFormat()).subscribe((data) => {
      this.postDataSource = data;
      this.postFilterDataSource = this.postDataSource.slice(0);
    });
  }

  handleFilter(value) {
    this.postFilterDataSource = this.postDataSource.filter((s) =>
      s.Name.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  onSelectPost($event) {
    this.selectedValue = this.postFilterDataSource.find(x => x.Id === $event);
    this.Selected.emit(this.selectedValue);
  }

}
