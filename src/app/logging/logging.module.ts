import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Logger } from '@pdfgroup/logging/impl/logger';

@NgModule({ imports: [CommonModule], declarations: [], providers: [Logger], exports: [] })
export class LoggingModule {}
