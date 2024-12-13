"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  // Garantir que o componente só execute no cliente
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name) {
      setError("Por favor, preencha o campo nome.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Salvar informações adicionais do usuário no Firestore
      await setDoc(doc(db, "usuarios", user.uid), {
        nome: name,
        email,
      });

      setSuccess("Usuário cadastrado com sucesso!");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao cadastrar usuário.";
      setError(errorMessage);
    }
  };

  if (!isClient) {
    return null; 
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-3xl font-semibold text-center mb-6">Cadastro de Usuário</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Nome:</label>
            <input
              type="text"
              id="name"
              required
              placeholder="Digite seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Email:</label>
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
            <label className="block text-sm mb-1">Senha:</label>
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
            className="w-full bg-green-500 text-white p-3 rounded hover:bg-green-600 transition duration-200"
          >
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
}
