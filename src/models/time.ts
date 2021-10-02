import { DocumentType, getModelForClass, prop, ReturnModelType } from "@typegoose/typegoose";

export class Time {
  @prop({ required: true })
  text!: string;

  @prop({ required: true, default: () => Date.now() })
  start!: number;

  @prop({ required: true })
  end!: number;

  @prop({ required: true, default: false })
  hidden!: boolean;

  static getActiveTimes(this: ReturnModelType<typeof Time>, date?: number) {
    date = date ?? Date.now();

    return this.find({start: {$gte: date}, end: {$lte: date}, hidden: false}, null, {multi: true}).exec()
  }
}

export type TimeDocument = DocumentType<Time>;

export const TimeModel = getModelForClass(Time);
