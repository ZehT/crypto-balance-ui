import {HttpHeaders, HttpParams} from '@angular/common/http';

export interface RequestOptions {
    headers?: HttpHeaders;
    params?: HttpParams;
}

export interface BasicResponse<T> {
    success: boolean;
    message: string;
    error: any;
    detail: string;
    statusCode: number;
    data?: T;
}

export interface SelectItem {
    value: number;
    label: string;
}

export interface CheckboxItem extends SelectItem {
    checked: boolean;
    disabled: boolean;
}

export interface Sorter {
    code: string;
    order: string;
}

export interface Page<T> {
    content: Array<T>;
    empty: boolean;
    first: boolean;
    last: boolean;
    number: number;
    numberOfElements: number;
    pageable: Pageable;
    size: number;
    sort: Sort;
    totalElements: number;
    totalPages: number;
}

export interface Sort {
    empty: number;
    sorted: number;
    unsorted: number;
}

export interface Pageable {
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    sort: Sort;
    unpaged: boolean;
}

export interface PaginationFilter {
    page?: number;
    size?: number;
    sorters?: string[];
}
