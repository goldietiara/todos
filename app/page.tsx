import { getCurrentUser } from "./api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db/prisma";
import Button from "@/components/Button";
import { revalidatePath } from "next/cache";
import { PiSmileyLight } from "react-icons/pi";
import { Todo } from "@prisma/client";
import Dashboard from "@/components/Dashboard";
import Image from "next/image";

export default async function Home() {
  const session = await getCurrentUser();
  console.log(session);
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
  // get user todo
  const result: Todo[] = await prisma.todo.findMany({
    where: { userId: session?.user?.id },
  });
  if (!result) return null;

  const deleteTodo = async (todoId: string) => {
    "use server";
    await prisma.todo.delete({
      where: { id: todoId },
    });
    revalidatePath("/");
  };

  const updateTodo = async (todoId: string) => {
    "use server";

    const todoStatus = await prisma.todo.findUnique({
      where: { id: todoId },
    });
    await prisma.todo.update({
      where: { id: todoId },
      data: { status: !todoStatus?.status },
    });

    revalidatePath("/");
  };

  //pie chart
  const todoUrget = await prisma.todo.findMany({
    where: {
      AND: [{ userId: session?.user?.id }, { category: "Urgent" }],
    },
  });
  const todoImportant = await prisma.todo.findMany({
    where: {
      AND: [{ userId: session?.user?.id }, { category: "Important" }],
    },
  });
  const todoOthers = await prisma.todo.findMany({
    where: {
      AND: [{ userId: session?.user?.id }, { category: "Others" }],
    },
  });
  const todoComplete = await prisma.todo.findMany({
    where: {
      AND: [{ userId: session?.user?.id }, { status: true }],
    },
  });

  return (
    <main>
      <div className="w-full h-full lg:px-7 px-5 relative hidden md:flex">
        <div className="fixed bottom-0 left-7 h-[74.4%] border-l-1 border-black"></div>
        <div className="fixed bottom-0 right-7 h-[80.5%] border-r-1 border-black"></div>
      </div>

      <section className="w-full h-[525px] uppercase grid lg:grid-cols-2 lg:gap-0 gap-10">
        <div className="md:px-10">
          <h1 className=" mb-8 md:text-3xl text-xl text-center">dashboard</h1>
          <div className=" border border-black w-full h-[456px]">
            <Dashboard
              todoUrgent={todoUrget.length}
              todoImportant={todoImportant.length}
              todoOthers={todoOthers.length}
              todoComplete={todoComplete.length}
            />
          </div>
        </div>
        <div className="md:px-10  h-[100%] pb-5">
          <h1 className=" mb-8 md:text-3xl text-center text-xl">
            Remaining Todos: {result.length - todoComplete.length}
          </h1>
          <div className=" border-t-1 border-black h-[456px] overflow-y-auto">
            {result.map((v, i: number) => {
              return (
                <div
                  className={` flex border-x-1 border-b-1 border-black ${
                    v.status ? ` bg-green-200/50` : ``
                  }`}
                >
                  <p
                    className={`w-10 ${
                      v.category === "Urgent"
                        ? `bg-rose-500`
                        : v.category === "Important"
                        ? `bg-amber-500`
                        : `bg-sky-500`
                    }`}
                  />
                  <p
                    key={i}
                    className=" border-l-1 border-black px-3 py-5 justify-between w-full overflow-auto"
                  >
                    {v.title}
                  </p>

                  {/* update */}
                  <Button
                    className={`border-x-1 border-black hover:text-Ivory  ${
                      v.status
                        ? ` hover:bg-rose-700 focus:bg-rose-700 focus:text-Ivory`
                        : ` hover:bg-black`
                    }`}
                    buttonType="update"
                    buttonAction={updateTodo}
                    status={v.status}
                    todoId={v.id}
                  />

                  {/* delete */}
                  <Button
                    className="hover:bg-rose-700 hover:text-Ivory focus:bg-rose-700 focus:text-Ivory"
                    buttonType="delete"
                    buttonAction={deleteTodo}
                    todoId={v.id}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
