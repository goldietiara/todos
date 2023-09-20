type AddTodoButtonProps = {
  className?: string;
} & React.ComponentProps<"button">;

export default function TodoCategory({ className }: AddTodoButtonProps) {
  return (
    <div>
      <ul className="grid w-full grid-cols-3 text-center text-sm md:text-base">
        <li>
          <input
            type="radio"
            id="Urgent"
            name="category"
            value="Urgent"
            className="hidden peer"
            required
          />
          <label
            htmlFor="Urgent"
            className="inline-flex items-center justify-between w-full md:px-5 py-5 cursor-pointer
             border border-black
            peer-checked:text-Ivory peer-checked:bg-red-500
            hover:text-red-950 hover:bg-red-200/20
            transition-all ease-in-out duration-300"
          >
            <div className="w-full ">Urgent</div>
          </label>
        </li>
        <li>
          <input
            type="radio"
            id="Important"
            name="category"
            value="Important"
            className="hidden peer"
          />
          <label
            htmlFor="Important"
            className="inline-flex items-center justify-between w-full md:px-5 py-5 cursor-pointer
             border-black border-y-1
            peer-checked:text-Ivory peer-checked:bg-amber-500
            hover:text-amber-950 hover:bg-amber-200/20
            transition-all ease-in-out duration-300"
          >
            <div className="w-full">Important</div>
          </label>
        </li>
        <li>
          <input
            type="radio"
            id="Others"
            name="category"
            value="Others"
            className="hidden peer"
          />
          <label
            htmlFor="Others"
            className="inline-flex items-center justify-between w-full md:px-5 py-5 cursor-pointer
             border border-black
            peer-checked:text-Ivory peer-checked:bg-sky-500
            hover:text-sky-950 hover:bg-sky-200/20
            transition-all ease-in-out duration-300"
          >
            <div className="w-full">Others</div>
          </label>
        </li>
      </ul>
    </div>
  );
}
