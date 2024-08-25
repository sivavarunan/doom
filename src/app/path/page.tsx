'use client';
import React, { useState } from 'react';

export default function Page() {
  const [data, setData] = useState<any>(null);
  const [method, setMethod] = useState<string>('GET');
  const [requestBody, setRequestBody] = useState<string>('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    let response;

    if (method === 'GET') {
      response = await fetch('http://localhost:3000/path/api');
    } else {
      response = await fetch('http://localhost:3000/path/api', {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: requestBody ? JSON.stringify(JSON.parse(requestBody)) : null,
      });
    }

    const result = await response.json();
    setData(result);
  };

  return (
    <div className="container mx-auto p-6 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">API Test</h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-neutral-900 p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="method" className="block text-lg font-medium text-gray-100">Method:</label>
          <select
            id="method"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="mt-1 block w-full text-white bg-black border border-gray-700 rounded-md shadow-sm focus:ring-teal-500 focus:border-green-500 sm:text-sm"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="requestBody" className="block text-lg font-medium text-gray-100">Request Body (for POST/PUT):</label>
          <textarea
            id="requestBody"
            rows={4}
            value={requestBody}
            onChange={(e) => setRequestBody(e.target.value)}
            className="mt-1 block w-full bg-black border border-gray-700 text-white rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-teal-700 text-white font-semibold py-2 px-4 rounded-md shadow-sm hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Submit
        </button>
      </form>
      {data && (
        <div className="mt-6 max-w-md mx-auto bg-neutral-900 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2 text-neutral-100">Response:</h2>
          <pre className="bg-black p-4 rounded-md text-white">{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
