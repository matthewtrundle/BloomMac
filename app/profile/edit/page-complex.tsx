'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import Button from '@/components/ui/Button';
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
  const [postpartumDate, setPostpartumDate] = useState<string>('');
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
  }, [user, router]);

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
        setPostpartumDate(data.postpartum_date || '');
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
        postpartum_date: postpartumDate || null,
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
        <div className={`mb-6 p-4 rounded-lg flex items-start space-x-3 ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
          )}
          <p className="text-sm">{message.text}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-4">
            <div className="relative h-20 w-20">
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt="Profile" 
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <div className="h-full w-full rounded-full bg-bloompink flex items-center justify-center text-white text-2xl font-bold">
                  {firstName[0]}{lastName[0]}
                </div>
              )}
            </div>
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
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('personal')}
              className={`flex-1 py-3 text-center font-medium transition-colors ${
                activeTab === 'personal' 
                  ? 'text-bloompink border-b-2 border-bloompink' 
                  : 'text-bloom-gray-600 hover:text-bloom-gray-800'
              }`}
            >
              Personal Info
            </button>
            <button
              onClick={() => setActiveTab('emergency')}
              className={`flex-1 py-3 text-center font-medium transition-colors ${
                activeTab === 'emergency' 
                  ? 'text-bloompink border-b-2 border-bloompink' 
                  : 'text-bloom-gray-600 hover:text-bloom-gray-800'
              }`}
            >
              Emergency Contact
            </button>
            <button
              onClick={() => setActiveTab('insurance')}
              className={`flex-1 py-3 text-center font-medium transition-colors ${
                activeTab === 'insurance' 
                  ? 'text-bloompink border-b-2 border-bloompink' 
                  : 'text-bloom-gray-600 hover:text-bloom-gray-800'
              }`}
            >
              Insurance
            </button>
          </div>

          <div className="p-6">
            {/* Personal Info Tab */}
            {activeTab === 'personal' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-bloom-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-bloom-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-bloom-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-bloom-gray-400" />
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="postpartumDate" className="block text-sm font-medium text-bloom-gray-700 mb-1">
                    Postpartum Date
                  </label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-bloom-gray-400" />
                    <input
                      id="postpartumDate"
                      type="date"
                      value={postpartumDate}
                      onChange={(e) => setPostpartumDate(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="children" className="block text-sm font-medium text-bloom-gray-700 mb-1">
                    Number of Children
                  </label>
                  <div className="relative">
                    <Baby className="absolute left-3 top-3 h-4 w-4 text-bloom-gray-400" />
                    <input
                      id="children"
                      type="number"
                      min="1"
                      max="10"
                      value={numberOfChildren}
                      onChange={(e) => setNumberOfChildren(parseInt(e.target.value) || 1)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Emergency Contact Tab */}
            {activeTab === 'emergency' && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="emergencyName" className="block text-sm font-medium text-bloom-gray-700 mb-1">
                    Contact Name
                  </label>
                  <input
                    id="emergencyName"
                    type="text"
                    value={emergencyName}
                    onChange={(e) => setEmergencyName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="emergencyPhone" className="block text-sm font-medium text-bloom-gray-700 mb-1">
                    Contact Phone
                  </label>
                  <input
                    id="emergencyPhone"
                    type="tel"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label htmlFor="emergencyRelationship" className="block text-sm font-medium text-bloom-gray-700 mb-1">
                    Relationship
                  </label>
                  <input
                    id="emergencyRelationship"
                    type="text"
                    value={emergencyRelationship}
                    onChange={(e) => setEmergencyRelationship(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                    placeholder="Spouse, Parent, Sibling, etc."
                  />
                </div>
              </div>
            )}

            {/* Insurance Tab */}
            {activeTab === 'insurance' && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="insuranceProvider" className="block text-sm font-medium text-bloom-gray-700 mb-1">
                    Insurance Provider
                  </label>
                  <input
                    id="insuranceProvider"
                    type="text"
                    value={insuranceProvider}
                    onChange={(e) => setInsuranceProvider(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                    placeholder="Blue Cross Blue Shield"
                  />
                </div>

                <div>
                  <label htmlFor="insuranceMemberId" className="block text-sm font-medium text-bloom-gray-700 mb-1">
                    Member ID
                  </label>
                  <input
                    id="insuranceMemberId"
                    type="text"
                    value={insuranceMemberId}
                    onChange={(e) => setInsuranceMemberId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                    placeholder="ABC123456789"
                  />
                </div>

                <div>
                  <label htmlFor="insuranceGroupNumber" className="block text-sm font-medium text-bloom-gray-700 mb-1">
                    Group Number
                  </label>
                  <input
                    id="insuranceGroupNumber"
                    type="text"
                    value={insuranceGroupNumber}
                    onChange={(e) => setInsuranceGroupNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloompink focus:border-transparent"
                    placeholder="12345"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={updateProfile}
            disabled={saving}
            variant="pink"
            className="min-w-[120px]"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
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