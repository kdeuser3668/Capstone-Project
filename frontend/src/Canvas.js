import React from 'react';

const CanvasPage = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Canvas</h1>
      <p>Welcome to the Canvas page!</p>
    </div>
  );
};



export default function AccessTokenInstructions() {
  const [token, setToken] = React.useState("");
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 rounded-2xl shadow bg-gray-50">
      <h2 className="text-2xl font-semibold mb-4">How to Generate Your Access Token</h2>
      <ol className="list-decimal list-inside space-y-2 text-base mb-6">
        <li>Log in to your account.</li>
        <li>Go to <strong>Settings</strong> → <strong>Developer Settings</strong>.</li>
        <li>Click <strong>Generate New Access Token</strong>.</li>
        <li>Select the required permissions (e.g. read or write).</li>
        <li>Click <strong>Create Token</strong> to finalize.</li>
        <li>Copy and securely save your token—you may only see it once.</li>
        <li>Paste your token into the field below to continue.</li>
      </ol>

      <div className="flex gap-3 items-center">
        <input
          type="text"
          placeholder="Enter your access token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="flex-1 p-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleCopy}
          className="px-4 py-2 rounded-xl shadow bg-blue-600 text-white hover:bg-blue-700"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}

