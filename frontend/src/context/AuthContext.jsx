import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]               = useState(null);
  const [registration, setRegistration] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Keep a ref to the Firestore unsubscribe so we can clean it up when user changes
  const regUnsubRef = useRef(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      // ── Tear down any existing Firestore listener ──────────────────────────
      if (regUnsubRef.current) {
        regUnsubRef.current();
        regUnsubRef.current = null;
      }

      setUser(firebaseUser);

      if (firebaseUser) {
        // ── Initial fetch via API (to reuse existing server-side logic) ───────
        try {
          const res = await api.get('/api/registrations');
          setRegistration(res.data);
        } catch {
          setRegistration(null);
        }

        // ── Real-time Firestore listener for check-in status updates ──────────
        // The admin app writes directly to Firestore, so we listen here to pick
        // up check-in changes (checkedInDay1_*, checkedInDay2_*, etc.) instantly.
        const regDocRef = doc(db, 'registrations', firebaseUser.uid);
        regUnsubRef.current = onSnapshot(regDocRef, (snap) => {
          if (snap.exists()) {
            setRegistration(snap.data());
          }
        }, (err) => {
          console.warn('Registration listener error:', err);
        });
      } else {
        setRegistration(null);
      }

      setLoadingAuth(false);
    });

    return () => {
      unsubscribeAuth();
      if (regUnsubRef.current) regUnsubRef.current();
    };
  }, []);

  // Call this after completing registration so UI refreshes immediately
  const refreshRegistration = async () => {
    if (!user) return;
    try {
      const res = await api.get('/api/registrations');
      setRegistration(res.data);
    } catch {
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
