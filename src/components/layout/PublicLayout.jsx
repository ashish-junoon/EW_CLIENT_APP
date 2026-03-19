import { Outlet } from "react-router-dom";
import Icon from "../utils/Icon";
import { heroPoints } from "../content/Content";
import Images from "../content/Images";
import Pwa from "../utils/Pwa";
function PublicLayout() {
  return (
    <div className="flex flex-col lg:flex-row h-auto min-h-screen w-full">
      {/* Left Section - Hidden on small screens, full width on md, 60% width on lg+ */}

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

      {/* Right Section - Full width on mobile and md, 40% on lg+ */}
      <div className="w-full lg:w-2/5 md:h-auto lg:h-screen overflow-y-auto bg-white">
        {/* Mobile-only header - visible on small and medium screens */}
        <div className="md:hidden bg-white shadow-lg p-4">
          <div className="flex items-center justify-center">
            <img
              className="h-8 w-auto"
              src={Images.logo || "/placeholder.svg"}
              alt="Logo"
            />
          </div>
        </div>

        {/* Content area with responsive padding */}
        <div className="lg:h-screen lg:flex justify-center items-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-14 py-6 md:py-10">
          <Outlet />
        </div>
      </div>

      <Pwa />
    </div>
  );
}
export default PublicLayout;
