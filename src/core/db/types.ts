import * as t from "../model/types";
import type { ObjectId } from "mongodb";

export type Collection = "companies";

export interface MongoDocument {
  _id: ObjectId;
}

//
// COMPANY
//
export type CompanyDocument = MongoDocument & t.Company;
