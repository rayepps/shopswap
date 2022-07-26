import type { NextPage } from "next";
import Head from "next/head";
import CreateCompanyScene from 'src/components/scenes/CreateCompany'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Showswap</title>
        <meta name="description" content="How The Hottest D2C Brands Partner Online" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <CreateCompanyScene />
    </>
  );
};

export default Home;
