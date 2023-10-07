import React from "react";
import Head from "next/head";

type Props = {
  children: React.ReactNode;
};

export const Layout = ({ children }: Props) => {
  return (
    <>
      <Head>
        <title>お酒管理アプリ</title>
        <meta
          name="description"
          content="お互いの飲んだお酒を管理するアプリです"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <header className="w-full h-16 bg-gray-400">
          <div className="h-full flex justify-center items-center">
            <h1 className="text-xl font-bold text-center">我が家のお酒管理</h1>
          </div>
        </header>
        <div className="w-full max-w-lg m-auto p-8">{children}</div>
      </main>
    </>
  );
};
