import { DocumentType, ReturnModelType } from "@typegoose/typegoose";
export declare class Time {
    text: string;
    start: number;
    end: number;
    hidden: boolean;
    static getActiveTimes(this: ReturnModelType<typeof Time>, date?: number): Promise<DocumentType<Time, import("@typegoose/typegoose/lib/types").BeAnObject>[]>;
}
export declare type TimeDocument = DocumentType<Time>;
export declare const TimeModel: ReturnModelType<typeof Time, import("@typegoose/typegoose/lib/types").BeAnObject>;
