"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Lock, LogOut, Plus, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { shopApi } from "@/lib/shop-api";
import MagneticButton from "@/components/animations/MagneticButton";

interface Address {
  id: string; name: string; phone: string; line1: string;
  city: string; state: string; pincode: string; isDefault: boolean;
}

interface UserData {
  id: string; name: string; email: string; phone: string; addresses: Address[];
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addrForm, setAddrForm] = useState({ name: "", phone: "", line1: "", city: "", state: "", pincode: "" });

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("shop_token") : null;
    if (!token) { router.replace("/shop/login?redirect=/shop/profile"); return; }
    shopApi.getMe().then((res) => {
      const u = res.user || res;
      setUser(u);
      setEditName(u.name);
      setEditEmail(u.email);
      setEditPhone(u.phone || "");
      setLoading(false);
    }).catch(() => {
      localStorage.removeItem("shop_token");
      router.replace("/shop/login?redirect=/shop/profile");
    });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("shop_token");
    router.push("/shop");
  };

  const handleUpdateProfile = async () => {
    setSuccessMsg("");
    try {
      await shopApi.updateAddress("profile", { name: editName, email: editEmail, phone: editPhone });
      setUser((prev) => prev ? { ...prev, name: editName, email: editEmail, phone: editPhone } : prev);
      setEditing(false);
      setSuccessMsg("Profile updated successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch {
      setSuccessMsg("Failed to update profile.");
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) { setPasswordMsg("Please fill in all fields."); return; }
    if (newPassword.length < 6) { setPasswordMsg("Password must be at least 6 characters."); return; }
    setPasswordMsg("");
    try {
      await shopApi.login(user?.email || "", currentPassword);
      setPasswordMsg("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setShowPasswordForm(false);
      setTimeout(() => setPasswordMsg(""), 3000);
    } catch {
      setPasswordMsg("Current password is incorrect.");
    }
  };

  const resetAddrForm = (addr?: Address) => {
    setAddrForm(addr ? { name: addr.name, phone: addr.phone, line1: addr.line1, city: addr.city, state: addr.state, pincode: addr.pincode } : { name: "", phone: "", line1: "", city: "", state: "", pincode: "" });
  };

  const handleSaveAddress = async () => {
    if (!addrForm.name || !addrForm.line1 || !addrForm.city || !addrForm.state || !addrForm.pincode) return;
    try {
      if (editingAddressId) {
        await shopApi.updateAddress(editingAddressId, addrForm);
      } else {
        await shopApi.createAddress(addrForm);
      }
      const res = await shopApi.getAddresses();
      setUser((prev) => prev ? { ...prev, addresses: res.addresses || [] } : prev);
      setShowAddressForm(false);
      setEditingAddressId(null);
    } catch { /* ignore */ }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      await shopApi.deleteAddress(id);
      setUser((prev) => prev ? { ...prev, addresses: prev.addresses.filter((a) => a.id !== id) } : prev);
    } catch { /* ignore */ }
  };

  if (loading) {
    return (
      <main className="min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 animate-pulse">
          <div className="h-8 w-48 bg-wine/10 rounded mb-8" />
          <div className="h-48 bg-wine/5 rounded-2xl mb-4" />
          <div className="h-32 bg-wine/5 rounded-2xl" />
        </div>
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-gradient-wine-purple mb-8">My Profile</h1>

        {successMsg && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-green-50 text-green-600 border border-green-200 text-sm">{successMsg}</div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-light rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
                <span className="font-serif text-lg font-bold text-ivory">{user.name.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <h2 className="font-serif text-lg font-bold text-wine">{user.name}</h2>
                <p className="text-xs text-wine/50">{user.email}</p>
              </div>
            </div>
            <button onClick={() => setEditing(!editing)} className="text-sm text-purple hover:text-wine transition-colors">
              {editing ? "Cancel" : "Edit"}
            </button>
          </div>

          {editing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-wine/50 uppercase tracking-wider mb-1.5 block">Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-wine/30" />
                    <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/70 border border-wine/10 text-sm text-wine placeholder:text-wine/30 focus:outline-none focus:border-gold/40" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-wine/50 uppercase tracking-wider mb-1.5 block">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-wine/30" />
                    <input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/70 border border-wine/10 text-sm text-wine placeholder:text-wine/30 focus:outline-none focus:border-gold/40" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-wine/50 uppercase tracking-wider mb-1.5 block">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-wine/30" />
                    <input type="tel" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/70 border border-wine/10 text-sm text-wine placeholder:text-wine/30 focus:outline-none focus:border-gold/40" />
                  </div>
                </div>
              </div>
              <button onClick={handleUpdateProfile} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-wine to-purple text-white text-sm font-medium shadow-lg hover:brightness-110 transition-all">
                Save Changes
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: User, label: "Name", value: user.name },
                { icon: Mail, label: "Email", value: user.email },
                { icon: Phone, label: "Phone", value: user.phone || "Not set" },
              ].map((item, i) => (
                <div key={i} className="bg-white/50 rounded-xl border border-wine/5 p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <item.icon className="w-3.5 h-3.5 text-wine/30" />
                    <span className="text-[10px] text-wine/40 uppercase tracking-wider">{item.label}</span>
                  </div>
                  <p className="text-sm font-medium text-wine">{item.value}</p>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-light rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-wine" />
              <h2 className="font-serif text-lg font-bold text-wine">Saved Addresses</h2>
            </div>
            <button
              onClick={() => { setEditingAddressId(null); resetAddrForm(); setShowAddressForm(true); }}
              className="flex items-center gap-1 text-sm text-purple hover:text-wine transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>

          {showAddressForm && (
            <div className="mb-4 p-4 rounded-xl bg-white/60 border border-wine/10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-[10px] text-wine/50 uppercase tracking-wider mb-1 block">Name</label>
                  <input type="text" value={addrForm.name} onChange={(e) => setAddrForm({ ...addrForm, name: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-white/70 border border-wine/10 text-sm text-wine focus:outline-none focus:border-gold/40" />
                </div>
                <div>
                  <label className="text-[10px] text-wine/50 uppercase tracking-wider mb-1 block">Phone</label>
                  <input type="tel" value={addrForm.phone} onChange={(e) => setAddrForm({ ...addrForm, phone: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-white/70 border border-wine/10 text-sm text-wine focus:outline-none focus:border-gold/40" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[10px] text-wine/50 uppercase tracking-wider mb-1 block">Address</label>
                  <input type="text" value={addrForm.line1} onChange={(e) => setAddrForm({ ...addrForm, line1: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-white/70 border border-wine/10 text-sm text-wine focus:outline-none focus:border-gold/40" />
                </div>
                <div>
                  <label className="text-[10px] text-wine/50 uppercase tracking-wider mb-1 block">City</label>
                  <input type="text" value={addrForm.city} onChange={(e) => setAddrForm({ ...addrForm, city: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-white/70 border border-wine/10 text-sm text-wine focus:outline-none focus:border-gold/40" />
                </div>
                <div>
                  <label className="text-[10px] text-wine/50 uppercase tracking-wider mb-1 block">State</label>
                  <input type="text" value={addrForm.state} onChange={(e) => setAddrForm({ ...addrForm, state: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-white/70 border border-wine/10 text-sm text-wine focus:outline-none focus:border-gold/40" />
                </div>
                <div>
                  <label className="text-[10px] text-wine/50 uppercase tracking-wider mb-1 block">Pincode</label>
                  <input type="text" value={addrForm.pincode} onChange={(e) => setAddrForm({ ...addrForm, pincode: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-white/70 border border-wine/10 text-sm text-wine focus:outline-none focus:border-gold/40" />
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={handleSaveAddress} className="px-4 py-2 rounded-lg bg-gradient-to-r from-wine to-purple text-white text-xs font-medium hover:brightness-110 transition-all">
                  {editingAddressId ? "Update" : "Save"}
                </button>
                <button onClick={() => { setShowAddressForm(false); setEditingAddressId(null); }} className="px-4 py-2 rounded-lg border border-wine/20 text-xs text-wine/60 hover:text-wine transition-all">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {user.addresses.length === 0 && !showAddressForm ? (
            <p className="text-sm text-wine/50 text-center py-6">No addresses saved. Add one to get started.</p>
          ) : (
            <div className="space-y-2">
              {user.addresses.map((addr) => (
                <div key={addr.id} className="flex items-start justify-between p-3 rounded-xl bg-white/50 border border-wine/5">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-wine">{addr.name}</p>
                      {addr.isDefault && <span className="text-[10px] px-1.5 py-0.5 rounded bg-gold/10 text-gold font-medium">Default</span>}
                    </div>
                    <p className="text-xs text-wine/60">{addr.phone}</p>
                    <p className="text-xs text-wine/60">{addr.line1}, {addr.city}, {addr.state} - {addr.pincode}</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => { setEditingAddressId(addr.id); resetAddrForm(addr); setShowAddressForm(true); }} className="w-7 h-7 rounded-lg hover:bg-wine/5 flex items-center justify-center text-wine/30 hover:text-wine transition-all">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDeleteAddress(addr.id)} className="w-7 h-7 rounded-lg hover:bg-rose flex items-center justify-center text-wine/30 hover:text-rose-500 transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-light rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-5 h-5 text-wine" />
            <h2 className="font-serif text-lg font-bold text-wine">Change Password</h2>
          </div>
          {!showPasswordForm ? (
            <button onClick={() => setShowPasswordForm(true)} className="text-sm text-purple hover:text-wine transition-colors">
              Change password
            </button>
          ) : (
            <div className="space-y-3">
              {passwordMsg && (
                <div className={cn("px-4 py-2 rounded-lg text-xs", passwordMsg.includes("successfully") ? "bg-green-50 text-green-600" : "bg-rose text-wine")}>
                  {passwordMsg}
                </div>
              )}
              <div>
                <label className="text-[10px] text-wine/50 uppercase tracking-wider mb-1 block">Current Password</label>
                <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/70 border border-wine/10 text-sm text-wine focus:outline-none focus:border-gold/40" />
              </div>
              <div>
                <label className="text-[10px] text-wine/50 uppercase tracking-wider mb-1 block">New Password</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/70 border border-wine/10 text-sm text-wine focus:outline-none focus:border-gold/40" />
              </div>
              <div className="flex gap-2">
                <button onClick={handleChangePassword} className="px-4 py-2 rounded-lg bg-gradient-to-r from-wine to-purple text-white text-xs font-medium hover:brightness-110 transition-all">Update Password</button>
                <button onClick={() => { setShowPasswordForm(false); setCurrentPassword(""); setNewPassword(""); setPasswordMsg(""); }} className="px-4 py-2 rounded-lg border border-wine/20 text-xs text-wine/60 hover:text-wine transition-all">Cancel</button>
              </div>
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex justify-center">
          <MagneticButton>
            <button onClick={handleLogout} className="flex items-center gap-2 px-8 py-3 rounded-full border border-rose-300 text-rose-500 font-medium text-sm hover:bg-rose transition-all">
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </MagneticButton>
        </motion.div>
      </div>
    </main>
  );
}
