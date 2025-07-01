'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { 
  User, 
  Phone, 
  Mail, 
  Baby, 
  CalendarIcon, 
  Camera, 
  Shield,
  Heart,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface UserProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  phone: string;
  postpartum_date: string | null;
  number_of_children: number;
  total_stars: number;
  avatar_url?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  insurance_provider?: string;
  insurance_member_id?: string;
  insurance_group_number?: string;
  created_at: string;
  updated_at: string;
}

export default function EditProfilePage() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [activeTab, setActiveTab] = useState('personal');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  
  // Profile data
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [postpartumDate, setPostpartumDate] = useState<Date | undefined>();
  const [numberOfChildren, setNumberOfChildren] = useState(1);
  
  // Emergency contact
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [emergencyRelationship, setEmergencyRelationship] = useState('');
  
  // Insurance
  const [insuranceProvider, setInsuranceProvider] = useState('');
  const [insuranceMemberId, setInsuranceMemberId] = useState('');
  const [insuranceGroupNumber, setInsuranceGroupNumber] = useState('');

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      router.push('/auth/login');
    }
  }, [user]);

  async function fetchProfile() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user!.id)
        .single();

      if (error) throw error;

      if (data) {
        setProfile(data);
        setFirstName(data.first_name || '');
        setLastName(data.last_name || '');
        setPhone(data.phone || '');
        setAvatarUrl(data.avatar_url || null);
        setPostpartumDate(data.postpartum_date ? new Date(data.postpartum_date) : undefined);
        setNumberOfChildren(data.number_of_children || 1);
        setEmergencyName(data.emergency_contact_name || '');
        setEmergencyPhone(data.emergency_contact_phone || '');
        setEmergencyRelationship(data.emergency_contact_relationship || '');
        setInsuranceProvider(data.insurance_provider || '');
        setInsuranceMemberId(data.insurance_member_id || '');
        setInsuranceGroupNumber(data.insurance_group_number || '');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessage({ type: 'error', text: 'Failed to load profile' });
    } finally {
      setLoading(false);
    }
  }

  async function handlePhotoUpload(event: React.ChangeEvent<HTMLInputElement>) {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    const file = event.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${user!.id}/${Math.random()}.${fileExt}`;

    try {
      setUploadingPhoto(true);
      setMessage(null);

      // Upload image to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update user profile with new avatar URL
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ avatar_url: publicUrl })
        .eq('user_id', user!.id);

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
      setMessage({ type: 'success', text: 'Profile photo updated successfully!' });
    } catch (error) {
      console.error('Error uploading photo:', error);
      setMessage({ type: 'error', text: 'Failed to upload photo. Please try again.' });
    } finally {
      setUploadingPhoto(false);
    }
  }

  async function updateProfile() {
    try {
      setSaving(true);
      setMessage(null);

      const updates = {
        first_name: firstName,
        last_name: lastName,
        phone,
        postpartum_date: postpartumDate ? format(postpartumDate, 'yyyy-MM-dd') : null,
        number_of_children: numberOfChildren,
        emergency_contact_name: emergencyName,
        emergency_contact_phone: emergencyPhone,
        emergency_contact_relationship: emergencyRelationship,
        insurance_provider: insuranceProvider,
        insurance_member_id: insuranceMemberId,
        insurance_group_number: insuranceGroupNumber,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('user_id', user!.id);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      
      // Update user metadata if name changed
      if (firstName || lastName) {
        await supabase.auth.updateUser({
          data: { 
            first_name: firstName,
            last_name: lastName
          }
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-bloompink" />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-bloom-gray-900">Edit Profile</h1>
        <p className="text-bloom-gray-600 mt-2">
          Update your personal information and preferences
        </p>
      </div>

      {message && (
        <Alert className={cn(
          "mb-6",
          message.type === 'success' ? "border-green-500" : "border-red-500"
        )}>
          {message.type === 'success' ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-500" />
          )}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${firstName} ${lastName}`} />
                <AvatarFallback>{firstName[0]}{lastName[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold">{firstName} {lastName}</h2>
                <p className="text-bloom-gray-600">{user?.email}</p>
                <p className="text-sm text-bloom-gray-500 mt-1">
                  Total Stars Earned: {profile?.total_stars || 0} ⭐
                </p>
              </div>
              <div>
                <input
                  type="file"
                  id="photo-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  disabled={uploadingPhoto}
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => document.getElementById('photo-upload')?.click()}
                  disabled={uploadingPhoto}
                >
                  {uploadingPhoto ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Camera className="h-4 w-4 mr-2" />
                  )}
                  {uploadingPhoto ? 'Uploading...' : 'Change Photo'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="emergency">Emergency Contact</TabsTrigger>
            <TabsTrigger value="insurance">Insurance</TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your basic profile information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-bloom-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div>
                  <Label>Postpartum Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !postpartumDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {postpartumDate ? format(postpartumDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={postpartumDate}
                        onSelect={setPostpartumDate}
                        initialFocus
                        disabled={(date) => date > new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label htmlFor="children">Number of Children</Label>
                  <div className="flex items-center space-x-2">
                    <Baby className="h-4 w-4 text-bloom-gray-400" />
                    <Input
                      id="children"
                      type="number"
                      min="0"
                      max="10"
                      value={numberOfChildren}
                      onChange={(e) => setNumberOfChildren(parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="emergency">
            <Card>
              <CardHeader>
                <CardTitle>Emergency Contact</CardTitle>
                <CardDescription>
                  Who should we contact in case of emergency?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="emergencyName">Contact Name</Label>
                  <Input
                    id="emergencyName"
                    value={emergencyName}
                    onChange={(e) => setEmergencyName(e.target.value)}
                    placeholder="Full name"
                  />
                </div>

                <div>
                  <Label htmlFor="emergencyPhone">Contact Phone</Label>
                  <Input
                    id="emergencyPhone"
                    type="tel"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <Label htmlFor="relationship">Relationship</Label>
                  <Input
                    id="relationship"
                    value={emergencyRelationship}
                    onChange={(e) => setEmergencyRelationship(e.target.value)}
                    placeholder="e.g., Spouse, Parent, Friend"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insurance">
            <Card>
              <CardHeader>
                <CardTitle>Insurance Information</CardTitle>
                <CardDescription>
                  Your insurance details for billing purposes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="provider">Insurance Provider</Label>
                  <Input
                    id="provider"
                    value={insuranceProvider}
                    onChange={(e) => setInsuranceProvider(e.target.value)}
                    placeholder="e.g., Blue Cross Blue Shield"
                  />
                </div>

                <div>
                  <Label htmlFor="memberId">Member ID</Label>
                  <Input
                    id="memberId"
                    value={insuranceMemberId}
                    onChange={(e) => setInsuranceMemberId(e.target.value)}
                    placeholder="Your insurance member ID"
                  />
                </div>

                <div>
                  <Label htmlFor="groupNumber">Group Number</Label>
                  <Input
                    id="groupNumber"
                    value={insuranceGroupNumber}
                    onChange={(e) => setInsuranceGroupNumber(e.target.value)}
                    placeholder="Your insurance group number"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => router.push('/dashboard')}
          >
            Cancel
          </Button>
          <Button 
            onClick={updateProfile} 
            disabled={saving}
            className="bg-bloompink hover:bg-bloompink/90"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}