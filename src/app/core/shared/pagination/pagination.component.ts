import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IPaginationFilter, IPaginationOptions } from '../../interfaces/pagination/page.interface';
import { PrimengModule } from '../../modules/primeng/primeng.module';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [
    PrimengModule
  ],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent implements OnInit {
  @Input() paginateOptions!: IPaginationOptions;
  @Input() filters!: IPaginationFilter;
  @Output() pageLimitChanged: EventEmitter<IPaginationFilter> = new EventEmitter();
  @Output() pageChanged: EventEmitter<IPaginationFilter> = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }

  onChangePageLimit(): void {
    this.filters.limit = Number(this.paginateOptions.selectedPageRecordCount);
    this.pageLimitChanged.emit(this.filters);
  }

  onPageChange(event: any): void {
    this.filters.limit = event.rows;
    this.filters.page = event.first / this.filters.limit + 1;
    this.pageChanged.emit(this.filters);
  }

}

