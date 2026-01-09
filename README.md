# 💰 finance-bro

A modern web application for personal finance management, tracking expenses, income, budgets, and savings goals.

## 🚀 Technologies Used

### Core Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Runtime:** [Bun](https://bun.sh/)

### Frontend & UI

- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/) & [GSAP](https://gsap.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Charts:** [Recharts](https://recharts.org/)
- **Others:** `clsx`, `tailwind-merge`, `nextjs-toploader`

### Backend & Data

- **Database:** [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/)
- **Authentication:** [JWT](https://jwt.io/) & [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
- **Validation:** [Zod](https://zod.dev/)
- **State Management:** React Context API

## ✨ Features

- **Dashboard:** Overview of current balance and visualization of expenses vs. income.
- **Transactions:** Tracking all account movements with filtering options.
- **Recurring Payments:** Automatic generation of regular transactions.
- **Budgets:** Setting monthly limits for various categories.
- **Savings:** Defining savings goals and tracking progress.
- **Categories:** Fully customizable categories for better organization.

## 🛠️ Installation and Setup

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd finance-bro
   ```

2. **Install dependencies:**

   ```bash
   bun install
   ```

3. **Environment Configuration:**
   Create a `.env` file and add the required variables (e.g., `MONGODB_URI`, `JWT_SECRET`).

4. **Run the development server:**

   ```bash
   bun dev
   ```

   The application will be available at [http://localhost:3000](http://localhost:3000).
