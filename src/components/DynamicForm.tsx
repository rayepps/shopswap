import { objectify, sift, mapEntries } from "radash";
import { useState, ReactNode } from "react";
import { useForm, useController } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";
import * as t from "src/types";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

export default function DynamicForm({
  questions,
  onSubmit,
}: {
  questions: t.Question[];
  onSubmit?: (responses: t.ProfileResponse[]) => void;
}) {
  const form = useForm({
    resolver: yupResolver(
      yup.object(
        objectify(
          questions,
          (q) => q.key,
          (q) => {
            switch (q.type) {
              case "binary":
                return yup.string().nullable().required("*required");
              case "single-select":
                return yup.string().required("*required");
              case "multi-select":
                return yup
                  .array(yup.string())
                  .required("*required")
                  .min(1, "Must select at least one value");
            }
          }
        )
      )
    ),
  });
  const submit = async () => {
    const isValid = await form.trigger();
    if (!isValid) return;
    const responses = Object.entries(
      form.watch() as Record<string, string | string[]>
    ).map(
      ([key, value]): {
        questionKey: string;
        answers: t.Answer[];
      } => {
        const question = questions.find((q) => q.key === key)!;
        switch (question.type) {
          case "binary":
            return {
              questionKey: question.key,
              answers: [
                {
                  option: value as string,
                  value: null,
                },
              ],
            };
          case "single-select":
            return {
              questionKey: question.key,
              answers: [
                {
                  option: value as string,
                  value: null,
                },
              ],
            };
          case "multi-select":
            return {
              questionKey: question.key,
              answers: (value as string[]).map((option) => ({
                option,
                value: null,
              })),
            };
        }
      }
    );
    onSubmit?.(responses);
  };
  return (
    <div>
      <div>
        {questions.map((question) => (
          <div key={question.key} className="mt-10">
            {question.type === "binary" && (
              <BinaryQuestion form={form} question={question} />
            )}
            {question.type === "single-select" && (
              <SingleSelectQuestion form={form} question={question} />
            )}
            {question.type === "multi-select" && (
              <MultiSelectQuestion form={form} question={question} />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-end mt-10">
        <button
          className="p-2 bg-purple-600 rounded text-slate-50 hover:bg-purple-500"
          onClick={submit}
        >
          Submit
        </button>
      </div>
    </div>
  );
}

const BinaryQuestion = ({
  question,
  form,
}: {
  question: t.Question;
  form: UseFormReturn;
}) => {
  const [yes, no] = question.options!;
  return (
    <div>
      <Label>{question.label}</Label>
      <Comment>{question.comment}</Comment>
      <ErrorMessage error={form.formState.errors[question.key]} />
      <label
        htmlFor={`${question.key}-${yes.key}`}
        className="flex items-center"
      >
        <input
          type="radio"
          value={yes.key}
          id={`${question.key}-${yes.key}`}
          className="mr-2"
          {...form.register(question.key)}
        />
        {yes.label}
      </label>
      <label
        htmlFor={`${question.key}-${no.key}`}
        className="flex items-center"
      >
        <input
          type="radio"
          value={no.key}
          id={`${question.key}-${no.key}`}
          className="mr-2"
          {...form.register(question.key)}
        />
        {no.label}
      </label>
    </div>
  );
};

const MultiSelectQuestion = ({
  question,
  form,
}: {
  question: t.Question;
  form: UseFormReturn;
}) => {
  const { field } = useController({
    control: form.control,
    name: question.key,
  });
  const [value, setValue] = useState<string[]>(field.value || []);
  return (
    <div>
      <div>
        <Label>{question.label}</Label>
        <Comment>
          {question.comment}
          {question.limit && `, limit ${question.limit}`}
        </Comment>
        <ErrorMessage error={form.formState.errors[question.key]} />
      </div>
      <div>
        {question.options?.map((option) => (
          <div key={option.key}>
            <input
              onChange={(e) => {
                if (question.limit && value.length >= question.limit) {
                  if (e.target.checked) return;
                }
                const newValue = sift([
                  ...value.filter((v) => v !== option.key),
                  e.target.checked ? option.key : undefined,
                ]) as string[];
                field.onChange(newValue);
                setValue(newValue);
              }}
              checked={!!value.find((v) => v === option.key)}
              type="checkbox"
              value={option.key}
              className="mr-2"
            />
            <span>{option.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const SingleSelectQuestion = ({
  question,
  form,
}: {
  question: t.Question;
  form: UseFormReturn;
}) => {
  const { field } = useController({
    control: form.control,
    name: question.key,
  });
  const [value, setValue] = useState<string | null>(field.value || null);
  return (
    <div>
      <div>
        <Label>{question.label}</Label>
        <Comment>{question.comment}</Comment>
        <ErrorMessage error={form.formState.errors[question.key]} />
      </div>
      <div>
        {question.options?.map((option) => (
          <div key={option.key}>
            <input
              onChange={(e) => {
                field.onChange(option.key);
                setValue(option.key);
              }}
              checked={value === option.key}
              type="checkbox"
              value={option.key}
              className="mr-2"
            />
            <span>{option.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Label = ({ children }: { children: ReactNode }) => (
  <span className="block text-xl font-semibold text-slate-800">{children}</span>
);

const Comment = ({ children }: { children: ReactNode }) => (
  <span className="block text-base text-slate-400">{children}</span>
);

const ErrorMessage = ({ error }: { error?: { message?: string } }) =>
  error?.message ? (
    <span className="block text-sm text-red-400">{error.message}</span>
  ) : null;
