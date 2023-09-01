import { Dimensions } from '@pdfgroup/shared/util/dimensions/model';

export function getAspectRatio<TUnit extends number>(dimensions: Dimensions<TUnit>) {
    return dimensions.width / dimensions.height;
}
