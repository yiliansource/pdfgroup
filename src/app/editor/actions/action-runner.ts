import { Injectable } from '@angular/core';
import { NamedLogger } from '@pdfgroup/logging/decorators/named-logger';
import { Logger } from '@pdfgroup/logging/impl/logger';
import { Action, EntityAction } from '@pdfgroup/editor/actions/action';

@Injectable({ providedIn: 'root' })
@NamedLogger('ActionRunner')
export class ActionRunner {
    public constructor(private readonly logger: Logger) {}

    public async run<P, R>(action: Action<P, R>, param: P): Promise<R> {
        try {
            this.logger.info(action, param);
            return await action.execute(param);
        } finally {
        }
    }

    public async runEntity<K, P, R>(action: EntityAction<K, P, R>, key: K, param: P): Promise<R> {
        try {
            this.logger.info(action, key, param);
            return await action.execute(key, param);
        } finally {
        }
    }
}
