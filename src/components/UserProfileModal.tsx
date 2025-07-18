import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, MapPin, Edit3, Save, X, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile, useUpdateProfile } from '@/hooks/useCommunity';
import { useToast } from '@/hooks/use-toast';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileModal = ({ isOpen, onClose }: UserProfileModalProps) => {
  const { user } = useAuth();
  const { data: profile } = useUserProfile(user?.id);
  const updateProfile = useUpdateProfile();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    bio: '',
    location: '',
    avatar_url: '',
    dietary_preferences: [] as string[]
  });
  const [newPreference, setNewPreference] = useState('');

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        bio: profile.bio || '',
        location: profile.location || '',
        avatar_url: profile.avatar_url || '',
        dietary_preferences: profile.dietary_preferences || []
      });
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync(formData);
      toast({
        title: "Profile Updated!",
        description: "Your community profile has been updated successfully."
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile. Please try again."
      });
    }
  };

  const addDietaryPreference = () => {
    if (newPreference.trim() && !formData.dietary_preferences.includes(newPreference.trim())) {
      setFormData(prev => ({
        ...prev,
        dietary_preferences: [...prev.dietary_preferences, newPreference.trim()]
      }));
      setNewPreference('');
    }
  };

  const removeDietaryPreference = (preference: string) => {
    setFormData(prev => ({
      ...prev,
      dietary_preferences: prev.dietary_preferences.filter(p => p !== preference)
    }));
  };

  if (!profile) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Community Profile
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="h-8 w-8 p-0"
            >
              {isEditing ? <X className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <Avatar className="h-20 w-20">
              <AvatarImage src={formData.avatar_url} />
              <AvatarFallback className="bg-primary/10 text-primary text-lg">
                <User className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            
            {isEditing && (
              <div className="w-full space-y-2">
                <Label htmlFor="avatar">Avatar URL</Label>
                <Input
                  id="avatar"
                  type="url"
                  value={formData.avatar_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, avatar_url: e.target.value }))}
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
            )}
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            {isEditing ? (
              <Input
                id="name"
                value={formData.full_name}
                onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                placeholder="Your full name"
              />
            ) : (
              <p className="text-foreground font-medium">
                {formData.full_name || 'No name set'}
              </p>
            )}
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location
            </Label>
            {isEditing ? (
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Your location"
              />
            ) : (
              <p className="text-muted-foreground">
                {formData.location || 'No location set'}
              </p>
            )}
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            {isEditing ? (
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Tell the community about yourself..."
                rows={3}
                maxLength={200}
              />
            ) : (
              <p className="text-muted-foreground">
                {formData.bio || 'No bio set'}
              </p>
            )}
          </div>

          {/* Dietary Preferences */}
          <div className="space-y-2">
            <Label>Dietary Preferences</Label>
            
            {isEditing && (
              <div className="flex gap-2">
                <Input
                  value={newPreference}
                  onChange={(e) => setNewPreference(e.target.value)}
                  placeholder="Add preference..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDietaryPreference())}
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={addDietaryPreference}
                  disabled={!newPreference.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {formData.dietary_preferences.map((preference) => (
                <Badge
                  key={preference}
                  variant="secondary"
                  className="text-xs"
                >
                  {preference}
                  {isEditing && (
                    <button
                      onClick={() => removeDietaryPreference(preference)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </Badge>
              ))}
              {formData.dietary_preferences.length === 0 && (
                <p className="text-muted-foreground text-sm">No dietary preferences set</p>
              )}
            </div>
          </div>

          {/* Community Stats */}
          {!isEditing && (
            <div className="space-y-2">
              <Label>Community Member Since</Label>
              <p className="text-muted-foreground">
                {new Date(profile.community_joined_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          )}

          {/* Actions */}
          {isEditing && (
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={updateProfile.isPending}
                className="flex-1"
              >
                {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};