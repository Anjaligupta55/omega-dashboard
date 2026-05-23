# Omega Dashboard 🚀

A premium SaaS-style product management dashboard built with React and Vite. This application is designed to simulate a professional startup admin panel, featuring dynamic themes, robust filtering, URL state synchronization, and a variety of performance optimizations. 

## ✨ Features

- **Premium Modern UI**: A clean, minimalistic SaaS design inspired by modern tools like Linear and Vercel. 
- **Bright/Dull Mode**: Fully functional theme toggle with smooth animations that persists user preferences using `localStorage`.
- **Responsive Layout**: Adapts seamlessly to desktop, tablet, and mobile with a collapsible sidebar and adaptive components (e.g., product tables convert to cards on mobile).
- **Advanced Filtering & Sorting**: Sort products, filter by categories, rating, and stock status.
- **URL State Synchronization**: Search terms, active filters, and pagination are synced securely to the URL using `useSearchParams`. Refreshing the page keeps your exact filter state intact!
- **Column Customization**: Toggle table columns on or off. Settings are persisted locally.
- **Real-Time Simulation**: Mock live product inventory updates powered by a global Toast notification context.
- **Data Visualization**: Integrated `recharts` to render visual analytics like Category Distribution, Traffic, and Rating distributions.

## ⚡ Performance Optimizations

This dashboard implements several React optimizations to ensure maximum framerate and responsiveness:

1. **`useMemo`**: Used heavily for memoizing sorted and filtered product derivations. This ensures expensive recalculations are only fired when dependencies strictly change.
2. **`useCallback`**: Memoizes function handlers (like `onFilterChange`) to prevent unnecessary child component re-renders.
3. **`React.memo`**: Protects pure UI components (like `ProductCard`, `ProductTable`, `Button`, and `Badge`) from useless re-renders when parent states change.
4. **`useDebounce`**: A custom hook delays the user's search queries by `300ms`, minimizing UI blocking and excessive re-renders during fast typing.
5. **Route Lazy Loading**: Employs `React.lazy` and `Suspense` for chunking route bundles, yielding an extremely lightweight initial load.

## 🛠️ Technology Stack

- **Core**: React 19, Vite
- **Styling**: Vanilla CSS (Custom tokens, Flexbox/Grid)
- **Routing**: React Router v7
- **Icons**: Lucide React
- **Charts**: Recharts
- **API**: DummyJSON API

## 📂 Project Structure

```
src/
├── components/
│   ├── layout/        # Sidebar, Navbar, DashboardLayout
│   ├── products/      # Tables, Filters, Pagination, Cards
│   └── ui/            # Reusable core elements (Button, Badge, Skeleton, Toast)
├── hooks/             # Custom hooks (useDebounce, useLocalStorage, useTheme)
├── pages/             # Route level components (Dashboard, Products, Analytics, etc.)
├── services/          # API fetch services
├── utils/             # Formatters, sorting and filtering logic
├── App.jsx            # Routing and Global Contexts
└── main.jsx           # Entry Point
```

## 🚀 Setup & Installation

Follow these steps to run the application locally:

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd omega-dashboard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

