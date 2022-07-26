import type { SuperAgentStatic } from "superagent";
import * as t from "src/core/types";
import {
  CreateIndexRequest,
  QueryRequest,
  QueryResponse,
  UpsertRequest,
} from "./types";
import { vectorize } from "../vectorizer";

const INDEX = "questions";
const PROJECT = "953509c";
const ENV = "us-west1-gcp";
const NAMESPACE = "default";

export const pineconeClient = ({
  http,
  key,
}: {
  http: SuperAgentStatic;
  key: string;
}) => ({
  /**
   * https://www.pinecone.io/docs/api/operation/create_index
   */
  createIndex: async (index: {
    name: string;
    dimension: number;
    metric: "euclidean" | "dotproduct" | "cosine";
  }) => {
    const body: CreateIndexRequest = index;
    await http
      .post(`https://controller.${ENV}.pinecone.io/databases`)
      .send(body)
      .set("Api-Key", key);
  },
  /**
   * https://www.pinecone.io/docs/api/operation/upsert
   */
  upsert: async (company: t.Company) => {
    const body: UpsertRequest = {
      namespace: NAMESPACE,
      vectors: [
        {
          id: company.id,
          values: vectorize(company.profile),
          metadata: {
            companyId: company.id,
            companyName: company.name,
          },
        },
      ],
    };
    const response = await http
      .post(`https://${INDEX}-${PROJECT}.svc.${ENV}.pinecone.io/vectors/upsert`)
      .send(body)
      .set("Api-Key", key);
  },
  /**
   * https://www.pinecone.io/docs/api/operation/query
   */
  query: async (
    company: t.Company
  ): Promise<{
    matches: {
      companyId: t.Id<'company'>;
      score: number;
    }[];
  }> => {
    const body: QueryRequest = {
      namespace: NAMESPACE,
      topK: 3,
      includeValues: true,
      includeMetadata: true,
      vector: vectorize(company.profile),
    };
    const response = await http
      .post(`https://${INDEX}-${PROJECT}.svc.${ENV}.pinecone.io/query`)
      .send(body)
      .set("accept", "json")
      .set("api-key", key);
    const { matches } = response.body as QueryResponse;
    return {
      matches: matches.map((m) => ({
        companyId: m.id as t.Id<'company'>,
        score: m.score,
      })).filter(m => m.companyId !== company.id),
    };
  },
});

export type PineconeClient = ReturnType<typeof pineconeClient>;
