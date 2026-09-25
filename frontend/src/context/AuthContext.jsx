import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);          // Firebase user object
  const [registration, setRegistration] = useState(null); // Firestore registration doc
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const res = await api.get('/api/registrations');
          const reg = await ensureCheckInFields(res.data);
          setRegistration(reg);
        } catch (err) {
          // If 404, it just means they haven't registered yet, which is fine.
          setRegistration(null);
        }
      } else {
        setRegistration(null);
      }
      setLoadingAuth(false);
    });
    return unsubscribe;
  }, []);

  // Auto-initialize missing check-in fields for existing registrations
  const ensureCheckInFields = async (reg) => {
    if (!reg) return reg;
    const needsPatch =
      reg.checkedInDay1 === undefined ||
      reg.checkedInDay2 === undefined;
    if (needsPatch) {
      const patch = {};
      if (reg.checkedInDay1 === undefined) patch.checkedInDay1 = false;
      if (reg.checkedInDay2 === undefined) patch.checkedInDay2 = false;
      try {
        await api.patch('/api/registrations', patch);
        return { ...reg, ...patch };
      } catch (e) {
        // Non-critical — return original
        return { ...reg, checkedInDay1: false, checkedInDay2: false };
      }
    }
    return reg;
  };

  // Call this after completing registration so UI refreshes without re-auth
  const refreshRegistration = async () => {
    if (!user) return;
    try {
      const res = await api.get('/api/registrations');
      const reg = await ensureCheckInFields(res.data);
      setRegistration(reg);
    } catch (err) {
      setRegistration(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, registration, loadingAuth, refreshRegistration }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
