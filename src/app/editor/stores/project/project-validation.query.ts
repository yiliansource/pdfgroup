import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { ProjectModel } from '@pdfgroup/editor/models/project.model';
import { ProjectQuery } from '@pdfgroup/editor/stores/project/project.query';

export enum ValidationSeverity {
    INFO = 'INFO',
    WARNING = 'WARNING',
    ERROR = 'ERROR',
}

export enum ValidationType {
    // infos

    // warnings
    DOCUMENTS_WITH_NO_PAGES = 'DOCUMENTS_WITH_NO_PAGES',
    DOCUMENTS_WITH_DUPLICATE_NAMES = 'DOCUMENTS_WITH_DUPLICATE_NAMES',

    // errors
    NO_DOCUMENTS = 'NO_DOCUMENTS',
}

export interface ValidationMessage {
    severity: ValidationSeverity;
    type: ValidationType;
}

export type Validator = (project: ProjectModel) => ValidationMessage | ValidationMessage[] | undefined;

@Injectable({ providedIn: 'root' })
export class ProjectValidationQuery {
    public validations$: Observable<ValidationMessage[]> = this.projectQuery.select().pipe(
        map((project) => {
            const validations: ValidationMessage[] = [];

            for (const validator of this.validators) {
                const result = validator(project);

                if (result !== undefined) {
                    if (Array.isArray(result)) {
                        validations.push(...result);
                    } else {
                        validations.push(result);
                    }
                }
            }

            return validations;
        })
    );

    private readonly validators: Validator[] = [
        NoDocumentsValidator,
        EmptyDocumentsValidator,
        DuplicateNamesDocumentsValidator,
    ];

    public constructor(private readonly projectQuery: ProjectQuery) {}
}

function NoDocumentsValidator(project: ProjectModel): ValidationMessage | undefined {
    if (project.documents.length === 0) {
        return {
            severity: ValidationSeverity.ERROR,
            type: ValidationType.NO_DOCUMENTS,
        };
    }
    return undefined;
}

function EmptyDocumentsValidator(project: ProjectModel): ValidationMessage | undefined {
    if (project.documents.some((document) => document.pages.length === 0)) {
        return {
            severity: ValidationSeverity.WARNING,
            type: ValidationType.DOCUMENTS_WITH_NO_PAGES,
        };
    }
    return undefined;
}

function DuplicateNamesDocumentsValidator(project: ProjectModel): ValidationMessage | undefined {
    if (new Set(project.documents.map((document) => document.name)).size !== project.documents.length) {
        return {
            severity: ValidationSeverity.WARNING,
            type: ValidationType.DOCUMENTS_WITH_DUPLICATE_NAMES,
        };
    }
    return undefined;
}
