import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { authService } from "../services/auth.service";
import { addressService } from "../services/address.service";
import Breadcrumb from "../components/common/Breadcrumb";
import toast from "react-hot-toast";
import { HiOutlinePlus, HiOutlineTrash, HiOutlineStar } from "react-icons/hi";

interface Address {
  _id: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState({ name: user?.name || "", phone: user?.phone || "" });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "" });
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addressForm, setAddressForm] = useState({ fullName: "", phone: "", address: "", city: "", state: "", zipCode: "", country: "US" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    addressService.list().then((res) => setAddresses(res.data.addresses || res.data || [])).catch(() => {});
  }, []);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await authService.updateProfile(profile);
      updateUser(profile);
      toast.success("Profile updated");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setSaving(true);
    try {
      await authService.updatePassword(passwordForm);
      setPasswordForm({ currentPassword: "", newPassword: "" });
      toast.success("Password updated");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update password");
    } finally {
      setSaving(false);
    }
  };

  const handleAddressSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingAddress) {
        await addressService.update(editingAddress._id, addressForm);
      } else {
        await addressService.create(addressForm);
      }
      const res = await addressService.list();
      setAddresses(res.data.addresses || res.data || []);
      setShowAddressForm(false);
      setEditingAddress(null);
      setAddressForm({ fullName: "", phone: "", address: "", city: "", state: "", zipCode: "", country: "US" });
      toast.success(editingAddress ? "Address updated" : "Address added");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save address");
    } finally {
      setSaving(false);
    }
  };

  const handleAddressDelete = async (id: string) => {
    try {
      await addressService.delete(id);
      setAddresses(addresses.filter((a) => a._id !== id));
      toast.success("Address deleted");
    } catch { toast.error("Failed to delete"); }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await addressService.setDefault(id);
      const res = await addressService.list();
      setAddresses(res.data.addresses || res.data || []);
      toast.success("Default address updated");
    } catch { toast.error("Failed"); }
  };

  const editAddress = (addr: Address) => {
    setAddressForm({ fullName: addr.fullName, phone: addr.phone, address: addr.address, city: addr.city, state: addr.state, zipCode: addr.zipCode, country: addr.country });
    setEditingAddress(addr);
    setShowAddressForm(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb crumbs={[{ label: "My Profile" }]} />
      <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mb-8">My Profile</h1>

      <div className="space-y-8">
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Personal Information</h2>
          <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input value={user?.email || ""} disabled className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50 text-gray-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-wine-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-wine-300" />
            </div>
            <div className="flex items-end">
              <button type="submit" disabled={saving} className="px-6 py-2.5 bg-wine-500 text-white rounded-xl text-sm font-medium hover:bg-wine-600 disabled:opacity-50 transition-colors">
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Change Password</h2>
          <form onSubmit={handlePasswordUpdate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <input type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-wine-300" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-wine-300" required />
            </div>
            <div className="sm:col-span-2">
              <button type="submit" disabled={saving} className="px-6 py-2.5 bg-wine-500 text-white rounded-xl text-sm font-medium hover:bg-wine-600 disabled:opacity-50 transition-colors">
                {saving ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">Saved Addresses</h2>
            <button onClick={() => { setShowAddressForm(true); setEditingAddress(null); setAddressForm({ fullName: user?.name || "", phone: user?.phone || "", address: "", city: "", state: "", zipCode: "", country: "US" }); }} className="flex items-center gap-1 text-sm text-wine-500 hover:text-wine-600 font-medium">
              <HiOutlinePlus /> Add Address
            </button>
          </div>
          {addresses.length === 0 && !showAddressForm && (
            <p className="text-sm text-gray-500">No addresses saved yet.</p>
          )}
          <div className="space-y-3">
            {addresses.map((addr) => (
              <div key={addr._id} className={`p-4 rounded-xl border ${addr.isDefault ? "border-wine-300 bg-wine-50" : "border-gray-200"}`}>
                <div className="flex items-start justify-between">
                  <div className="text-sm">
                    <p className="font-medium text-gray-800">{addr.fullName}</p>
                    <p className="text-gray-500">{addr.address}, {addr.city}, {addr.state} {addr.zipCode}</p>
                    <p className="text-gray-500">{addr.phone}</p>
                  </div>
                  <div className="flex gap-2">
                    {!addr.isDefault && (
                      <button onClick={() => handleSetDefault(addr._id)} className="p-1.5 text-gray-400 hover:text-gold-500 transition-colors" title="Set as default">
                        <HiOutlineStar />
                      </button>
                    )}
                    <button onClick={() => editAddress(addr)} className="p-1.5 text-gray-400 hover:text-wine-500 transition-colors text-xs">Edit</button>
                    <button onClick={() => handleAddressDelete(addr._id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                      <HiOutlineTrash className="text-sm" />
                    </button>
                  </div>
                </div>
                {addr.isDefault && <span className="inline-block mt-2 text-xs text-wine-500 font-medium">Default Address</span>}
              </div>
            ))}
          </div>
          {showAddressForm && (
            <form onSubmit={handleAddressSave} className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input value={addressForm.fullName} onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-wine-300" required />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input value={addressForm.phone} onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-wine-300" required />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input value={addressForm.address} onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-wine-300" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input value={addressForm.city} onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-wine-300" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input value={addressForm.state} onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-wine-300" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                <input value={addressForm.zipCode} onChange={(e) => setAddressForm({ ...addressForm, zipCode: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-wine-300" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <select value={addressForm.country} onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-wine-300">
                  <option value="US">United States</option>
                  <option value="IN">India</option>
                  <option value="UK">United Kingdom</option>
                  <option value="CA">Canada</option>
                </select>
              </div>
              <div className="sm:col-span-2 flex gap-3">
                <button type="submit" disabled={saving} className="px-6 py-2.5 bg-wine-500 text-white rounded-xl text-sm font-medium hover:bg-wine-600 disabled:opacity-50 transition-colors">
                  {saving ? "Saving..." : editingAddress ? "Update" : "Save"}
                </button>
                <button type="button" onClick={() => { setShowAddressForm(false); setEditingAddress(null); }} className="px-6 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:border-gray-300 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
