# Chat Website using MERN Stack

This is a chat website built using the MERN (MongoDB, Express, React, Node.js) stack. It provides users with the ability to create groups, remove users from groups, update group names, delete groups, engage in real-time one-to-one chat, and receive notifications. 

## Technologies Used

- MongoDB: A NoSQL database used to store data for the application.
- Express: A Node.js web application framework used for building the server-side of the application.
- React: A JavaScript library used for building the client-side of the application.
- Node.js: A JavaScript runtime used to execute server-side code.
- Sockets: Used to enable real-time communication between users.
- Cookies: Used to manage user authentication.
- JWT: Used to improve user security.

## Usage

To use this application, follow these steps:

1. Clone the repository.
2. Install dependencies by running `npm install` in both the client and server directories.
3. Create a `.env` file in the server directory with the following variables:
   - `MONGO_URI`: A connection string for your MongoDB instance.
   - `JWT_SECRET`: A secret string used to sign JWT tokens.
4. Start the development server by running `npm run dev` in the server directory.

## Link

Frontend-https://chatsup.vercel.app
Backend-https://chat-up-api.onrender.com

## Contributing

If you want to contribute to this project, please follow these steps:

1. Fork this repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Make changes and commit them (`git commit -m "Add your commit message"`).
4. Push your changes to your forked repository (`git push origin feature/your-feature-name`).
5. Open a pull request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
