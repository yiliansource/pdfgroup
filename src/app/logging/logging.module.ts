import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { Logger } from '@pdfgroup/logging/impl/logger';

@NgModule({ imports: [CommonModule], declarations: [], providers: [Logger], exports: [] })
export class LoggingModule {}
