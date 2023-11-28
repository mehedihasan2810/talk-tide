import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const MockMessageItems = () => {
  return (
    <div className="absolute inset-0 -z-[9] mx-auto max-w-[1920px]">
      {/* top left messages */}
      <div className="absolute left-[3%] top-[11%] flex items-end gap-1  lg:left-[8%] lg:top-[13%] xl:left-[15%]">
        <Avatar className="h-7 w-7">
          <AvatarImage
            className="object-cover"
            src="https://github.com/shadcn.png"
          />
          <AvatarFallback>M</AvatarFallback>
        </Avatar>

        <div className="flex flex-col items-start">
          <span className="ml-2 text-sm text-zinc-600">Morty</span>
          <div className="rounded-3xl rounded-bl-none bg-primary p-4 px-5 py-2 text-base text-primary-foreground shadow">
            Hola! 👋
          </div>
        </div>
      </div>

      <div className="absolute left-[10%] top-[18%] flex items-end gap-1 lg:left-[15%] lg:top-[20%] xl:left-[20%]">
        <div className="flex flex-col items-end">
          <span className="mr-2 text-sm text-zinc-600">Rick</span>
          <div className=" rounded-3xl rounded-br-none bg-primary-foreground p-4 px-5 py-2 text-base text-black shadow">
            Hello! 👍
          </div>
        </div>

        <Avatar className="h-7 w-7">
          <AvatarImage className="object-cover" src="/rick.png" />
          <AvatarFallback>M</AvatarFallback>
        </Avatar>
      </div>

      <div className="absolute hidden items-end gap-1 lg:left-[13%] lg:top-[28%]  lg:flex xl:left-[19%]">
        <div className="flex flex-col items-end">
          <span className="mr-2 text-sm text-zinc-600">Norty</span>
          <div className="rounded-3xl rounded-br-none bg-primary-foreground p-4 px-5 py-2 text-base text-black shadow">
            Bonjour! 👋
          </div>
        </div>

        <Avatar className="h-7 w-7">
          <AvatarImage className="object-cover" src="/morty.png" />
          <AvatarFallback>M</AvatarFallback>
        </Avatar>
      </div>

      {/* bottom left messages */}

      <div className="absolute hidden items-end gap-1 md:bottom-[21%] md:left-[3%] md:flex  xl:bottom-[26%] xl:left-[13%]">
        <Avatar className="h-7 w-7">
          <AvatarImage
            className="object-cover"
            src="https://images.pexels.com/photos/769772/pexels-photo-769772.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          />
          <AvatarFallback>M</AvatarFallback>
        </Avatar>

        <div className="rounded-3xl rounded-bl-none bg-primary p-4 px-5 py-2 text-base text-primary-foreground shadow">
          Knock, knock. 😁
        </div>
      </div>

      <div className="absolute hidden items-end gap-1 md:bottom-[15%] md:left-[10%] md:flex xl:bottom-[20%] xl:left-[20%]">
        <div className="rounded-3xl rounded-br-none bg-primary-foreground p-4 px-5 py-2 text-base text-black shadow">
          Who&#39;s there? 😒
        </div>

        <Avatar className="h-7 w-7">
          <AvatarImage
            className="object-cover"
            src="https://images.pexels.com/photos/3228892/pexels-photo-3228892.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          />
          <AvatarFallback>M</AvatarFallback>
        </Avatar>
      </div>

      {/* top right messages */}

      <div className="absolute  hidden items-end gap-1 md:right-[10%] md:top-[15%] md:flex  xl:right-[20%] xl:top-[25%]">
        <Avatar className="h-7 w-7">
          <AvatarImage className="object-cover" src="/joey.jpg" />
          <AvatarFallback>M</AvatarFallback>
        </Avatar>

        <div className="rounded-3xl rounded-bl-none bg-primary p-4 px-5 py-2 text-base text-primary-foreground shadow">
          How you doing? 😏
        </div>
      </div>

      <div className="absolute hidden items-end gap-1 md:right-[3%] md:top-[21%] md:flex  xl:right-[15%] xl:top-[32%]">
        <div className="rounded-3xl rounded-br-none bg-primary-foreground p-4 px-5 py-2 text-base text-black shadow">
          That&#39;s what she said 🤣
        </div>

        <Avatar className="h-7 w-7">
          <AvatarImage className="object-cover" src="/michael-scott.jpg" />
          <AvatarFallback>M</AvatarFallback>
        </Avatar>
      </div>

      {/* bottom right messages */}

      <div className="absolute bottom-[21%] right-[5%] flex items-end gap-1 xl:bottom-[21%] xl:right-[15%]">
        <Avatar className="h-7 w-7">
          <AvatarImage
            className="object-cover"
            src="https://images.pexels.com/photos/1427889/pexels-photo-1427889.jpeg?auto=compress&cs=tinysrgb&w=1600"
          />
          <AvatarFallback>M</AvatarFallback>
        </Avatar>

        <div className="rounded-3xl rounded-bl-none bg-primary p-4 px-5 py-2 text-base text-primary-foreground shadow">
          Take care of yourself mom❤ <br /> bye👋
        </div>
      </div>

      <div className="absolute bottom-[15%] right-[2%] flex items-end gap-1  lg:right-[3%] xl:right-[12%]">
        <div className="rounded-3xl rounded-br-none bg-primary-foreground p-4 px-5 py-2 text-base text-black shadow">
          You too son bye❤
        </div>

        <Avatar className="h-7 w-7">
          <AvatarImage
            className="object-cover"
            src="https://images.pexels.com/photos/1197132/pexels-photo-1197132.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          />
          <AvatarFallback>M</AvatarFallback>
        </Avatar>
      </div>

      {/* ------------------------- */}
    </div>
  );
};

export default MockMessageItems;
