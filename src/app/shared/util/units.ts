const MM_TYPE_GUARD = Symbol.for('UNIT_MM');
export type MM = number & { [MM_TYPE_GUARD]: never };
const MMObj = (mm: number): MM => {
    return mm as MM;
};
export const MM = MMObj;

const PX_TYPE_GUARD = Symbol();
export type PX = number & { [PX_TYPE_GUARD]: never };
const PXObj = (px: number): PX => {
    return px as PX;
};
export const PX = PXObj;
