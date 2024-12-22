import React, { useState } from 'react';

interface Endpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  response: string;
}

interface ApiSpec {
  name: string;
  endpoints: Endpoint[];
}

const ApiGenerator: React.FC = () => {
  const [apiSpec, setApiSpec] = useState<ApiSpec>({
    name: '',
    endpoints: [],
  });

  const addEndpoint = () => {
    setApiSpec({
      ...apiSpec,
      endpoints: [...apiSpec.endpoints, { path: '', method: 'GET', response: '' }],
    });
  };

  const updateEndpoint = (index: number, field: keyof Endpoint, value: string) => {
    const newEndpoints = [...apiSpec.endpoints];
    newEndpoints[index] = { ...newEndpoints[index], [field]: value };
    setApiSpec({ ...apiSpec, endpoints: newEndpoints });
  };

  const generateApi = () => {
    // Here you would implement the logic to generate the API based on the spec
    console.log('Generating API:', apiSpec);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">API Generator</h2>
      <input
        type="text"
        value={apiSpec.name}
        onChange={(e) => setApiSpec({ ...apiSpec, name: e.target.value })}
        placeholder="API Name"
        className="w-full p-2 mb-4 border rounded"
      />
      {apiSpec.endpoints.map((endpoint, index) => (
        <div key={index} className="mb-4 p-4 border rounded">
          <input
            type="text"
            value={endpoint.path}
            onChange={(e) => updateEndpoint(index, 'path', e.target.value)}
            placeholder="Endpoint Path"
            className="w-full p-2 mb-2 border rounded"
          />
          <select
            value={endpoint.method}
            onChange={(e) => updateEndpoint(index, 'method', e.target.value as Endpoint['method'])}
            className="w-full p-2 mb-2 border rounded"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
          <textarea
            value={endpoint.response}
            onChange={(e) => updateEndpoint(index, 'response', e.target.value)}
            placeholder="Response Template"
            className="w-full p-2 mb-2 border rounded"
            rows={4}
          />
        </div>
      ))}
      <button onClick={addEndpoint} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
        Add Endpoint
      </button>
      <button onClick={generateApi} className="bg-green-500 text-white px-4 py-2 rounded">
        Generate API
      </button>
    </div>
  );
}

export default ApiGenerator;

