# [Talk Tide - A full stack realtime messaging chat web application](https://talktide.vercel.app)

[Talk tide](https://talktide.vercel.app) is a chatting platform similar to messenger and whatsapp. Here you can chat with any one from anywhere. You can create one on one and group chat and start chatting right away. You can send images and emoji as well. So what is stopping you just create an account and tell your friends to create account start chatting from anywhere.

## Kew Features

1. Realtime messaging with `Pusher-channel(code in feature/pusher-channel branch)` and with `Socketio(code in feature/socket branch)`
2. Register and login authentication system
3. You can create one on one chat
4. You can also create group chat
5. You can delete chat anytime
6. You can add participant remove participant as well
7. Renaming group is also possible
8. You can leave from a group chat anytime
9. Most importantly you can send images as well
10. Responsive UI built with TailwindCSS and Shadcn ui
11. Protection of sensitive routes
12. Unit test with Jest and React Testing Library

## Technologies used

- Front-End - `NextJS` `TypeScript` `React Query` `Axios` `TailwindCSS` `Shadcn ui` `Zustand` `Zod`
- Back-End - `Prisma` `Mongodb` `Zod`
- Realtime - `Pusher Channel(feature/pusher-channel branch)` `Socketio(feature/socket branch`
- Auth - `Next Auth`
- Unit Test - `Jest` `React Testing Library`

## [Home page](https://talktide.vercel.app)

[![Talk tide chat application's home page image](/public/talk-tide-home-page.png)](https://talktide.vercel.app)

## [Chat page](https://talktide.vercel.app/chat)

[![Talk tide chat application's chat page image](/public/talk-tide-chat-page.png)](https://talktide.vercel.app/chat)

## Installation

1. Clone the repo

```bash
git clone https://github.com/mehedihasan2810/talk-tide.git
cd talk-tide
```

2. Install the dependencies
```bash
npm install
```

## Configuration

Create a .env file with the following environment variables:

```bash
# DATABASE
DATABASE_URL=

# AUTH
NEXTAUTH_URL=
NEXTAUTH_SECRET=

# CLOUDINARY
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

PUSHER_APP_ID=
NEXT_PUBLIC_PUSHER_APP_KEY=
PUSHER_APP_SECRET=
NEXT_PUBLIC_PUSHER_APP_CLUSTER=

# IMGBB
IMGBB_API_KEY=
```

## Running the application

```bash
npm run dev
```

Open your browser and go to http://localhost:3000.
