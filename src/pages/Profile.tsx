import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTheme } from "next-themes";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";

type Profile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  city: string | null;
  category: string | null;
  services: string | null;
  price_range: string | null;
  bio: string | null;
  portfolio_images: string[] | null;
  available_days: string[] | null;
  avatar_url: string | null;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [formData, setFormData] = useState<Partial<Profile>>({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return; // Redirect or handle unauth
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (!error) {
        setProfile(data);
        setFormData(data);
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleInputChange = (field: keyof Profile, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    const updates = { ...formData, id: user?.id };
    const { error } = await supabase.from("profiles").upsert(updates);
    if (!error) setProfile(formData as Profile); // Update local state
    setLoading(false);
  };

  const uploadImage = async (file: File, isAvatar: boolean) => {
    setUploading(true);
    const filePath = `${(await supabase.auth.getUser()).data.user?.id}/${file.name}`;
    const bucket = isAvatar ? "avatars" : "portfolio"; // Assumes 'portfolio' bucket exists
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);
    if (!error && data) {
      const url = supabase.storage.from(bucket).getPublicUrl(filePath).data.publicUrl;
      if (isAvatar) {
        handleInputChange("avatar_url", url);
      } else {
        handleInputChange("portfolio_images", [...(formData.portfolio_images || []), url]);
      }
    }
    setUploading(false);
  };

  if (loading) return <div className="text-center">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-card rounded shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Edit Your Profile</h2>
        <Toggle
          pressed={theme === "dark"}
          onPressedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? "Light" : "Dark"} Mode
        </Toggle>
      </div>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label>Avatar</Label>
          <Avatar src={formData.avatar_url ?? ""} className="w-24 h-24" />
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files, true)}
            disabled={uploading}
          />
        </div>
        <div>
          <Label>Full Name</Label>
          <Input
            value={formData.full_name ?? "--"}
            onChange={(e) => handleInputChange("full_name", e.target.value)}
          />
        </div>
        <div>
          <Label>Phone</Label>
          <Input
            value={formData.phone ?? "--"}
            onChange={(e) => handleInputChange("phone", e.target.value)}
          />
        </div>
        <div>
          <Label>City</Label>
          <Input
            value={formData.city ?? "--"}
            onChange={(e) => handleInputChange("city", e.target.value)}
          />
        </div>
        <div>
          <Label>Category</Label>
          <Select
            value={formData.category ?? ""}
            onValueChange={(val) => handleInputChange("category", val)}
          >
            <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Beauty">Beauty</SelectItem>
              <SelectItem value="Tech">Tech</SelectItem>
              {/* Add more options */}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Services (comma-separated)</Label>
          <Input
            value={formData.services ?? "--"}
            onChange={(e) => handleInputChange("services", e.target.value)}
          />
        </div>
        <div>
          <Label>Price Range</Label>
          <Select
            value={formData.price_range ?? ""}
            onValueChange={(val) => handleInputChange("price_range", val)}
          >
            <SelectTrigger><SelectValue placeholder="Select range" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Bio (max 250 chars)</Label>
          <Textarea
            value={formData.bio ?? "--"}
            onChange={(e) => handleInputChange("bio", e.target.value.slice(0, 250))}
          />
        </div>
        <div>
          <Label>Portfolio Images</Label>
          <div className="flex gap-2">
            {formData.portfolio_images?.map((url, idx) => (
              <img key={idx} src={url} alt="Portfolio" className="w-20 h-20 object-cover" />
            ))}
          </div>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files, false)}
            disabled={uploading}
          />
        </div>
        <div>
          <Label>Available Days (multi-select)</Label>
          <Select
            multiple // Use a multi-select component; shadcn/ui may need extension for true multi
            value={formData.available_days ?? []}
            onValueChange={(vals) => handleInputChange("available_days", vals)}
          >
            <SelectTrigger><SelectValue placeholder="Select days" /></SelectTrigger>
            <SelectContent>
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <SelectItem key={day} value={day}>{day}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="mt-6 flex gap-4">
        <Button onClick={handleSave} disabled={loading}>Save Changes</Button>
        <Button variant="secondary" onClick={() => setFormData(profile ?? {})}>Cancel</Button>
      </div>
    </div>
  );
}
