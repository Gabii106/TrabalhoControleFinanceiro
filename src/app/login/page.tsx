"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  // Garantir que o componente só execute no cliente
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao autenticar";
      setError(errorMessage);
    }
  };

  if (!isClient) {
    return null; 
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-3xl font-semibold text-center mb-6">Sistema de Login</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Digite seu email:</label>
            <input
              type="email"
              id="email"
              required
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Digite sua senha:</label>
            <input
              type="password"
              id="password"
              required
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full p-2 border rounded"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition duration-200"
          >
            Entrar
          </button>
        </form>
        <button
          onClick={() => router.push('/cadastroUser')}
          className="text-blue-500 hover:underline"
        >
        Não possui um perfil. Cadastrar-se
        </button>
      </div>
    </div>
  );
}
