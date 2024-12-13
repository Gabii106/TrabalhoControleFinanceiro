import { useEffect, useState } from "react";
import { auth } from "../../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getSession } from 'next-auth/react';
import { Session } from 'next-auth';

interface User {
    uid: string;
    email: string;
}

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Se o Firebase reconhece o usuário
                setUser({
                    uid: firebaseUser.uid, email: firebaseUser.email
                        || ''
                });
            } else {
                // Caso contrário, tente obter a sessão do NextAuth
                const session: Session | null = await getSession();
                if (session && session.user) {
                    setUser({
                        uid: session.user.email || '', email:
                            session.user.email || ''
                    });
                } else {
                    setUser(null);
                }
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);
    return { user, loading };
};