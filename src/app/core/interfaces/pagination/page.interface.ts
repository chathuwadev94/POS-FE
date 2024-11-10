export interface IPagination {
    page?: number;
    limit?: number;
    totalCount?: number;
    totalPages?: number;
    skip?: number;
    data: any[];
  }
  
  export interface IPaginationOptions {
    firstIndex: number;
    lastIndex: number;
    totalRecords: number;
    pageRecordCountOptions: number[];
    selectedPageRecordCount: number;
  }
  
  export interface IPaginationFilter {
    page: number;
    limit: number;
  }