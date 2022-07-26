import * as t from "../types";
import * as _ from "radash";

export const CompanyDocument = {
  toModel: (document: t.CompanyDocument): t.Company => {
    return document as t.Company;
  }
}
