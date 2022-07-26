import type { GetServerSidePropsResult, NextPage, NextPageContext } from "next";
import Head from "next/head";
import CompanyDetailScene from "src/components/scenes/CompanyDetail";
import * as t from "src/types";
import api from "src/api";

export async function getServerSideProps(
  context: NextPageContext
): Promise<GetServerSidePropsResult<Props>> {
  const company = await api.company.find({
    id: context.query.id as string,
  });
  if (company.error) {
    console.error(company.error);
  }
  return {
    props: {
      company: company.data?.company,
      matches: company.data?.matches,
    },
  };
}

type Props = {
  company: t.Company;
  matches: t.Match[];
};

const CompanyDetailPage: NextPage<Props> = ({ company, matches }) => {
  return (
    <>
      <Head>
        <title>Showswap</title>
        <meta
          name="description"
          content="How The Hottest D2C Brands Partner Online"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <CompanyDetailScene company={company} matches={matches} />
    </>
  );
};

export default CompanyDetailPage;
