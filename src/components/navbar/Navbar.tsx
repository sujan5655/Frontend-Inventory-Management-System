import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectAuthUser } from "../../features/auth/authSelectors";
import { logout } from "../../features/auth/authSlice";
import { selectCartItems } from "../../features/cart/cartSelectors";
import { FaShoppingCart } from "react-icons/fa";

export default function Navbar() {
  const user = useAppSelector(selectAuthUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };
  const cartItems = useAppSelector(selectCartItems);
  console.log(cartItems);
  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[#111827]/95 shadow-lg shadow-black/10 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[72px] items-center justify-between">
          {/* =========================
          LOGO
      ========================== */}
          <Link to="/" className="group flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 text-white shadow-lg shadow-emerald-500/20 transition duration-300 group-hover:scale-105">
              <span className="text-lg font-black">O</span>
            </div>

            <div className="hidden sm:block">
              <h1 className="text-lg font-bold tracking-tight text-white">
                Online
                <span className="text-emerald-400">Store</span>
              </h1>

              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">
                Shop smarter
              </p>
            </div>
          </Link>

          {/* =========================
          DESKTOP NAVIGATION
      ========================== */}
          <div className="hidden md:flex md:items-center">
            <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.06] p-1.5">
              <Link
                to="/"
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-gray-100"
              >
                Home
              </Link>

              <Link
                to="/about"
                className="rounded-full px-4 py-2 text-sm font-medium text-gray-300 transition hover:bg-white/10 hover:text-white"
              >
                About
              </Link>

              <Link
                to="/services"
                className="rounded-full px-4 py-2 text-sm font-medium text-gray-300 transition hover:bg-white/10 hover:text-white"
              >
                Services
              </Link>

              <Link
                to="/pricing"
                className="rounded-full px-4 py-2 text-sm font-medium text-gray-300 transition hover:bg-white/10 hover:text-white"
              >
                Pricing
              </Link>

              <Link
                to="/contact"
                className="rounded-full px-4 py-2 text-sm font-medium text-gray-300 transition hover:bg-white/10 hover:text-white"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* =========================
          RIGHT SIDE
      ========================== */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <Link
              to="/cart"
              className="group relative flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-gray-300 transition hover:border-emerald-400/30 hover:bg-emerald-500/10 hover:text-emerald-400"
              aria-label="Shopping cart"
            >
              <FaShoppingCart
                size={19}
                className="transition-transform duration-200 group-hover:scale-110"
              />

              {/* Cart Badge */}
              {cartItems.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-[#111827] bg-emerald-500 px-1 text-[10px] font-bold text-white shadow-md">
                  {cartItems.length > 99 ? "99+" : cartItems.length}
                </span>
              )}
            </Link>

            {/* User */}
            {user && (
              <div className="hidden items-center gap-3 border-l border-white/10 pl-4 sm:flex">
                {/* Avatar */}
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-green-600 text-sm font-bold text-white shadow-md">
                  {user.first_name?.charAt(0).toUpperCase()}
                </div>

                <div className="hidden lg:block">
                  <p className="max-w-[130px] truncate text-sm font-semibold text-white">
                    {user.first_name} {user.last_name}
                  </p>

                  <p className="text-[11px] capitalize text-gray-400">
                    {user.role}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-semibold text-gray-300 transition hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-400"
                >
                  Logout
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-gray-300 transition hover:bg-white/10 hover:text-white md:hidden"
              aria-controls="navbar-default"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>

              <svg
                className="h-5 w-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* =========================
        MOBILE NAVIGATION
    ========================== */}
        <div
          id="navbar-default"
          className="hidden border-t border-white/10 py-4 md:hidden"
        >
          <div className="space-y-1 rounded-2xl border border-white/10 bg-white/[0.04] p-2">
            <Link
              to="/"
              className="block rounded-xl bg-white px-4 py-3 text-sm font-semibold text-gray-900"
            >
              Home
            </Link>

            <Link
              to="/about"
              className="block rounded-xl px-4 py-3 text-sm font-medium text-gray-300 transition hover:bg-white/10 hover:text-white"
            >
              About
            </Link>

            <Link
              to="/services"
              className="block rounded-xl px-4 py-3 text-sm font-medium text-gray-300 transition hover:bg-white/10 hover:text-white"
            >
              Services
            </Link>

            <Link
              to="/pricing"
              className="block rounded-xl px-4 py-3 text-sm font-medium text-gray-300 transition hover:bg-white/10 hover:text-white"
            >
              Pricing
            </Link>

            <Link
              to="/contact"
              className="block rounded-xl px-4 py-3 text-sm font-medium text-gray-300 transition hover:bg-white/10 hover:text-white"
            >
              Contact
            </Link>

            {user && (
              <div className="mt-3 border-t border-white/10 pt-3">
                <div className="flex items-center justify-between px-3 py-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-green-600 text-sm font-bold text-white">
                      {user.first_name?.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-white">
                        {user.first_name} {user.last_name}
                      </p>

                      <p className="text-xs capitalize text-gray-400">
                        {user.role}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-lg px-3 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-500/10"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
