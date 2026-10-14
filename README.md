# 🎒 Campus Found Hub

**A Smart Campus Lost & Found Platform**

Campus Found Hub is a web-based Lost & Found platform designed to help students report lost belongings, discover found items, and simplify the process of reconnecting lost items with their rightful owners within a college campus.

Instead of relying on scattered WhatsApp messages, notice boards, or word of mouth, Campus Found Hub provides a centralized platform for managing lost and found reports.

## ✨ Key Features

- **Lost Item Reporting:** Submit reports for belongings that have been lost on campus.
- **Found Item Reporting:** Share information about items found around the college.
- **Smart Matching:** Help users identify potentially matching lost and found items.
- **User Authentication:** Provide a structured user registration and sign-in experience.
- **Centralized Platform:** Organize lost and found information in one place.
- **Responsive Interface:** Access the platform through a modern web interface.
- **Reusable Components:** Maintain a structured frontend for easier development and maintenance.

## 🎯 Problem Statement

Students frequently lose personal belongings such as ID cards, books, wallets, keys, and electronic accessories on campus. Existing reporting methods can be scattered, time-consuming, and difficult to track.

Campus Found Hub aims to simplify this process by providing a single digital platform where users can report missing items, browse found belongings, and identify potential matches.

## 💡 Our Solution

Campus Found Hub brings lost and found reporting into one centralized web application. It makes information easier to organize and access while helping students identify items that may belong to them.

The platform aims to reduce the time and effort involved in recovering misplaced belongings and improve the campus community's experience.

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| React.js | Frontend user interface |
| Vite | Development server and build tool |
| JavaScript | Application logic |
| CSS / CSS Modules | Styling and component-level design |
| MongoDB | Database |
| Git & GitHub | Version control and source-code management |

## 🏗️ Application Structure

The project contains separate pages, reusable styling, and utility modules to organize the frontend.

```text
CAMPUS-FOUND-HUB/
├── src/
│   ├── pages/
│   │   ├── Report.jsx
│   │   ├── Signup.jsx
│   │   └── SmartMatch.jsx
│   ├── utils/
│   │   ├── helpers.js
│   │   └── matching.js
│   └── ...
├── public/
├── .gitignore
├── package.json
└── vite.config.js
```

*Note: This is a simplified view of selected project files, not the complete directory structure.*

## 🚀 Getting Started

### Prerequisites

Install the following before running the project:

- Node.js
- npm
- MongoDB, if required by your configured backend

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/Anjali-Jha-2005/CAMPUS-FOUND-HUB.git
```

**2. Navigate to the project directory**

```bash
cd CAMPUS-FOUND-HUB
```

**3. Install dependencies**

```bash
npm install
```

**4. Start the development server**

```bash
npm run dev
```

Open the local URL displayed in your terminal to access the application.

> If your repository contains separate frontend and backend folders, install dependencies and start each service using its own `package.json` scripts.

## 🔐 Environment Configuration

If the application uses environment variables, create a `.env` file based on the variables required by your project.

For example:

```env
MONGODB_URI=your_mongodb_connection_string
```

Use the actual variable names expected by your backend. Never commit real database credentials, API keys, or other secrets to GitHub.

## 🔮 Future Scope

- AI-powered matching of lost and found items.
- Image-based item similarity detection.
- Email or in-app notifications for potential matches.
- Secure ownership verification before returning items.
- Integration with college ERP or campus management systems.
- Mobile-friendly improvements and accessibility enhancements.
- Analytics dashboard for campus administrators.

## 🌟 Project Impact

Campus Found Hub aims to make campus life more convenient by improving communication around lost belongings and making the recovery process more organized.

## 👩‍💻 Developer

**Anjali Jha**

B.Tech Computer Science and Engineering

- GitHub: [Anjali-Jha-2005](https://github.com/Anjali-Jha-2005)

## 📄 License

This project is available for educational and development purposes. Add a license file to the repository if you intend to distribute it under a specific open-source license.

---

**Campus Found Hub — Lost Less. Find Faster. Reconnect Smarter.**
