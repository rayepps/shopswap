import * as t from "../types";

export const CompanyView = {
  toView: (model: t.Company): t.CompanyView => {
    return {
      _view: "ss.company",
      id: model.id,
      name: model.name,
      profile: model.profile,
      matchedAt: model.matchedAt ?? Date.now(),
      matches: model.matches ?? 0,
    };
  },
};

export const MatchView = {
  toView: (model: t.Match): t.MatchView => {
    return {
      _view: "ss.match",
      company: CompanyView.toView(model.company),
      score: model.score,
    };
  },
};
