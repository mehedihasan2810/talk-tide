import { type NextRequest } from "next/server";


export const config = {
    matcher: "/api/socket"
}

export function middleware(_req: NextRequest){
    
    // console.log("fooooo")

    // return Response.json("not")
}