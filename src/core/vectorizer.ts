import { sift, sort, sum } from "radash";
import * as t from "./types";

export const vectorize = (profile: t.Profile): number[] => {
  const responses = profile.responses.map((response) => ({
    weight: response.question.weight,
    value: valuizers[response.question.type](response),
  }));
  return sort(responses, (r) => r.weight).map((r) => r.value);
};

const valuizers: Record<
  t.QuestionType,
  (response: t.ProfileResponse) => number
> = {
  binary: ({ question, answers }: t.ProfileResponse): number => {
    const answer = answers[0];
    const option = question.options.find((o) => o.key === answer?.option);
    return option?.weight ?? 0.5;
  },
  "single-select": ({ question, answers }: t.ProfileResponse): number => {
    const answer = answers[0];
    const option = question.options.find((o) => o.key === answer?.option);
    return option?.weight ?? 0.5;
  },
  "multi-select": ({ question, answers }: t.ProfileResponse): number => {
    const options = sift(
      answers.map((a) => {
        return question.options.find((o) => o.key === a.option);
      })
    ) as { weight: number }[];
    return sum(options.map((o) => o.weight)) / options.length;
  },
};
