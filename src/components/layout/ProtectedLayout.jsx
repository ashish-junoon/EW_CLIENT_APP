import { Link, Outlet } from "react-router-dom";
import Icon from "../utils/Icon";
import { heroPoints } from "../content/Content";
import Images from "../content/Images";
import { useUserInfoContext } from "../context/UserInfoContext";
import MobileMenu from "../utils/MobileMenu";
import Pwa from "../utils/Pwa";

function ProtectedLayout() {
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
  const { userInfo } = useUserInfoContext();

  const handleLogout = () => {
    localStorage.removeItem("loggedUser");
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full">
      {/* Left Section - Hidden on small screens, 60% width on lg+ */}
      <div className="hidden md:flex lg:w-3/5 min-h-screen items-center justify-center bg-gradient-to-br from-primary via-primary/90 to-secondary/80 p-6">
        <div className="w-full max-w-5xl bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden">
          <div className="grid lg:grid-cols-2">
            {/* Left Image Section */}
            <div className="relative hidden lg:block">
              <img
                src={Images.ewgirl || "/placeholder.svg"}
                alt="Loan"
                className="h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

              <div className="absolute bottom-6 left-6 text-white">
                <h2 className="text-2xl font-bold mb-2">
                  Smart Financial Solutions
                </h2>
                <p className="text-sm opacity-90">
                  Fast approval • Secure process • Instant credit access
                </p>
              </div>
            </div>

            {/* Right Content Section */}
            <div className="flex flex-col justify-center p-8">
              {/* Logo */}
              <div className="flex justify-center mb-4">
                <img
                  src={Images.fullLogo || "/placeholder.svg"}
                  alt="Logo"
                  className="h-12"
                />
              </div>

              {/* Heading */}
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  Need a{" "}
                  <span className="text-secondary">Quick Credit Line?</span>
                </h1>

                <p className="text-sm text-gray-600">
                  Apply in minutes and get access to flexible financial
                  solutions.
                </p>
              </div>

              {/* Feature List */}
              <div className="space-y-1">
                {heroPoints.map((feature) => (
                  <div
                    key={feature.id}
                    className="flex items-center p-2 rounded-xl border border-gray-200 hover:border-secondary hover:shadow-md transition-all bg-white"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary/10 mr-3">
                      <Icon name={feature.icon} className="text-secondary" />
                    </div>

                    <span className="text-sm font-medium text-gray-700">
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bottom note */}
              <p className="text-center text-xs text-gray-500 mt-6">
                Trusted by thousands of customers across India
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Full width on mobile, 40% on lg+ */}
      <div className="w-full lg:w-2/5 h-auto lg:h-screen overflow-y-auto bg-white">
        {/* Header - Mobile only */}
        <div className="lg:hidden bg-white shadow-lg p-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <img className="h-10" src={Images.fullLogo} alt="Logo" />

            {/* Navigation Links (if allowed) */}
            {userInfo?.bank_info_fill && (
              <div className="gap-4 text-sm hidden lg:flex">
                <Link className="text-black hover:text-primary" to="/">
                  Home
                </Link>
                <Link className="text-black hover:text-primary" to="/my-loan">
                  Account
                </Link>
                <Link className="text-black hover:text-primary" to="/profile">
                  Profile
                </Link>
              </div>
            )}

            {/* Logout Button */}
            {loggedUser && (
              <button onClick={handleLogout}>
                <Icon
                  className="text-primary"
                  name="RiLogoutCircleRLine"
                  color="#FF0000"
                />
              </button>
            )}
          </div>
        </div>

        {/* Header - Desktop only */}
        <div className="hidden lg:block bg-white shadow-lg p-5 mb-8">
          <div className="grid grid-cols-6 items-center">
            {/* Back Button */}
            <div className="col-span-1">
              {window.location.pathname !== "/" && (
                <button
                  onClick={() => window.history.back()}
                  className="bg-gray-100 rounded-full p-2 shadow-sm"
                >
                  <Icon
                    className="text-primary"
                    name="IoArrowBackSharp"
                    color="#0b5cff"
                  />
                </button>
              )}
            </div>

            {/* Navigation */}
            <div className="col-span-4 hidden lg:flex justify-center">
              {userInfo?.bank_info_fill && (
                <div className="gap-5 py-2 flex">
                  <Link
                    className="text-black hover:text-primary hover:font-semibold"
                    to="/"
                  >
                    Home
                  </Link>
                  <Link
                    className="text-black hover:text-primary hover:font-semibold"
                    to="/my-loan"
                  >
                    Account
                  </Link>
                  <Link
                    className="text-black hover:text-primary hover:font-semibold"
                    to="/profile"
                  >
                    Profile
                  </Link>
                </div>
              )}
            </div>

            {/* Logout Button */}
            <div className="col-span-1 flex justify-end">
              {loggedUser && (
                <button
                  onClick={handleLogout}
                  className="bg-gray-100 rounded-full p-2 shadow-lg"
                >
                  <Icon
                    className="text-primary"
                    name="RiLogoutCircleRLine"
                    color="#FF0000"
                  />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 py-6 md:py-10">
          <Outlet />
        </div>

        {/* Mobile Menu */}
        {userInfo?.bank_info_fill && (
          <div className="lg:hidden my-16">
            <MobileMenu />
          </div>
        )}
      </div>

      <Pwa />
    </div>
  );
}

export default ProtectedLayout;
