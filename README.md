# TinyTrims🚀

Welcome to **TinyTrims**, an advanced URL shortener project built with Next.js, MongoDB, NextAuth, and Shadcn UI. 🌐 This project allows you to swiftly and securely shorten URLs, providing a sleek and intuitive user interface.

## Getting Started 🚀

Follow these steps to set up and run the project locally:

1. **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd TinyTrims
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Create a `.env.local` file in the root of the project** and add the following environment variables:

    ```env
    NEXT_PUBLIC_GOOGLE_CLIENT_ID=<your-google-client-id>
    NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=<your-google-client-secret>
    MONGODB_URI=<your-mongodb-uri>
    NEXTAUTH_SECRET=use "openssl rand -base64 32" or [generate here](https://generate-secret.vercel.app/32)
    ```

    Replace `<your-google-client-id>`, `<your-google-client-secret>`, and `<your-mongodb-uri>` with your actual Google API credentials and MongoDB connection details.

4. **Run the development server:**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts 📜

- `npm run dev`: Run the development server.
- `npm run build`: Build the project for production.
- `npm start`: Start the production server.
- `npm run lint`: Run ESLint for code linting.

## Dependencies 📦

This project utilizes various libraries and packages, including (but not limited to):

- [Next.js](https://nextjs.org/)
- [NextAuth](https://next-auth.js.org/)
- [MongoDB](https://www.mongodb.com/)
- [Shadcn UI](https://shadcn-ui.com/)

For a complete list, refer to the `dependencies` section in the `package.json` file.

## Contributing 🤝

Feel free to contribute to the project by opening issues or creating pull requests. Your feedback and contributions are highly appreciated!

## License 📄

This project is licensed under the [MIT License](LICENSE).

Happy URL shortening with **LinkSwift**! 🚀
