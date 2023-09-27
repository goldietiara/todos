import Link from "next/link";
import { redirect } from "next/navigation";
import { PiArrowLeftLight } from "react-icons/pi";
import { authOptions, getCurrentUser } from "../api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db/prisma";
import AddTodoButton from "@/components/AddTodoButton";
import TodoCategory from "@/components/TodoCategory";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Add New Todo | Planner App by Goldie Tiara",
};

export default async function Home() {
  const session = await getCurrentUser();
  if (!session) {
    return (
      <span className="flex flex-col gap-3 justify-center mt-24 items-center m-auto text-3xl">
        <Image
          src="/chiyo-chichi-fliped.PNG"
          width={200}
          height={200}
          alt="logo"
        />
        <p>Hi, Please signIn first</p>
      </span>
    );
  }

  const addNewTodo = async (formData: FormData) => {
    "use server";

    const title = formData.get("title")?.toString() || "";
    const category = formData.get("category")?.toString() || "";
    const status = false;
    const userId = session.user.id;

    if (!title || !category) {
      throw Error("Missing required fields");
    }

    await prisma.todo.create({
      data: { title, category, status, userId },
    });

    redirect("/");
  };

  return (
    <main className="w-full h-full flex items-center justify-start flex-col lg:px-7 my-6 relative">
      <div className="fixed bottom-0 left-7 h-[74.4%] border-l-1 border-black hidden md:flex"></div>
      <div className="fixed bottom-0 right-7 h-[80.5%] border-r-1 border-black hidden md:flex"></div>
      <section className="w-full h-fit md:px-16 px-7 pb-20 uppercase grid grid-cols-1 gap-10">
        <div className=" flex items-center">
          <Link href={"/"}>
            <PiArrowLeftLight className="hidden md:flex text-4xl hover:stroke-2" />
          </Link>
          <h1 className=" md:text-3xl w-full text-center"> ADD NEW TODO </h1>
        </div>
        <form
          action={addNewTodo}
          className="w-full grid grid-cols-1 gap-10 mt-10"
        >
          <input
            required
            type="text"
            name="title"
            placeholder="Title"
            className=" bg-transparent border-b-1 border-black focus:outline-none py-3 px-4 h-full"
          />

          <TodoCategory name="category" />
          <AddTodoButton />
        </form>
      </section>
    </main>
  );
}
