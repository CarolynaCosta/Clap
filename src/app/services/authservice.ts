import { Injectable } from '@angular/core';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { environment } from 'src/environments/environment';
import { initializeApp, getApps, getApp } from "firebase/app";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private app = !getApps().length ? initializeApp(environment.firebaseConfig) : getApp();
  private auth = getAuth(this.app);
  private db = getFirestore(this.app);

  async register(email: string, password: string, nome: string) {
    console.log('🧠 AuthService.register chamado');
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(this.db, 'usuarios', user.uid), {
        nome,
        email,
        criadoEm: new Date()
      });

      console.log('✅ Usuário registrado no Firebase:', user.uid);
      return user;
    } catch (error) {
      console.error('🔥 Erro no registro Firebase:', error);
      throw error;
    }
  }

  async login(email: string, password: string) {
    console.log('🧠 AuthService.login chamado com', email);
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      console.log('✅ Login Firebase bem-sucedido:', result.user.uid);
      return result.user;
    } catch (error) {
      console.error('🔥 Erro Firebase login:', error);
      throw error;
    }
  }

  async logout() {
    return await signOut(this.auth);
  }
}
