import React, { useState } from 'react';
import { Link } from 'react-router';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login Form Submitted:', { email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0d0d] px-4 font-sans text-zinc-100">
      <div className="max-w-sm w-full bg-[#171717] rounded-xl p-8 border border-zinc-800/80">
        <h2 className="text-2xl font-semibold text-center mb-8 tracking-tight">
          Welcome Back
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-sm text-zinc-400">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2.5 bg-[#222222] border border-zinc-700/50 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-[#44C7D4] focus:ring-1 focus:ring-[#44C7D4] transition-all"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm text-zinc-400">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2.5 bg-[#222222] border border-zinc-700/50 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-[#44C7D4] focus:ring-1 focus:ring-[#44C7D4] transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 bg-[#44C7D4] hover:opacity-90 text-zinc-950 text-sm font-semibold py-2.5 px-4 rounded-lg transition-opacity duration-200"
          >
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-400">
          New here? <Link to="/register" className="text-[#44C7D4] hover:underline underline-offset-4">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;