//
//  LEGEND
//
//  _ = private, should not be deliverd to client, ever. Internal.
//  $ = nosql non-normal duplication of source record, compressed.
//
//  This convention helps us easily identify internal fields that
//  should never be exposed to the user -- namely in the mappers.
//

export type Model = "company" | "question";
export type Id<TModel extends Model = Model> = `ss.${TModel}.${string}`;

export type QuestionType = "single-select" | "multi-select" | "binary";

export interface ProfileResponse {
  question: Question;
  answers: Answer[];
}

export interface Profile {
  timestamp: number;
  responses: ProfileResponse[];
}

export interface Company {
  id: Id<"company">;
  name: string;
  profile: Profile;
  matches: number;
  matchedAt: number;
}

export interface Answer {
  /**
   * The key of the option
   * selected in the question
   */
  option: string | null;
  /**
   * Used when the user specifies
   * a custom (other) value
   */
  value: string | null;
}

export interface Question {
  key: string;
  label: string;
  comment: string | null;
  type: QuestionType;
  weight: number;
  otherable: boolean;
  catchall: string | null;
  limit: number | null;
  options: {
    label: string;
    key: string;
    weight: number;
  }[];
}

export interface Match {
  company: Company;
  /**
   * Score captured. Number between 0-100.
   * Describes the strength of this match.
   * Equal to available is perfect match.
   */
  score: number;
}
