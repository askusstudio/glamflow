import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Camera, Upload, X, User, Instagram, Twitter, Facebook, Linkedin, Youtube, Plus, Trash2 } from "lucide-react";

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
  banner_url: string | null;
  email: string | null;
  social_accounts: { [key: string]: string } | null;
  expected_payment_amount: number | null;
};

const socialPlatforms = [
  { name: 'Instagram', icon: Instagram, placeholder: '@username', key: 'instagram' },
  { name: 'Twitter', icon: Twitter, placeholder: '@handle', key: 'twitter' },
  { name: 'Facebook', icon: Facebook, placeholder: 'facebook.com/profile', key: 'facebook' },
  { name: 'LinkedIn', icon: Linkedin, placeholder: 'linkedin.com/in/profile', key: 'linkedin' },
  { name: 'YouTube', icon: Youtube, placeholder: 'youtube.com/channel', key: 'youtube' },
];

const categories = [
  'Makeup',
  'Hair Styling',
  "bridal makup",
  'Nail Art',
  'Skincare',
  'Massage Therapy',
  'Waxing & Hair Removal',
  'Eyelash Extensions',
  'Brow Shaping',
  'Spa Treatments',
  'Beauty Consulting',
  'Other'
];

const priceRanges = [
  'Budget ($-$$)',
  'Mid-range ($$$)',
  'Premium ($$$$)',
  'Luxury ($$$$$)',
  'Custom'
];

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [formData, setFormData] = useState<Partial<Profile>>({
    social_accounts: {}
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [customPrice, setCustomPrice] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to view your profile.",
          variant: "destructive"
        });
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        const profileData = {
          ...data,
          social_accounts: (data as any).social_accounts || {}
        };
        setProfile({
          ...profileData,
          banner_url: (profileData as any).banner_url || null
        } as Profile);
        setFormData({
          ...profileData,
          banner_url: (profileData as any).banner_url || null
        });
        
        // If price_range is not one of the predefined options, it's a custom price
        if (data.price_range && !priceRanges.slice(0, -1).includes(data.price_range)) {
          setCustomPrice(data.price_range);
          setFormData(prev => ({ ...prev, price_range: "Custom" }));
        }
      } else if (error && error.code === 'PGRST116') {
        // Profile doesn't exist, create default
        const defaultProfile = {
          id: user.id,
          email: user.email,
          social_accounts: {}
        };
        setFormData(defaultProfile);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast({
        title: "Error",
        description: "Failed to load profile data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof Profile, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSocialChange = (platform: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      social_accounts: {
        ...prev.social_accounts,
        [platform]: value
      }
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to save your profile.",
          variant: "destructive"
        });
        return;
      }

      const updates = { 
        ...formData, 
        id: user.id,
        social_accounts: JSON.stringify(formData.social_accounts || {}),
        price_range: formData.price_range === "Custom" ? customPrice : formData.price_range
      };
      
      const { error } = await supabase.from("profiles").upsert(updates as any);
      
      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
      setProfile(formData as Profile);
      toast({
        title: "Success!",
        description: "Your profile has been updated successfully."
      });
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: `Failed to save profile changes: ${error.message || 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file: File, isAvatar: boolean, isBanner: boolean = false) => {
    if (!file) return;
    
    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to upload images.",
          variant: "destructive"
        });
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;
      
      let bucket: string;
      if (isAvatar) {
        bucket = "avatars";
      } else if (isBanner) {
        bucket = "banners";
      } else {
        bucket = "portfolio";
      }

      const { data, error } = await supabase.storage.from(bucket).upload(filePath, file);
      
      if (error) {
        // If banners bucket doesn't exist, fall back to portfolio bucket
        if (error.message.includes('Bucket not found') && isBanner) {
          console.warn('Banners bucket not found, using portfolio bucket instead');
          const { data: fallbackData, error: fallbackError } = await supabase.storage.from('portfolio').upload(filePath, file);
          if (fallbackError) throw fallbackError;
          const url = supabase.storage.from('portfolio').getPublicUrl(filePath).data.publicUrl;
          handleInputChange("banner_url", url);
          toast({
            title: "Success!",
            description: "Banner uploaded successfully."
          });
          return;
        }
        throw error;
      }

      if (data) {
        const url = supabase.storage.from(bucket).getPublicUrl(filePath).data.publicUrl;
        
        if (isAvatar) {
          handleInputChange("avatar_url", url);
        } else if (isBanner) {
          handleInputChange("banner_url", url);
        } else {
          const currentImages = formData.portfolio_images || [];
          if (currentImages.length >= 10) {
            toast({
              title: "Upload limit reached",
              description: "You can only upload up to 10 portfolio images.",
              variant: "destructive"
            });
            return;
          }
          handleInputChange("portfolio_images", [...currentImages, url]);
        }
        
        const imageType = isAvatar ? 'Avatar' : isBanner ? 'Banner' : 'Portfolio image';
        toast({
          title: "Success!",
          description: `${imageType} uploaded successfully.`
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const removePortfolioImage = (indexToRemove: number) => {
    const updatedImages = formData.portfolio_images?.filter((_, index) => index !== indexToRemove) || [];
    handleInputChange("portfolio_images", updatedImages);
  };

  const toggleAvailableDay = (day: string) => {
    const currentDays = formData.available_days || [];
    const updatedDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day];
    handleInputChange("available_days", updatedDays);
  };

  if (loading) {
    return (
      <>  
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your profile...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
 
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          {/* <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Your Profile
            </h1>
            <p className="text-muted-foreground mt-2">
              Showcase your skills and connect with potential clients
            </p>
          </div> */}

          <div className="grid gap-6 lg:gap-8">
            {/* Avatar and Basic Info */}
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10"></div>
              <CardContent className="relative p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  {/* Avatar Section */}
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative group">
                      <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-background shadow-lg">
                        <AvatarImage src={formData.avatar_url || ""} />
                        <AvatarFallback className="text-xl md:text-2xl">
                          <User className="w-8 h-8 md:w-12 md:h-12" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <Camera className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="relative">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) uploadImage(file, true);
                        }}
                        disabled={uploading}
                        className="hidden"
                        id="avatar-upload"
                      />
                      <Label
                        htmlFor="avatar-upload"
                        className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm"
                      >
                        <Upload className="w-4 h-4" />
                        {uploading ? "Uploading..." : "Change Avatar"}
                      </Label>
                    </div>
                  </div>

                  {/* Basic Info */}
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="full_name">Full Name</Label>
                        <Input
                          id="full_name"
                          value={formData.full_name || ""}
                          placeholder="Your full name"
                          onChange={(e) => handleInputChange("full_name", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={formData.phone || ""}
                          placeholder="Your phone number"
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={formData.city || ""}
                          placeholder="Your city"
                          onChange={(e) => handleInputChange("city", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={formData.category || ""}
                          onValueChange={(val) => handleInputChange("category", val)}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Banner Image */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="secondary" className="px-3 py-1">
                    Banner Image
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label>Profile Banner</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Upload a banner image that will be displayed at the top of your public profile
                    </p>
                  </div>
                  
                  {formData.banner_url ? (
                    <div className="relative group">
                      <div className="w-full h-48 md:h-64 rounded-lg overflow-hidden bg-muted">
                        <img
                          src={formData.banner_url}
                          alt="Profile banner"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="text-white text-center">
                          <Camera className="w-8 h-8 mx-auto mb-2" />
                          <p className="text-sm">Click to change banner</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                      <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground mb-2">No banner image uploaded</p>
                      <p className="text-sm text-muted-foreground">Upload a banner to showcase your profile</p>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) uploadImage(file, false, true); // isBanner = true
                        }}
                        disabled={uploading}
                        className="hidden"
                        id="banner-upload"
                      />
                      <Label
                        htmlFor="banner-upload"
                        className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm w-full justify-center"
                      >
                        <Upload className="w-4 h-4" />
                        {uploading ? "Uploading..." : formData.banner_url ? "Change Banner" : "Upload Banner"}
                      </Label>
                    </div>
                    {formData.banner_url && (
                      <Button
                        variant="outline"
                        onClick={() => handleInputChange("banner_url", null)}
                        disabled={uploading}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Services and Pricing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="secondary" className="px-3 py-1">
                    Services & Pricing
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="services">Services Offered</Label>
                  <Textarea
                    id="services"
                    value={formData.services || ""}
                    placeholder="Describe the services you offer (e.g., Bridal makeup, Photography sessions, Event planning...)"
                    onChange={(e) => handleInputChange("services", e.target.value)}
                    className="mt-1 min-h-[80px]"
                  />
                </div>
                <div>
                  <Label htmlFor="price_range">Price Range</Label>
                  <Select
                    value={formData.price_range || ""}
                    onValueChange={(val) => {
                      handleInputChange("price_range", val);
                      if (val !== "Custom") setCustomPrice("");
                    }}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select price range" />
                    </SelectTrigger>
                    <SelectContent>
                      {priceRanges.map((range) => (
                        <SelectItem key={range} value={range}>{range}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formData.price_range === "Custom" && (
                    <div className="mt-3">
                      <Label htmlFor="custom_price">Custom Price</Label>
                      <Input
                        id="custom_price"
                        value={customPrice}
                        // placeholder="e.g., $50/hour, $200/day, $500 per session"
                        onChange={(e) => setCustomPrice(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="expected_payment_amount">Expected Payment Amount (₹)</Label>
                  <Input
                    id="expected_payment_amount"
                    type="number"
                    value={formData.expected_payment_amount || ""}
                    placeholder="e.g., 10000"
                    onChange={(e) => handleInputChange("expected_payment_amount", parseFloat(e.target.value) || 0)}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    This is the total amount clients will pay (25% advance + 75% final)
                  </p>
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio || ""}
                    placeholder="Tell clients about yourself, your experience, and what makes you unique..."
                    maxLength={500}
                    onChange={(e) => handleInputChange("bio", e.target.value.slice(0, 500))}
                    className="mt-1 min-h-[120px]"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {(formData.bio || "").length}/500 characters
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="secondary" className="px-3 py-1">
                    Social Media
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {socialPlatforms.map((platform) => {
                    const IconComponent = platform.icon;
                    return (
                      <div key={platform.key}>
                        <Label htmlFor={platform.key} className="flex items-center gap-2">
                          <IconComponent className="w-4 h-4" />
                          {platform.name}
                        </Label>
                        <Input
                          id={platform.key}
                          value={formData.social_accounts?.[platform.key] || ""}
                          placeholder={platform.placeholder}
                          onChange={(e) => handleSocialChange(platform.key, e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Portfolio */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="px-3 py-1">
                      Portfolio
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      ({(formData.portfolio_images || []).length}/10)
                    </span>
                  </div>
                  {(formData.portfolio_images || []).length < 10 && (
                    <div className="relative">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) uploadImage(file, false);
                        }}
                        disabled={uploading}
                        className="hidden"
                        id="portfolio-upload"
                      />
                      <Label
                        htmlFor="portfolio-upload"
                        className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        Add Image
                      </Label>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(formData.portfolio_images || []).length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Upload className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No portfolio images yet</p>
                    <p className="text-sm">Add up to 10 images to showcase your work</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {formData.portfolio_images?.map((url, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                          <img
                            src={url}
                            alt={`Portfolio ${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removePortfolioImage(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Availability */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="secondary" className="px-3 py-1">
                    Availability
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label>Available Days</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                    {daysOfWeek.map((day) => (
                      <Button
                        key={day}
                        type="button"
                        variant={(formData.available_days || []).includes(day) ? "default" : "outline"}
                        className="justify-start"
                        onClick={() => toggleAvailableDay(day)}
                      >
                        {day}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setFormData(profile ? { ...profile, social_accounts: profile.social_accounts || {} } : { social_accounts: {} });
                  setCustomPrice("");
                }}
                disabled={loading}
              >
                Reset Changes
              </Button>
              <Button
                onClick={handleSave}
                disabled={loading || uploading}
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              >
                {loading ? "Saving..." : "Save Profile"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}