import * as t from "../model/types";

// These are the types that are returned to the frontend
// We add _view to each one so the type never matches the
// model type. Ex. User { id } UserView { id } would not
// error if we returned an instance of the user because all
// attributes exist. _view makes sure we see errors for this.
// Its also potentially helpful for systems parsing the objects
// to know with certaintly what the shape is.

export type CompanyView = {
  _view: "ss.company";
  id: string;
  name: string;
  matches: number;
  matchedAt: number
  profile: {
    timestamp: number;
    responses: t.ProfileResponse[];
  };
};

export type MatchView = {
  _view: "ss.match";
  company: Omit<CompanyView, 'matches'>;
  score: number;
};
