import { NavLink, Outlet } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";

const tabs = [
  { to: "/seller", label: "Overview", end: true },
  { to: "/seller/stores", label: "Stores" },
  { to: "/seller/categories", label: "Categories" },
  { to: "/seller/products", label: "Products" },
];

export default function SellerLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex">
        {/* Sidebar */}
        <aside className="sticky top-16 h-[calc(100vh-4rem)] w-64 border-r border-gray-200 bg-white">
          <div className="p-6">
            <h2 className="mb-6 text-lg font-semibold text-gray-800">
              Seller Panel
            </h2>

            <nav className="space-y-2">
              {tabs.map((tab) => (
                <NavLink
                  key={tab.to}
                  to={tab.to}
                  end={tab.end}
                  className={({ isActive }) =>
                    `block rounded-lg px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-green-600 text-white"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`
                  }
                >
                  {tab.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
