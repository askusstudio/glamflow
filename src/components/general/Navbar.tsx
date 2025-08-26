import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Menu, X, Sparkles, User, Settings, LogOut, UserCircle, ExternalLink } from "lucide-react";
// import { supabase } from "@/integrations/supabase/client";
// import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const profileMenuRef = useRef(null);
  // const navigate = useNavigate();
  // const location = useLocation();
  const navigate = (path) => console.log(`Navigate to: ${path}`);
  const location = { pathname: "/app" }; // Mock current location

  const [fullName, setFullName] = useState("Beauty Artist");
  const [email, setEmail] = useState("artist@glamflow.com");
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch user profile data (mocked for demo)
  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      // Mock user data for demo
      setTimeout(() => {
        setUserId("demo-user-123");
        setEmail("demo@glamflow.com");
        setFullName("Demo User");
        setAvatarUrl(null);
        setLoading(false);
      }, 1000);
    };

    fetchUserProfile();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleProfileAction = async (action) => {
    setShowProfileMenu(false);

    switch (action) {
      case "profile":
        navigate("/profile");
        break;
      case "public-profile":
        if (userId) {
          window.open(`/public-profile/${userId}`, '_blank');
        }
        break;
      case "settings":
        console.log("Navigate to settings");
        break;
      case "logout":
        console.log("Logging out...");
        navigate("/");
        break;
      default:
        break;
    }
  };

  const getNavItemClass = (path) => {
    const isActive = location.pathname === path;
    return `
      relative transition-all duration-300 ease-out
      ${isActive 
        ? 'text-white shadow-lg' 
        : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
      }
    `;
  };

  const navItems = [
    { label: "Dashboard", path: "/app" },
    { label: "Tasks", path: "/tasks" },
    { label: "Bookings", path: "/bookings" },
  ];

  return (
    <>
      {/* Background blur overlay */}
      <div 
        className={`fixed inset-0 pointer-events-none transition-all duration-500 ${
          isScrolled ? 'backdrop-blur-sm bg-black/5 dark:bg-white/5' : ''
        }`} 
        style={{ zIndex: 45 }}
      />
      
      <header 
        className={`
          fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out
          ${isScrolled 
            ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-lg border-b border-white/20 dark:border-gray-700/30' 
            : 'bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-b border-white/10 dark:border-gray-700/20'
          }
        `}
        style={{
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo with enhanced animation */}
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate("/app")}>
            <div className="relative">
              <Sparkles className="h-7 w-7 text-blue-600 dark:text-blue-400 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />
              <div className="absolute inset-0 h-7 w-7 bg-blue-600/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 dark:from-blue-400 dark:via-purple-400 dark:to-blue-600 bg-clip-text text-transparent animate-gradient">
              GlamFlow
            </span>
          </div>

          {/* Desktop Navigation with enhanced styling */}
          <nav className="hidden md:flex gap-1">
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <div key={item.path} className="relative group">
                  <Button
                    variant="ghost"
                    className={`
                      px-4 py-2 h-9 rounded-full transition-all duration-300 ease-out
                      ${getNavItemClass(item.path)}
                      hover:bg-white/60 dark:hover:bg-gray-700/60
                      backdrop-blur-sm border border-transparent
                      hover:border-white/30 dark:hover:border-gray-600/30
                      hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-white/5
                    `}
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                    onClick={() => navigate(item.path)}
                  >
                    {item.label}
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-90 -z-10 animate-pulse" />
                    )}
                  </Button>
                  
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-20" />
                </div>
              );
            })}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className={`
                md:hidden h-10 w-10 p-0 rounded-full transition-all duration-300
                hover:bg-white/60 dark:hover:bg-gray-700/60
                backdrop-blur-sm border border-white/20 dark:border-gray-700/20
                hover:shadow-lg hover:scale-105
              `}
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <div className="relative">
                <Menu className={`h-5 w-5 transition-all duration-300 ${showMobileMenu ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'}`} />
                <X className={`h-5 w-5 absolute inset-0 transition-all duration-300 ${showMobileMenu ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`} />
              </div>
            </Button>

            {/* Profile Dropdown with enhanced glass effect */}
            <div className="relative" ref={profileMenuRef}>
              <Button
                variant="ghost"
                size="sm"
                className={`
                  relative h-10 w-10 rounded-full p-0 transition-all duration-300
                  hover:scale-105 hover:shadow-lg
                  bg-white/40 dark:bg-gray-700/40 backdrop-blur-md
                  border border-white/30 dark:border-gray-600/30
                  hover:bg-white/60 dark:hover:bg-gray-600/60
                `}
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden ring-2 ring-white/50 dark:ring-gray-300/50">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-4 w-4 text-white" />
                  )}
                </div>
              </Button>

              {/* Enhanced Profile Dropdown Menu */}
              {showProfileMenu && (
                <div 
                  className={`
                    absolute right-0 mt-3 w-64 
                    bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl
                    border border-white/20 dark:border-gray-700/20
                    rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/40
                    animate-in fade-in-0 zoom-in-95 slide-in-from-top-2
                    duration-200 ease-out
                  `}
                  style={{
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                  }}
                >
                  {/* Profile Header */}
                  <div className="p-4 border-b border-white/10 dark:border-gray-700/20">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden ring-2 ring-white/30">
                        {avatarUrl ? (
                          <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                        ) : (
                          <User className="h-5 w-5 text-white" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-gray-900 dark:text-white">{fullName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    {[
                      { action: "profile", icon: UserCircle, label: "Profile" },
                      { action: "public-profile", icon: ExternalLink, label: "View Public Profile" },
                      { action: "settings", icon: Settings, label: "Settings" }
                    ].map((item) => (
                      <button
                        key={item.action}
                        onClick={() => handleProfileAction(item.action)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50 transition-all duration-200 rounded-lg mx-2"
                      >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </button>
                    ))}
                  </div>

                  {/* Logout Section */}
                  <div className="border-t border-white/10 dark:border-gray-700/20 py-2">
                    <button
                      onClick={() => handleProfileAction("logout")}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50/50 dark:hover:bg-red-900/20 transition-all duration-200 rounded-lg mx-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Mobile Navigation Menu */}
        {showMobileMenu && (
          <div 
            className={`
              md:hidden border-t border-white/20 dark:border-gray-700/20
              bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl
              animate-in slide-in-from-top duration-300 ease-out
            `}
            style={{
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            <nav className="container mx-auto px-6 py-4 space-y-2">
              <div className="sm:hidden mb-4">
                <ThemeToggle />
              </div>
              {navItems.map((item, index) => {
                const isActive = location.pathname === item.path;
                return (
                  <Button
                    key={item.path}
                    variant="ghost"
                    className={`
                      w-full justify-start h-12 rounded-xl transition-all duration-300
                      ${isActive 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-gray-700/60'
                      }
                      hover:shadow-lg hover:scale-[1.02] backdrop-blur-sm
                      border border-white/20 dark:border-gray-700/20
                    `}
                    style={{
                      animationDelay: `${index * 50}ms`,
                    }}
                    onClick={() => {
                      navigate(item.path);
                      setShowMobileMenu(false);
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      {/* Add custom CSS for gradient animation */}
      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </>
  );
};

export default Navbar;