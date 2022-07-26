import type { GetServerSidePropsResult, NextPage, NextPageContext } from "next";
import Head from "next/head";
import SelectCompanyScene from 'src/components/scenes/SelectCompany'
import api from 'src/api'
import * as t from 'src/types'

export async function getServerSideProps(context: NextPageContext): Promise<GetServerSidePropsResult<Props>> {
  const companies = await api.company.list({})
  if (companies.error) {
    console.error(companies.error)
  }
  return {
    props: {
      companies: companies.data?.companies ?? []
    }
  }
}

type Props = {
  companies: t.Company[]
}

const Home: NextPage<Props> = ({ companies }) => {
  return (
    <>
      <Head>
        <title>Showswap</title>
        <meta name="description" content="How The Hottest D2C Brands Partner Online" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SelectCompanyScene companies={companies} />
    </>
  );
};

export default Home;
