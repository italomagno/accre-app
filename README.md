# @italomagno/accre-app

## Overview
I noticed that my colleagues were having difficulty managing their operational shifts, so I developed this app to streamline the process. With it, users can see the remaining shifts available for each day and fill the necessary slots, much like selecting seats in a cinema. As the slots are filled, they become unavailable to other users.

## Features
- 🚀 **Dynamic Shift Management** - Easily manage shifts with a system that updates in real-time as users select and fill available slots.
- 🎨 **User-Friendly Interface** - Designed to be intuitive and easy to use, making shift management seamless.
- 🔄 **Real-Time Updates** - Ensures accurate and up-to-date shift availability as changes happen instantly.
- ⚡ **Built with Chakra UI & Next.js** - A robust, scalable, and visually appealing application.
- 📊 **Custom Google Sheets Database** - A simple yet effective backend for storing and managing shift data.

## Tech Stack
- **Frontend:** Next.js, Chakra UI
- **Backend:** Google Sheets as a database, Google APIs
- **Hosting:** Vercel (Recommended)

## Installation
### Prerequisites
- Node.js installed (>= 16.0.0)
- Google Sheets API access set up

### Steps
1. **Clone the repository**
   ```bash
   git clone https://github.com/italomagno/accre-app.git
   cd accre-app
   ```
2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Set up environment variables**
   - Create a `.env.local` file in the root directory
   - Add your Google Sheets API credentials and any other necessary environment variables

4. **Run the application**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
5. **Access the app**
   - Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage
1. View available shifts on the calendar-like interface.
2. Select an open slot to book your shift.
3. The slot is immediately updated and locked for other users.
4. Admins can manage shifts directly from the Google Sheets backend.

## Deployment
To deploy the application, use [Vercel](https://vercel.com/):
```bash
npm run build
npm run start
```
Or deploy directly via Vercel’s dashboard by linking the repository.

## Contributing
Contributions are welcome! Feel free to fork this repo, submit pull requests, or report issues.

## License
This project is licensed under the MIT License. See [LICENSE](LICENSE) for more details.

## Contact
For any questions or support, reach out via GitHub or email: [your.email@example.com](mailto:your.email@example.com).
