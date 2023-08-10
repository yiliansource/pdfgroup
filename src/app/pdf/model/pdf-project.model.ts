export interface PdfProjectModel {
    name: string;
    groups: Array<PdfGroupModel>;
}

export interface PdfGroupModel {
    name: string;
    pages: Array<PdfPageModel>;
}

export interface PdfPageModel {
    data: any;
}
