This is a full-stack real-time messaging platform that allows users to communicate with end-to-end encryption, manage friend requests, customize their profiles, and enjoy features like online status, read receipts, and browser notifications.

## Technologies Used

- **Next.js**: A powerful React framework for building server-rendered and static web applications. It handles routing, server-side rendering, and more, making the app fast and SEO-friendly.

- **Tailwind CSS**: A utility-first CSS framework used for styling the UI, providing highly customizable, modern, and responsive designs with minimal CSS code.

- **TanStack React Query**: A state management library that simplifies data fetching, caching, synchronization, and background updates in React. It handles server state seamlessly, allowing for a more efficient and declarative approach to data-fetching.

- **Socket.IO**: A library that enables real-time, bi-directional communication between clients and servers. It's used for delivering live chat messages, online status, and read receipts in the chat app.

- **Zod**: A TypeScript-first schema declaration and validation library used for validating incoming data, ensuring that the structure and content of the data are correct and secure.

- **Express**: A Node.js framework used to build the backend API, handling routes, middleware, and server logic efficiently.

- **PostgreSQL**: A powerful, open-source relational database used to store user data, chat messages, and more. It provides strong ACID compliance and supports advanced querying.

- **JWT (JSON Web Token)**: A standard used for securely transmitting information between the frontend and backend for authentication and authorization. It ensures that only authenticated users can access certain routes and features.

- **Prisma**: An ORM (Object-Relational Mapping) tool for working with the PostgreSQL database. It simplifies database operations, like querying and updating records, while ensuring type safety with TypeScript.

- **Docker**: A containerization tool used to create lightweight, isolated environments for the app. It allows the app to run consistently across different environments, making deployment easier and more reliable.

## Features

- **Real-time messaging**: Send and receive messages instantly with the help of Socket.IO.
- **End-to-end encryption**: Messages are encrypted to ensure secure communication between users.
- **Online status**: See whether your friends are online or offline in real-time.
- **Read receipts**: Know when your sent messages have been read by the recipient.
- **Browser notifications**: Get notifications when new messages arrive, even if you are not actively viewing the app.
- **Friend requests**: Send, accept, and delete friend requests to connect with other users.
- **Search Functionality**: Find specific chats, users and friends.
- **User Authentication and authorization**: Create an account, log in, and manage authentication with JWT.
- **Account and Profile Customization**: Customize your account details, including name, bio, and profile picture
- **Light mode/dark mode**: Customize your chat experience with a theme that suits your preference.
