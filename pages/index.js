import Head from 'next/head';
import BudgetApp from '../components/BudgetApp';

export default function Home() {
  return (
    <>
      <Head>
        <title>Oma Budjetti</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <BudgetApp />
      </main>
    </>
  );
}
