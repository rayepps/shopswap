import { Menu, Transition } from "@headlessui/react";
import * as t from "src/types";
import { ChevronDownIcon } from "@heroicons/react/solid";
import Image from "next/image";
import { Fragment } from "react";
import Link from "next/link";
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

export default function SelectCompanyScene({
  companies,
}: {
  companies: t.Company[];
}) {
  return (
    <div className="flex h-screen justify-center items-center bg-gradient-to-r to-indigo-500 from-purple-500">
      <div className="max-w-sm shadow-md rounded-xl p-8 bg-white">
        <div className="">
          <div>
            <Image
              src="/logo.png"
              alt="logo"
              height={Math.round(170 / 2)}
              width={Math.round(796 / 2)}
            />
          </div>
          <Menu as="div" className="mt-4 relative text-left">
            <div>
              <Menu.Button className="flex w-full justify-between items-center bg-slate-100 rounded-md p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-opacity-75">
                <span className="text-base font-medium text-slate-400">
                  Select Company
                </span>
                <ChevronDownIcon
                  className="ml-2 -mr-1 h-6 w-6 text-slate-400"
                  aria-hidden="true"
                />
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute left-0 right-0 divide-gray-100 rounded-md bg-white shadow-lg max-h-[400px] overflow-y-scroll">
                {companies.map((company) => (
                  <Menu.Item key={company.id}>
                    <div className="w-full p-2 border-b last:border-b-0 hover:cursor-pointer rounded-md border-slate-100 group hover:bg-purple-600">
                      <Link href={`/company/${company.id}`} passHref>
                        <a className="w-full block">
                          <button className="text-left">
                            <span className="block text-lg font-semibold text-slate-800 group-hover:text-slate-50">
                              {company.name}
                            </span>
                            <span className="block text-slate-500 group-hover:text-slate-50 text-sm">{company.matches} matches ({formatDistanceToNow(company.matchedAt)} ago)</span>
                          </button>
                        </a>
                      </Link>
                    </div>
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Transition>
          </Menu>
          <div className="text-center my-4">
            <span className="text-slate-300">or</span>
          </div>
          <Link href="/new" passHref>
            <a>
              <button className="w-full p-4 bg-purple-500 hover:bg-purple-600 rounded-md text-center text-slate-50 font-medium">
                Create New
              </button>
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
