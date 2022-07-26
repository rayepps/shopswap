import { Menu, Transition } from "@headlessui/react";
import * as t from "src/types";
import {
  ArrowLeftIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
} from "@heroicons/react/solid";
import Image from "next/image";
import { Fragment, useState } from "react";
import Link from "next/link";
import { QUESTIONS } from "src/qa";
import Logo from "../Logo";
import DynamicForm from "../DynamicForm";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useFetch from "src/hooks/useFetch";
import api from "src/api";
import { useRouter } from "next/router";

export default function SelectCompanyScene() {
  const router = useRouter();
  const createCompanyRequest = useFetch(api.company.create);
  const form = useForm({
    defaultValues: {
      name: "",
    },
    resolver: yupResolver(
      yup.object({
        name: yup.string().required(),
      })
    ),
  });
  const handleSubmit = async (responses: t.ProfileResponse[]) => {
    const isValid = await form.trigger();
    if (!isValid) return;
    const { error, data } = await createCompanyRequest.fetch({
      name: form.watch().name,
      responses,
    });
    if (error) {
      console.error(error);
      alert(error.details);
      return;
    }
    router.push(`/company/${data.company.id}`);
  };
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
            <span className="ml-2 font-medium">Create Company</span>
          </div>
          <div>
            <Logo size={8} />
          </div>
        </div>
        <div className="pt-10">
          <label className="block text-xl font-semibold text-slate-800">
            Company Name
          </label>
          <div className="border-slate-300 border-b-2">
            <input
              type="text"
              className="text-4xl p-1"
              placeholder="Ted's Tackle"
              {...form.register("name")}
            />
          </div>
        </div>
        <div>
          <DynamicForm questions={QUESTIONS} onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
}
