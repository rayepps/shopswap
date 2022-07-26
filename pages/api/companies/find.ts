/* eslint-disable react-hooks/rules-of-hooks */
import { compose, sift } from "radash";
import { errors, Props } from "@exobase/core";
import { useNext } from "src/core/hooks/useNext";
import * as t from "src/core/types";
import { useService, useJsonArgs } from "@exobase/hooks";
import makeMongo, { MongoClient } from "src/core/db";
import * as mappers from "src/core/view/mappers";
import makePinecone, { PineconeClient } from "src/core/pinecone";

type Args = {
  id: t.Id<"company">;
};

type Services = {
  mongo: MongoClient;
  pinecone: PineconeClient;
};

type Response = {
  company: t.CompanyView;
  matches: t.MatchView[];
};

const findCompany = async ({
  args,
  services,
}: Props<Args, Services>): Promise<Response> => {
  const { id } = args;
  const { mongo, pinecone } = services;

  const company = await mongo.companies.find(id);
  if (!company) {
    throw errors.notFound({
      details: `Could not find company with the given id (${id})`,
      key: "ss.err.companies.find.unfound",
    });
  }

  const { matches } = await pinecone.query(company);
  const companies =
    matches.length > 0
      ? await mongo.companies.findBatch(matches.map((m) => m.companyId))
      : [];

  await mongo.companies.update({
    companyId: company.id,
    patch: {
      matchedAt: Date.now(),
      matches: matches.length,
    },
  });

  return {
    company: mappers.CompanyView.toView(company),
    matches: sift(
      matches.map((m) => {
        const c = companies.find((c) => c.id === m.companyId);
        if (!c) return null;
        return mappers.MatchView.toView({
          company: c,
          score: m.score,
        });
      })
    ) as t.MatchView[],
  };
};

export default compose(
  useNext(),
  useJsonArgs<Args>((yup) => ({
    id: yup
      .string()
      .matches(/^ss\.company\.[a-z0-9]+$/)
      .required(),
  })),
  useService<Services>({
    mongo: makeMongo(),
    pinecone: makePinecone(),
  }),
  findCompany
);
