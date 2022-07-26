import * as _ from "radash";
import api from "@exobase/client-builder";
import * as t from "src/types";
import config from "src/config";

const createApi = () => {
  const endpoint = api(`${config.baseUrl}/api`);
  return {
    company: {
      create: endpoint<
        {
          name: string;
          responses: {
            questionKey: string;
            answers: {
              option: string | null;
              value: string | null;
            }[];
          }[];
        },
        {
          company: t.Company;
          matches: t.Match[]
        }
      >("/companies/create"),
      list: endpoint<
        {},
        {
          companies: t.Company[];
        }
      >("/companies/list"),
      find: endpoint<
        {
          id: string;
        },
        {
          company: t.Company;
          matches: t.Match[]
        }
      >("/companies/find"),
    },
  };
};

export default createApi();
