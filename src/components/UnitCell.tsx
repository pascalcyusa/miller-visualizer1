import { useRef } from 'react';
import { Line, Text } from '@react-three/drei';
import * as THREE from 'three';
import type { Group } from 'three';

interface UnitCellProps {
  millerIndices: [number, number, number];
  isDirection: boolean;
}

export function UnitCell({ millerIndices, isDirection }: UnitCellProps) {
  const meshRef = useRef<Group>(null);

  // Create unit cell edges
  const edges = [
    // Bottom face
    [[-1, -1, -1], [1, -1, -1]],
    [[1, -1, -1], [1, -1, 1]],
    [[1, -1, 1], [-1, -1, 1]],
    [[-1, -1, 1], [-1, -1, -1]],
    // Top face
    [[-1, 1, -1], [1, 1, -1]],
    [[1, 1, -1], [1, 1, 1]],
    [[1, 1, 1], [-1, 1, 1]],
    [[-1, 1, 1], [-1, 1, -1]],
    // Vertical edges
    [[-1, -1, -1], [-1, 1, -1]],
    [[1, -1, -1], [1, 1, -1]],
    [[1, -1, 1], [1, 1, 1]],
    [[-1, -1, 1], [-1, 1, 1]]
  ];

  // Calculate points for Miller plane or direction
  const [h, k, l] = millerIndices;
  let points: THREE.Vector3[] = [];

  if (isDirection) {
    // For directions, create a vector from origin
    points = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(h, k, l).normalize().multiplyScalar(2)
    ];
  } else {
    // For planes, calculate intersection points
    if (h !== 0 || k !== 0 || l !== 0) {
      const plane = new THREE.Plane(
        new THREE.Vector3(h, k, l).normalize()
      );

      // Generate points on the plane within the unit cell
      const size = 2;
      const segments = 20;
      for (let i = 0; i <= segments; i++) {
        for (let j = 0; j <= segments; j++) {
          const x = (i / segments - 0.5) * size;
          const y = (j / segments - 0.5) * size;
          const point = new THREE.Vector3(x, y, 0);
          plane.projectPoint(point, point);
          if (Math.abs(point.x) <= 1 && Math.abs(point.y) <= 1 && Math.abs(point.z) <= 1) {
            points.push(point.clone());
          }
        }
      }
    }
  }

  return (
    <group ref={meshRef}>
      {/* Unit cell edges */}
      {edges.map((edge, i) => (
        <Line
          key={i}
          points={edge.map(([x, y, z]) => new THREE.Vector3(x, y, z))}
          color="white"
          lineWidth={1}
        />
      ))}

      {/* Miller indices visualization */}
      {isDirection ? (
        <Line
          points={points}
          color="red"
          lineWidth={3}
        />
      ) : (
        points.map((point, i) => (
          <mesh key={i} position={point}>
            <sphereGeometry args={[0.02]} />
            <meshBasicMaterial color="red" />
          </mesh>
        ))
      )}

      {/* Axes labels */}
      <Text position={[1.2, 0, 0]} fontSize={0.1} color="white">
        X
      </Text>
      <Text position={[0, 1.2, 0]} fontSize={0.1} color="white">
        Y
      </Text>
      <Text position={[0, 0, 1.2]} fontSize={0.1} color="white">
        Z
      </Text>

      {/* Coordinate points */}
      <mesh position={[1, 0, 0]}>
        <sphereGeometry args={[0.05]} />
        <meshBasicMaterial color="blue" />
      </mesh>
      <mesh position={[0, 1, 0]}>
        <sphereGeometry args={[0.05]} />
        <meshBasicMaterial color="blue" />
      </mesh>
      <mesh position={[0, 0, 1]}>
        <sphereGeometry args={[0.05]} />
        <meshBasicMaterial color="blue" />
      </mesh>
    </group>
  );
}