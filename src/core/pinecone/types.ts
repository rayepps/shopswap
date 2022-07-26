//
//  QUERY
//

export type QueryRequest = {
  namespace: string;
  topK: number;
  filter?: object;
  includeValues: boolean;
  includeMetadata: boolean;
  vector: number[];
};

export type QueryResponse = {
  namespace: string;
  results: {
    namespace: string;
    matches: {
      id: string;
      score: number;
      values: number[];
      meatdata: object;
    };
  }[];
  matches: {
    id: string;
    score: number;
    values: number[];
    meatdata: object;
  }[];
};

//
//  UPSERT
//

export type UpsertRequest = {
  namespace: string;
  vectors: {
    id: string;
    values: number[];
    metadata: object;
  }[];
};

//
//  CREATE INDEX
//

export type CreateIndexRequest = {
  name: string;
  dimension: number;
  metric: "euclidean" | "dotproduct" | "cosine";
};
