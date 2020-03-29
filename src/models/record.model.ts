import { COVStatus, SymptomStatus } from "../enums/status.enum";

export interface RecordModel {
  cStatus: COVStatus;
  status: SymptomStatus;
  location: {
    type: "Point";
    coordinates: string[];
  };
}
