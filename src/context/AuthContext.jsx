import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);          // Firebase user object
  const [registration, setRegistration] = useState(null); // Firestore registration doc
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const snap = await getDoc(doc(db, 'registrations', firebaseUser.uid));
        setRegistration(snap.exists() ? snap.data() : null);
      } else {
        setRegistration(null);
      }
      setLoadingAuth(false);
    });
    return unsubscribe;
  }, []);

  // Call this after completing registration so UI refreshes without re-auth
  const refreshRegistration = async () => {
    if (!user) return;
    const snap = await getDoc(doc(db, 'registrations', user.uid));
    setRegistration(snap.exists() ? snap.data() : null);
  };

  return (
    <AuthContext.Provider value={{ user, registration, loadingAuth, refreshRegistration }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
