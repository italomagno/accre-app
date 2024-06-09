export type  optionsProps ={
    optionTitle: string;
    optionValues: string[];
}

export type availableShifts= {
    id: any;
    shiftName: any;
    missingQuantity: number;
    day: any;
};
export type completeShifts = {
    id: any;
    shiftName: any;
    quantity: any;
    day: any;
};
export type ShiftsStatusProps = {
    availableShifts:availableShifts[],
    completeShifts: completeShifts[]
}