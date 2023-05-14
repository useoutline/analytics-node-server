# Outline Analytics Node Server
The Outline Analytics Node Server is a backend server that works in conjunction with the Outline Analytics SDK to provide a comprehensive analytics solution for your applications

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18.x)
- If you're using nvm, you can make use of the `.nvmrc` file to use the correct Node version:
    ```sh
    nvm install
    # or
    nvm use
    ```

### Installation

1. Clone the repo
2. Install NPM packages
   ```sh
   npm install
   # or
   yarn install
   ```
3. Choose one of the following options for database setup:
    - Use MongoDB locally.
    - Use MongoDB Atlas to store data on the cloud.
4. Signup at Maxmind.com to obtain a Maxmind license key for fetching the GeoLite2-City database. The database is automatically updated via cron once the server starts. The cron job updates the database every Wednesday and Saturday.
5. (OPTIONAL) SSL certificates are required for HTTPS. You can use [Let's Encrypt](https://letsencrypt.org/) to obtain free SSL certificates.
6. Create a `.env` file in the root directory and add the following environment variables
   ```sh
    PORT=<PORT_FOR_SERVER> # Defaults to 3000. Optional
    MONGO_URL=<YOUR_MONGODB_CONNECTION_URL> # MongoDB connection string URI
    MAXMIND_DB_URL=https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-City&license_key=<YOUR_LICENSE_KEY>&suffix=tar.gz # Replace <YOUR_LICENSE_KEY> with your Maxmind license key
    SSL_KEY=<PATH_TO_SSL_KEY> # Path to SSL key (e.g., privkey.pem if using Let's Encrypt). This is optional but required if using SSL_CERT.
    SSL_CERT=<PATH_TO_SSL_CERT> # Path to SSL certificate (e.g., fullchain.pem if using Let's Encrypt). This is optional but required if using SSL_KEY.
    ```

### Usage

1. Start the server
   ```sh
   npm run start
   # or
   yarn start
   ```
   We use PM2 to launch the production server. You can use `npm run dev` or `yarn dev` to start the server in development mode, which uses nodemon.
2. The server will start on the port specified in the `.env` file or port 3000 by default.
3. The server will automatically fetch the GeoLite2-City database from Maxmind and update it every Wednesday and Saturday.
4. To restart the server, run `npm run restart` or `yarn restart`. Useful when you update the codebase or make changes.
5. To stop the server, run `npm run stop` or `yarn stop`.
6. To view the logs, run `npm run logs` or `yarn logs`.
7. To monitor the server, run `npm run monitor` or `yarn monitor`.

You can use the IP address or domain name of this server as the serverUrl option in the SDK. For example: <https://192.168.0.1:3000> or <https://api.example.com>.
We recommend using HTTPS for production servers to ensure secure communication.
