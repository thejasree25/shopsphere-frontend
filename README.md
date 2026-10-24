# 🛍️ ShopSphere — Frontend

<p align="center">
  <img src="https://img.shields.io/badge/React-19-blue?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-7-blue?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-8-purple?logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Status-Development-orange" alt="Development" />
</p>

## 📌 About the Project

**ShopSphere** is a responsive e-commerce frontend built using React, TypeScript, and Vite. It provides a user interface for browsing products, authentication, shopping cart operations, checkout, and order management.

The frontend communicates with the ShopSphere backend to send requests and display the returned data.

**Frontend repository:**  
https://github.com/thejasree25/shopsphere-frontend

**Backend repository:**  
https://github.com/thejasree25/shopsphere-backend

## ✨ Key Features

- Browse and view products.
- Register and log in to an account.
- Add products to the shopping cart.
- Proceed through the checkout workflow.
- View and manage order-related information.
- Navigate between pages using client-side routing.
- Communicate with backend APIs.
- Use a responsive interface on different screen sizes.

*The availability of each feature depends on its current implementation and connection to the backend.*

## 🛠️ Technology Stack and Why It Is Used

| Technology | Why it is used |
|---|---|
| React | Builds reusable UI components and updates the interface when data changes. |
| TypeScript | Adds static type checking to help catch errors during development. |
| Vite | Starts the development server quickly and builds optimized production files. |
| Tailwind CSS | Styles pages using utility classes without writing every style from scratch. |
| React Router | Navigates between pages without reloading the entire website. |
| Axios | Sends HTTP requests from the frontend to the backend REST APIs. |
| Lucide React | Provides icons for buttons, navigation, and interface elements. |
| npm | Installs project dependencies and runs development scripts. |
| ESLint | Helps identify code-quality issues and potential mistakes. |
| Git and GitHub | Track code changes and host the project repository. |

## 🔄 How the Frontend Works

```text
User opens ShopSphere
        ↓
React renders the page
        ↓
User performs an action
        ↓
Frontend sends an API request using Axios
        ↓
Spring Boot backend processes the request
        ↓
Backend communicates with PostgreSQL
        ↓
Backend returns a response
        ↓
Frontend updates the interface
```

For example, when a user views the product catalog, the frontend requests product data from the backend. The returned data is then displayed on the page.

## 📁 Project Structure

The following is a guide to the main areas of a typical React frontend. Refer to the repository for the exact current filenames.

```text
shopsphere-frontend/
├── public/              # Public static assets
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/           # Page-level components
│   ├── service/         # API communication logic
│   ├── assets/          # Images and other assets
│   ├── App.tsx          # Main application component
│   └── main.tsx         # Application entry point
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## ⚙️ Installation and Setup

### Prerequisites

Install the following before running the project:

- Node.js and npm
- Git
- A running ShopSphere backend

### Step 1: Clone the repository

```bash
git clone https://github.com/thejasree25/shopsphere-frontend.git
cd shopsphere-frontend
```

### Step 2: Install dependencies

```bash
npm install
```

### Step 3: Configure the backend URL

Make sure the frontend API service points to the correct backend address. For local development, the backend commonly runs at:

```text
http://localhost:8080
```

Use the URL and configuration expected by the project's existing API service.

### Step 4: Start the frontend

```bash
npm run dev
```

Open the local URL printed in the terminal, usually:

```text
http://localhost:5173
```

### Step 5: Build for production

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

To check code quality:

```bash
npm run lint
```

## 🔗 Frontend and Backend Communication

| Frontend responsibility | Backend responsibility |
|---|---|
| Collects form input | Validates and processes requests |
| Displays product information | Retrieves product data |
| Sends login or registration details | Handles authentication |
| Sends cart or checkout requests | Processes supported shopping operations |
| Displays order information | Handles supported order operations |
| Shows API success or error responses | Returns HTTP responses |

The frontend should not directly access the database. It communicates with the backend through HTTP requests.

## 🎯 Interview Questions and Answers

### 1. What is ShopSphere?

ShopSphere is a full-stack e-commerce application. I developed the frontend using React, TypeScript, and Vite. It provides the user interface for product browsing, authentication, cart operations, checkout, and order management.

### 2. Why did you use React?

I used React because it allows me to build reusable components. For example, a product card can be reused for multiple products, reducing code duplication and making the application easier to maintain.

### 3. Why did you use TypeScript?

TypeScript adds types to JavaScript. It helps identify incorrect data types during development and makes components and API data easier to maintain.

### 4. What is Vite, and why did you use it?

Vite is a frontend development and build tool. I used it for a fast development server, quick updates during development, and production builds.

### 5. How does the frontend communicate with the backend?

The frontend uses Axios to send HTTP requests to the Spring Boot REST APIs. The backend processes each request and returns a response, which the frontend uses to update the interface.

### 6. What is React Router?

React Router allows users to navigate between application pages without reloading the whole website.

### 7. Why did you use Tailwind CSS?

Tailwind CSS provides utility classes for styling layouts, spacing, colors, and responsive designs. It helps maintain consistent styling while developing pages.

### 8. What happens when an API request fails?

The frontend should handle the error and display an appropriate message rather than leaving the user without feedback.

## 🚀 Future Improvements

- Add automated frontend tests.
- Improve accessibility and responsive behavior.
- Add loading states and clearer API error messages.
- Optimize production performance.
- Deploy the frontend and configure the production backend URL.

## 👩‍💻 Author

**Thejasree Ganginepalli**

GitHub: https://github.com/thejasree25
