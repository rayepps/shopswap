/* eslint-disable react-hooks/rules-of-hooks */
import { compose } from "radash";
import type { Props } from "@exobase/core";
import { useNext } from "src/core/hooks/useNext";
import * as t from "src/core/types";
import { useService, useJsonArgs } from "@exobase/hooks";
import makeMongo, { MongoClient } from "src/core/db";
import makePinecone, { PineconeClient } from "src/core/pinecone";
import model from "src/core/model";
import * as mappers from "src/core/view/mappers";
import { QUESTIONS } from "src/qa";

type Args = {
  name: string;
  responses: {
    questionKey: string;
    answers: {
      option: string | null;
      value: string | null;
    }[];
  }[];
};

type Services = {
  mongo: MongoClient;
  pinecone: PineconeClient;
};

type Response = {
  company: t.CompanyView;
  matches: t.MatchView[];
};

const createCompany = async ({
  args,
  services,
}: Props<Args, Services>): Promise<Response> => {
  const { name } = args;
  const { mongo, pinecone } = services;

  const company: t.Company = {
    name,
    id: model.id("company"),
    matchedAt: Date.now(),
    matches: 0,
    profile: {
      timestamp: Date.now(),
      responses: args.responses.map((response) => ({
        question: QUESTIONS.find((q) => q.key === response.questionKey)!,
        answers: response.answers,
      })),
    },
  };
  
  await pinecone.upsert(company);

  const { matches } = await pinecone.query(company);
  const companies =
    matches.length > 0
      ? await mongo.companies.findBatch(matches.map((m) => m.companyId))
      : [];

  await mongo.companies.add({
    ...company,
    matches: matches.length
  });

  return {
    company: mappers.CompanyView.toView(company),
    matches: matches.map((m) =>
      mappers.MatchView.toView({
        company: companies.find((c) => c.id === m.companyId)!,
        score: m.score,
      })
    ),
  };
};

export default compose(
  useNext(),
  useJsonArgs<Args>((yup) => ({
    name: yup.string().required(),
    responses: yup
      .array(
        yup.object({
          questionKey: yup.string().required(),
          answers: yup
            .array(
              yup.object({
                option: yup.string().nullable(),
                value: yup.string().nullable(),
              })
            )
            .required(),
        })
      )
      .required(),
  })),
  useService<Services>({
    mongo: makeMongo(),
    pinecone: makePinecone(),
  }),
  createCompany
);
