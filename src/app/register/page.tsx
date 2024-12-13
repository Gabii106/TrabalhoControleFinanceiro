// Página de registro
export function RegisterPage() {
    const auth = getAuth();
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [confirmEmail, setConfirmEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
  
    const handleRegister = async () => {
      if (email !== confirmEmail) {
        alert('Emails não conferem.');
        return;
      }
  
      if (password !== confirmPassword) {
        alert('Senhas não conferem.');
        return;
      }
  
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        alert('Usuário cadastrado com sucesso!');
        router.push('/login');
      } catch (error) {
        alert('Erro ao cadastrar: ' + error.message);
      }
    };
  
    return (
      <div className="max-w-md mx-auto mt-10">
        <h1 className="text-2xl font-bold mb-4">Cadastro</h1>
        <input
          type="text"
          className="border rounded p-2 w-full mb-4"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          className="border rounded p-2 w-full mb-4"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="email"
          className="border rounded p-2 w-full mb-4"
          placeholder="Confirmar Email"
          value={confirmEmail}
          onChange={(e) => setConfirmEmail(e.target.value)}
        />
        <input
          type="password"
          className="border rounded p-2 w-full mb-4"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          className="border rounded p-2 w-full mb-4"
          placeholder="Confirmar Senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button
          className="bg-green-500 text-white p-2 rounded w-full"
          onClick={handleRegister}
        >
          Cadastrar
        </button>
        <div className="mt-4 text-center">
          <a href="/login" className="text-blue-500 underline">
            Já possui uma conta? Faça login
          </a>
        </div>
      </div>
    );
  }