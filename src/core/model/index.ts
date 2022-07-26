/* eslint-disable import/no-anonymous-default-export */
import * as t from "../types";
import * as crypto from "crypto";

export const id = <TModel extends t.Model>(model: TModel): t.Id<TModel> => {
  const rand = crypto.randomBytes(12).toString("hex");
  return `ss.${model}.${rand}`;
};

export default {
  id,
};
