import * as _ from "radash";
import * as Mongo from "mongodb";
import { ObjectId } from "mongodb";
import * as t from "../types";
import * as mappers from "./mappers";
import {
  addItem,
  findItem,
  findManyItems,
  queryAll,
  updateOne,
} from "./methods";

const deprefix = (str: t.Id) => str.replace(/ss\..+?\./, "");
const oid = (id: t.Id) => new ObjectId(deprefix(id));

const createMongoClient = (db: Promise<Mongo.Db>) => {
  return {
    //
    // COMPANY
    //
    companies: {
      add: addItem({
        db,
        collection: "companies",
        toDocument: (company: t.Company): t.CompanyDocument => ({
          ...company,
          _id: oid(company.id),
        }),
      }),
      list: queryAll({
        db,
        collection: "companies",
        toModel: mappers.CompanyDocument.toModel,
      }),
      find: findItem({
        db,
        collection: "companies",
        toQuery: (companyId: t.Id<"company">) => ({
          _id: oid(companyId),
        }),
        toModel: mappers.CompanyDocument.toModel,
      }),
      findBatch: findManyItems({
        db,
        collection: 'companies',
        toQuery: (ids: t.Id<'company'>[]) => ({
          _id: {
            $in: ids.map(oid)
          }
        }),
        toModel: mappers.CompanyDocument.toModel,
      }),
      update: updateOne<t.CompanyDocument, {
        companyId: t.Id<"company">,
        patch: Partial<Pick<t.Company, 'matches' | 'matchedAt'>>
      }>({
        db,
        collection: "companies",
        toQuery: ({ companyId }) => ({
          _id: oid(companyId)
        }),
        toUpdate: (({ patch }) => ({
          $set: patch
        }))
      })
    }
  };
};

export default createMongoClient;

export type MongoClient = ReturnType<typeof createMongoClient>;
