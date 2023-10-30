"use client";
import React from "react";
import Sidebar from "./components/Sidebar";
import { useChatStore } from "@/lib/stores/chatStores";
import { Button } from "@/components/ui/button";
import { Bars3Icon } from "@heroicons/react/20/solid";

const Chat = () => {
  const {
    selectedUser,
    groupName,
    groupParticipants,
    toggleIsMobileSidebarOpen,
  } = useChatStore((state) => state);

  console.log(groupParticipants);
  console.log(selectedUser);
  console.log(groupName);
  return (
    <div className="h-screen md:py-4">
      <div className="max-w-[800px] mx-auto flex border h-full">
        <div className="md:w-2/5 border-r">
          <Sidebar />
        </div>
        <div className="md:w-3/5">
          <div className="border-b h-14 px-4 flex justify-between items-center">
            <div> hello my name is mehedi</div>
            <Button
              className="p-1 rounded-full w-8 h-8 md:hidden"
              onClick={toggleIsMobileSidebarOpen}
              variant="outline"
            >
              <Bars3Icon className="w-full h-full" />
            </Button>
          </div>

          <div className="p-4">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt atque
            dolor earum laborum error quasi? Omnis quidem magni totam voluptate
            distinctio numquam inventore nam fuga debitis maxime at ad excepturi
            tempora asperiores, odio quae fugiat quaerat tenetur voluptas
            recusandae iusto ab sint laboriosam illo. Vitae, dolor eius.
            Asperiores, porro nisi. Aut tenetur esse dolorum accusantium
            pariatur quod obcaecati necessitatibus voluptatibus exercitationem
            beatae libero, doloremque repellendus? Adipisci reiciendis quia
            animi dignissimos et recusandae expedita laudantium? Earum
            consequuntur quod nesciunt accusantium veniam? Molestias architecto
            molestiae ea eligendi aliquam quasi beatae velit officia hic dolorem
            voluptatem iure explicabo aspernatur, recusandae ullam sit ratione.
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio
            consequuntur laboriosam excepturi in corporis dolorem, quaerat alias
            doloremque. Voluptates impedit, illum sunt voluptatum delectus atque
            consectetur dignissimos suscipit, facilis at tempora itaque cumque!
            Omnis totam fugiat enim est voluptates, itaque autem molestias
            aspernatur. Corrupti alias saepe minus excepturi ipsam maiores aut
            dolore, neque ea necessitatibus in amet iste ratione aliquam
            suscipit, reiciendis nisi eligendi dicta harum ab rem. Asperiores
            esse tempora blanditiis rem ipsum non ab autem et harum, sit
            corrupti quidem recusandae vel, temporibus dolorum, fuga magnam cum
            eligendi iste? Eos enim est doloribus distinctio eveniet ipsa vel
            culpa.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
