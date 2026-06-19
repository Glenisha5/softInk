import { useState } from "react";

const API_URL = (import.meta as any).env?.VITE_API_URL || "http://localhost:5000";

const LANGUAGES = ["english", "hindi", "kannada", "tamil", "telugu"];


export default function AdminPanel() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [poem, setPoem] = useState({
    title: "",
    content: "",
    author: "",
    language: "",
  });
  const [message, setMessage] = useState("");

  const handleLogin = () => {
    if (password === (import.meta as any).env?.VITE_ADMIN_PASSWORD) {
      setAuthenticated(true);
    } else {
      setMessage("Wrong password!");
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${API_URL}/api/poems`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...poem, password }),
      });
      if (response.ok) {
        setMessage("✅ Poem added successfully!");
        setPoem({ title: "", content: "", author: "", language: "" });
      } else {
        setMessage("❌ Failed to add poem.");
      }
    } catch (error) {
      setMessage("❌ Server error.");
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="bg-gray-800 p-8 rounded-lg w-80">
          <h2 className="text-white text-2xl mb-4 text-center">Admin Login</h2>
          <input
            type="password"
            placeholder="Enter password"
            className="w-full p-2 rounded mb-4 bg-gray-700 text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={handleLogin}
            className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700"
          >
            Login
          </button>
          {message && <p className="text-red-400 mt-2 text-center">{message}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto bg-gray-800 p-8 rounded-lg">
        <h2 className="text-white text-2xl mb-6">Add New Poem</h2>

        <input
          type="text"
          placeholder="Title"
          className="w-full p-2 rounded mb-4 bg-gray-700 text-white"
          value={poem.title}
          onChange={(e) => setPoem({ ...poem, title: e.target.value })}
        />

        <input
          type="text"
          placeholder="Author"
          className="w-full p-2 rounded mb-4 bg-gray-700 text-white"
          value={poem.author}
          onChange={(e) => setPoem({ ...poem, author: e.target.value })}
        />

        <select
          className="w-full p-2 rounded mb-4 bg-gray-700 text-white"
          value={poem.language}
          onChange={(e) => setPoem({ ...poem, language: e.target.value })}
        >
          <option value="">Select Language</option>
          {LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>


        <textarea
          placeholder="Poem content..."
          className="w-full p-2 rounded mb-4 bg-gray-700 text-white h-40"
          value={poem.content}
          onChange={(e) => setPoem({ ...poem, content: e.target.value })}
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700"
        >
          Add Poem
        </button>

        {message && (
          <p className="mt-4 text-center text-green-400">{message}</p>
        )}
      </div>
    </div>
  );
}