import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Plus, Sparkles, User, Settings, LogOut, UserCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [showAddTask, setShowAddTask] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("Beauty Artist");
  const [email, setEmail] = useState("artist@glamflow.com");
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email || "No email");
        
        const { data, error } = await supabase
          .from("profiles")
          .select("full_name, avatar_url")
          .eq("id", user.id)
          .single();
        
        if (!error && data) {
          setFullName(data.full_name || "User");
          setAvatarUrl(data.avatar_url || null);
        }
      }
      setLoading(false);
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
        console.log("Navigate to profile");
        navigate("/profile");
        break;
      case "settings":
        console.log("Navigate to settings");
        break;
      case "logout":
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.error("Logout error:", error.message);
        } else {
          console.log("Logged out successfully");
          navigate("/");
        }
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <header className="border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                GlamFlow
              </span>
            </div>
            <nav className="hidden md:flex gap-6">
              <Button
                variant="ghost"
                className="bg-primary/10 text-primary"
                onClick={() => window.location.assign("/app")}
              >
                Dashboard
              </Button>
              <Button variant="ghost" onClick={() => window.location.assign("/tasks")}>Tasks</Button>
              <Button variant="ghost" onClick={() => window.location.assign("/calendar")}>Calendar</Button>
              <Button variant="ghost" onClick={() => window.location.assign("/analytics")}>Analytics</Button>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {/* <Button
              size="sm"
              className="bg-gradient-primary"
              onClick={() => setShowAddTask(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Quick Add
            </Button> */}

            {/* Profile Dropdown */}
            <div className="relative" ref={profileMenuRef}>
              <Button
                variant="ghost"
                size="sm"
                className="relative h-9 w-9 rounded-full p-0 hover:bg-primary/10"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="h-8 w-8 rounded-full object-cover" />
                  ) : (
                    <User className="h-4 w-4 text-white" />
                  )}
                </div>
              </Button>

              {/* Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-card border rounded-md shadow-lg z-50 animate-in fade-in-0 zoom-in-95">
                  <div className="p-3 border-b">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center overflow-hidden">
                        {avatarUrl ? (
                          <img src={avatarUrl} alt="Avatar" className="h-10 w-10 object-cover" />
                        ) : (
                          <User className="h-5 w-5 text-white" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{fullName}</p>
                        <p className="text-xs text-muted-foreground">{email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="py-2">
                    <button
                      onClick={() => window.location.href = "/profile"}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-muted transition-colors"
                    >
                      <UserCircle className="h-4 w-4" />
                      Profile
                    </button>

                    <button
                      onClick={() => handleProfileAction("settings")}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-muted transition-colors"
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </button>
                  </div>

                  <div className="border-t py-2">
                    <button
                      onClick={() => handleProfileAction("logout")}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
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
      </header>
    </div>
  );
};

export default Navbar;
