import { HttpHeaders } from "@angular/common/http";

export interface ApiResponse<T> {
    status_code: number;
    status: string;
    total_records: number,
    page_records: number,
    total_pages: number,   
    data: T;
    message: string | undefined;
    headers: HttpHeaders;
}
