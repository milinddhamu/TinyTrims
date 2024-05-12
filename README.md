<img src="https://private-user-images.githubusercontent.com/68379239/296188699-eef1eae3-f948-45a7-b915-87b43976fb39.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MDUwNTE0NzUsIm5iZiI6MTcwNTA1MTE3NSwicGF0aCI6Ii82ODM3OTIzOS8yOTYxODg2OTktZWVmMWVhZTMtZjk0OC00NWE3LWI5MTUtODdiNDM5NzZmYjM5LnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNDAxMTIlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjQwMTEyVDA5MTkzNVomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWJhMzY1YmUxYzE4MzAwMmM4MGVkYThjNmExY2RmM2E1MWFmOGNhMDFjMjgzYjQ1MjI4Yjc4NTg0NWJjZGZlN2YmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JmFjdG9yX2lkPTAma2V5X2lkPTAmcmVwb19pZD0wIn0.O0rTEoP_NzdDkWiiAmnbB8Rrk4t6xR_fbJHwX9aeYRo" alt="Tiny Trims" width="100%" />

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
    NEXTAUTH_SECRET=use "openssl rand -base64 32" or use link below
    ```
    
    Replace `<your-google-client-id>`, `<your-google-client-secret>`, and `<your-mongodb-uri>` with your actual Google API credentials and MongoDB connection details.
   
    `NEXTAUTH_SECRET` is required for production only. [Generate it here](https://generate-secret.vercel.app/32)

5. **Run the development server:**

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

Happy URL shortening with **Tiny Trims**! 🚀
