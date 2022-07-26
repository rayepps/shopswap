/* eslint-disable react-hooks/rules-of-hooks */
import { compose } from "radash";
import type { Props } from "@exobase/core";
import { useNext } from "src/core/hooks/useNext";
import * as t from "src/core/types";
import { useService } from "@exobase/hooks";
import makeMongo, { MongoClient } from "src/core/db";
import * as mappers from "src/core/view/mappers";

type Args = {};

type Services = {
  mongo: MongoClient;
};

type Response = {
  companies: t.CompanyView[];
};

const listCompanies = async ({
  services,
}: Props<Args, Services>): Promise<Response> => {
  const { mongo } = services;

  const companies = await mongo.companies.list();

  return {
    companies: companies.map(mappers.CompanyView.toView),
  };
};

export default compose(
  useNext(),
  useService<Services>({
    mongo: makeMongo(),
  }),
  listCompanies
);
