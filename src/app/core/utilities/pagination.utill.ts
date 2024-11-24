import { IPagination, IPaginationOptions } from "../interfaces/pagination/page.interface";

export function updatedPaginateOptions(p: IPagination, paginateOptions: IPaginationOptions): void {
    if (p.skip !== undefined && p.limit !== undefined && p.totalCount !== undefined) {
        paginateOptions.totalRecords = p?.totalCount || 0;
        paginateOptions.firstIndex = p.data && p.skip > 0 ? p.skip + 1 : 1;
        if (p.data && p.data.length > 0) {
            if (p.data.length < p.limit) {
                paginateOptions.lastIndex = p.skip + (p.totalCount % p.limit);
            } else {
                paginateOptions.lastIndex = p.skip + p.limit;
            }
        } else {
            paginateOptions.lastIndex = 0;
            paginateOptions.firstIndex = 0;
        }
    }
}