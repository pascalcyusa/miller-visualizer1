import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Cuboid as Cube } from 'lucide-react';
import { UnitCell } from './components/UnitCell';

function App() {
  const [indices, setIndices] = useState('(1 1 1)');
  const [error, setError] = useState('');

  const parseIndices = (input: string): { indices: [number, number, number]; isDirection: boolean } | null => {
    const match = input.match(/^([(\[])(-?\d+)\s+(-?\d+)\s+(-?\d+)([)\]])$/);
    if (!match) {
      return null;
    }

    const isDirection = match[1] === '[';
    const numbers = [parseInt(match[2]), parseInt(match[3]), parseInt(match[4])] as [number, number, number];
    
    if (numbers.some(isNaN)) {
      return null;
    }

    return { indices: numbers, isDirection };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = parseIndices(indices);
    
    if (!result) {
      setError('Invalid format. Use (h k l) for planes or [u v w] for directions.');
      return;
    }
    
    setError('');
  };

  const parsedIndices = parseIndices(indices);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Cube className="w-8 h-8" />
          <h1 className="text-3xl font-bold">Miller Indices Visualizer</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <form onSubmit={handleSubmit} className="mb-6">
              <div className="mb-4">
                <label htmlFor="indices" className="block text-sm font-medium mb-2">
                  Enter Miller Indices
                </label>
                <input
                  id="indices"
                  type="text"
                  value={indices}
                  onChange={(e) => setIndices(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500 text-white"
                  placeholder="(h k l) or [u v w]"
                />
                <p className="mt-2 text-sm text-gray-400">
                  Format: (h k l) for planes or [u v w] for directions
                </p>
              </div>
              {error && (
                <p className="text-red-500 text-sm mb-4">{error}</p>
              )}
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Visualize
              </button>
            </form>

            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Instructions</h2>
              <ul className="space-y-2 text-gray-300">
                <li>• Use parentheses (h k l) to visualize crystal planes</li>
                <li>• Use brackets [u v w] to visualize crystal directions</li>
                <li>• Use space-separated integers for h, k, l values</li>
                <li>• Example plane: (1 1 1)</li>
                <li>• Example direction: [1 1 0]</li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg overflow-hidden" style={{ height: '600px' }}>
            <Canvas camera={{ position: [3, 3, 3] }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} />
              {parsedIndices && (
                <UnitCell
                  millerIndices={parsedIndices.indices}
                  isDirection={parsedIndices.isDirection}
                />
              )}
              <OrbitControls />
            </Canvas>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;