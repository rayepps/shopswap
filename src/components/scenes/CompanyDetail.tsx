import { ArrowLeftIcon, EyeIcon } from "@heroicons/react/solid";
import { sort } from "radash";
import Link from "next/link";
import * as t from "src/types";
import Logo from "../Logo";
import { Tab } from "@headlessui/react";

export default function CompanyDetailScene({
  company,
  matches,
}: {
  company: t.Company;
  matches: t.Match[];
}) {
  return (
    <div className="flex min-h-screen py-20 justify-center items-center bg-gradient-to-r to-indigo-500 from-purple-500">
      <div className="max-w-xl w-full shadow-md rounded-xl p-8 bg-white">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" passHref>
              <a>
                <button className="rounded flex items-center text-sm bg-slate-100 hover:bg-slate-200 text-slate-500 py-1 px-2">
                  <ArrowLeftIcon className="h-3 w-3 mr-1" />
                  back
                </button>
              </a>
            </Link>
            <h1 className="ml-2 font-medium">{company.name}</h1>
          </div>
          <div>
            <Logo size={8} />
          </div>
        </div>
        <div className="mt-10">
          <Tab.Group>
            <Tab.List className="flex space-x-1 rounded-xl bg-slate-100 p-1">
              <Tab
                key="profile"
                className={({ selected }) => {
                  return `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-purple-700 ring-white ring-opacity-60 ring-offset-2 ring-offset-purple-400 focus:outline-none focus:ring-2 ${
                    selected
                      ? "bg-white shadow"
                      : "text-purple-600 hover:bg-white/[0.12] hover:text-purple-800"
                  }`;
                }}
              >
                Profile
              </Tab>
              <Tab
                key="matches"
                className={({ selected }) => {
                  return `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-purple-700 ring-white ring-opacity-60 ring-offset-2 ring-offset-purple-400 focus:outline-none focus:ring-2 ${
                    selected
                      ? "bg-white shadow"
                      : "text-purple-600 hover:bg-white/[0.12] hover:text-purple-800"
                  }`;
                }}
              >
                Matches
              </Tab>
            </Tab.List>
            <Tab.Panels className="mt-2">
              <Tab.Panel key="profile">
                <div className="mt-4">
                  <ProfileSummary company={company} />
                </div>
              </Tab.Panel>
              <Tab.Panel key="matches">
                <div className="mt-4">
                  <MatchList company={company} matches={matches} />
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </div>
  );
}

export const ProfileSummary = ({ company }: { company: t.Company }) => {
  const responses = company.profile.responses;
  return (
    <table className="w-full">
      <thead className="">
        <tr>
          <td className="border-r border-slate-100 p-4 font-bold">Question</td>
          <td className="p-4 font-bold">Answer</td>
        </tr>
      </thead>
      <tbody>
        {responses.map(({ question, answers }, idx) => (
          <>
            <tr
              key={question.key}
              className={`border-b border-slate-100 last:border-b-0 ${
                idx % 2 === 0 && "bg-slate-50"
              }`}
            >
              <td className="p-4 border-r border-slate-100 w-full rounded-l-md">
                <span>{question.label}</span>
              </td>
              <td className="p-4">
                {answers.map((answer) => (
                  <span
                    key={answer.option}
                    className="px-2 text-sm py-1 bg-slate-200 text-slate-500 rounded block float-right mb-2"
                  >
                    {
                      question.options?.find((o) => o.key === answer.option)
                        ?.label
                    }
                  </span>
                ))}
              </td>
            </tr>
          </>
        ))}
      </tbody>
    </table>
  );
};

export const MatchList = ({
  company,
  matches,
}: {
  company: t.Company;
  matches: t.Match[];
}) => {
  if (matches.length === 0) {
    return (
      <div className="p-10 bg-slate-50 text-center rounded-xl">
        <span className="text-slate-800 text-lg">We couldn&quot;t find any strong matches for this company profile.</span>
      </div>
    )
  }
  return (
    <table className="w-full">
      <thead className="">
        <tr>
          <td className="border-r border-slate-100 p-4 font-bold">Company</td>
          <td className="p-4 font-bold">Strength</td>
        </tr>
      </thead>
      <tbody>
        {sort(matches, (s) => s.score, true).map((match, idx) => (
          <>
            <tr
              key={match.company.id}
              className={`border-b border-slate-100 last:border-b-0 ${
                idx % 2 === 0 && "bg-slate-50"
              }`}
            >
              <td className="p-4 border-r border-slate-100 w-full rounded-l-md">
                <Link href={`/company/${match.company.id}`} passHref>
                  <a className="hover:underline">{match.company.name}</a>
                </Link>
              </td>
              <td className="p-4">
                <ScoreBadge score={match.score} />
              </td>
            </tr>
          </>
        ))}
      </tbody>
    </table>
  );
};


const ScoreBadge = ({
  score: rawScore
}: {
  score: number
}) => {
  const score = Math.trunc(rawScore * 100)
  const getScoreLable = () => {
    if (score > 90) return 'Excellent'
    if (score > 60) return 'Strong'
    if (score > 30) return 'Potential'
    return 'Weak'
  }
  const getScoreClass = () => {
    if (score > 90) return 'bg-green-400'
    if (score > 60) return 'bg-green-200'
    if (score > 30) return 'bg-yellow-400'
    return 'bg-yellow-200'
  }
  return (
    <span className={`block text-sm font-semibold text-slate-700 text-center rounded px-2 py-1 ${getScoreClass()}`}>
      {getScoreLable()}
    </span>
  )
}