import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Calendar, MapPin, Star, ExternalLink, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  city: string | null;
  category: string | null;
  services: string | null;
  price_range: string | null;
  portfolio_images: string[] | null;
  available_days: string[] | null;
  email: string | null;
  social_accounts: any | null;
}

const PublicProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) throw error;
        setProfile({
          ...data,
          social_accounts: (data as any).social_accounts || null
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Profile Not Found</h2>
          <p className="text-muted-foreground">This profile doesn't exist or is not available.</p>
        </Card>
      </div>
    );
  }

  const socialAccounts = profile.social_accounts || {};
  const portfolioImages = profile.portfolio_images || [];
  const availableDays = profile.available_days || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
            <Avatar className="w-32 h-32 border-4 border-background shadow-lg">
              <AvatarImage src={profile.avatar_url || ''} alt={profile.full_name || 'User'} />
              <AvatarFallback className="text-3xl">
                {profile.full_name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl lg:text-5xl font-bold mb-2">{profile.full_name || 'Anonymous User'}</h1>
              
              <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-4">
                {profile.category && (
                  <Badge variant="secondary" className="text-sm">
                    {profile.category}
                  </Badge>
                )}
                {profile.city && (
                  <Badge variant="outline" className="text-sm">
                    <MapPin className="w-3 h-3 mr-1" />
                    {profile.city}
                  </Badge>
                )}
                {profile.price_range && (
                  <Badge variant="outline" className="text-sm">
                    <Star className="w-3 h-3 mr-1" />
                    {profile.price_range}
                  </Badge>
                )}
              </div>

              {profile.bio && (
                <p className="text-lg text-muted-foreground mb-6 max-w-2xl">
                  {profile.bio}
                </p>
              )}

              {/* Contact Button */}
              {profile.email && (
                <Button size="lg" className="mb-4">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Me
                </Button>
              )}

              {/* Social Links */}
              {Object.keys(socialAccounts).length > 0 && (
                <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                  {Object.entries(socialAccounts).map(([platform, url]) => (
                    url && (
                      <Button
                        key={platform}
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <a href={url as string} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          {platform.charAt(0).toUpperCase() + platform.slice(1)}
                        </a>
                      </Button>
                    )
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Services */}
            {profile.services && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">Services</h2>
                  <p className="text-muted-foreground">{profile.services}</p>
                </CardContent>
              </Card>
            )}

            {/* Portfolio Gallery */}
            {portfolioImages.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-6">Portfolio</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {portfolioImages.map((image, index) => (
                      <div
                        key={index}
                        className="aspect-square bg-muted rounded-lg overflow-hidden hover:scale-105 transition-transform cursor-pointer"
                      >
                        <img
                          src={image}
                          alt={`Portfolio ${index + 1}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Availability */}
            {availableDays.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Available Days
                  </h3>
                  <div className="space-y-2">
                    {availableDays.map((day, index) => (
                      <Badge key={index} variant="outline" className="mr-2 mb-2">
                        {day}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Info</h3>
                <div className="space-y-3">
                  {profile.category && (
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Category</span>
                      <p className="text-sm">{profile.category}</p>
                    </div>
                  )}
                  {profile.city && (
                    <>
                      <Separator />
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Location</span>
                        <p className="text-sm">{profile.city}</p>
                      </div>
                    </>
                  )}
                  {profile.price_range && (
                    <>
                      <Separator />
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Price Range</span>
                        <p className="text-sm">{profile.price_range}</p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;