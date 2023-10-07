import { Inter } from "next/font/google";
import prisma, { drink, liquor_list, user } from "@/lib/prisma";
import { GetServerSideProps, NextPage } from "next";
import { Layout } from "@/components/pages/Layout";
import { useState } from "react";
import { CiCircleRemove } from "react-icons/ci";

const inter = Inter({ subsets: ["latin"] });
type DrinkWithISOString = Omit<drink, "drank_at"> & {
  drank_at: string;
};

type Props = {
  user: user[];
  liquor_list: liquor_list[];
  drink: DrinkWithISOString[];
};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const [user, liquor_list, drink] = await Promise.all([
    prisma.user.findMany(),
    prisma.liquor_list.findMany(),
    prisma.drink.findMany({
      take: 50,
      orderBy: {
        drank_at: "desc",
      },
    }),
  ]);
  return {
    props: {
      user,
      liquor_list,
      drink: drink.map((d) => ({
        ...d,
        drank_at: d.drank_at.toISOString().split("T")[0].replaceAll("-", "/"),
      })),
    },
  };
};

const Home: NextPage<Props> = ({ user, liquor_list, drink }) => {
  const [drinkList, setDrinkList] = useState<DrinkWithISOString[]>(drink);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectUser, setSelectUser] = useState<number>(user[0].id);
  const [selectLiquor, setSelectLiquor] = useState<number>(liquor_list[0].id);
  const [breakDownUser, setBreakDownUser] = useState<number | null>(null);

  const displayName = user.find((u) => u.id === breakDownUser)?.name;

  const handleBreakdown = (userId: number) => {
    setBreakDownUser(userId);
    setIsOpen(true);
  };

  const handleEnter = async () => {
    const body = {
      user_id: selectUser,
      liquor_id: selectLiquor,
    };

    try {
      await fetch("/api/drink/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      await drinkListUpdate();
    } catch (e) {
      console.log(e);
      alert("登録に失敗しました");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch("/api/drink/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      await drinkListUpdate();
    } catch (e) {
      alert("削除に失敗しました");
    }
  };

  const drinkListUpdate = async () => {
    const res = await fetch("/api/drink/list", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const drinkList = await res.json();
    setDrinkList(drinkList.data);
  };

  return (
    <Layout>
      <div className="w-full mt-16 rounded-lg overflow-hidden shadow-lg bg-slate-400 p-6">
        <h2 className="font-bold text-xl mb-4 text-center">今の結果</h2>
        <div className="flex flex-col">
          {user.map((user) => (
            <div
              key={user.id}
              className="flex justify-between items-center py-4"
            >
              <div>
                <p className="ml-4 text-gray-700 text-base">{user.name}</p>
              </div>
              <div className="flex flex-row items-center gap-8">
                <p className="text-gray-700 text-base">{user.count}</p>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
                  onClick={() => handleBreakdown(user.id)}
                >
                  内訳
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full mt-16 rounded-lg overflow-hidden shadow-lg bg-slate-400 p-6">
        <div className="flex flex-row justify-between items-center py-4">
          <h2 className="ml-2 font-bold text-xl text-center">飲んだお酒登録</h2>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded">
            お酒を登録
          </button>
        </div>
        <select
          className="w-full mt-8 appearance-none bg-gray-200 rounded px-4 py-2 border border-gray-200 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          onChange={(e) => setSelectLiquor(Number(e.target.value))}
        >
          {liquor_list.map((liquor) => (
            <option key={liquor.id} value={liquor.id}>
              {liquor.name}
            </option>
          ))}
        </select>
        <select
          className="w-full mt-8 appearance-none bg-gray-200 rounded px-4 py-2 border border-gray-200 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          onChange={(e) => setSelectUser(Number(e.target.value))}
        >
          {user.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
        <div className="flex justify-center mt-8">
          <button
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
            onClick={() => handleEnter()}
          >
            登録
          </button>
        </div>
      </div>

      <h2 className="font-bold text-xl mt-16 text-center">
        飲んだお酒内訳: {displayName}
      </h2>
      {isOpen &&
        drinkList.map((drink) => {
          if (drink.user_id !== breakDownUser) return;
          const drinkName = liquor_list.find((l) => l.id === drink.liquor_id);
          return (
            <div
              key={drink.id}
              className="w-full mt-8 rounded-lg overflow-hidden shadow-lg bg-slate-400 p-6"
            >
              <div className="flex items-center justify-between py-4">
                <div className="ml-4">
                  <p className="text-gray-700 text-lg font-bold">
                    {drinkName?.name} key: {drink.id}
                  </p>
                  <div className="flex flex-row items-center mt-2">
                    <p className="text-gray-700 text-sm">飲んだ日:</p>
                    <p className="ml-2 text-gray-700 font-bold">
                      {drink.drank_at}
                    </p>
                  </div>
                </div>
                <div className="mr-4">
                  <CiCircleRemove
                    className="hover: cursor-pointer"
                    size="42px"
                    color="red"
                    onClick={() => handleDelete(drink.id)}
                  />
                </div>
              </div>
            </div>
          );
        })}
    </Layout>
  );
};

export default Home;
