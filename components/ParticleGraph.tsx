"use client";
// types.ts
interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  speed: number;
  radius: number;
  direction: 1 | -1;
  lastBounceTime: number; // To prevent multiple bounces
}

interface Edge {
  from: number;
  to: number;
}

// Union-Find data structure for checking connectivity
class UnionFind {
  private parent: number[];
  private rank: number[];

  constructor(size: number) {
    this.parent = Array.from({ length: size }, (_, i) => i);
    this.rank = Array(size).fill(0);
  }

  find(x: number): number {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]); // Path compression
    }
    return this.parent[x];
  }

  union(x: number, y: number): boolean {
    const rootX = this.find(x);
    const rootY = this.find(y);

    if (rootX === rootY) return false;

    // Union by rank
    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
    } else {
      this.parent[rootY] = rootX;
      this.rank[rootX]++;
    }

    return true;
  }
}

// ParticleGraph.tsx
import React, { useEffect, useRef, useState } from "react";

const ParticleGraph: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePosition = useRef<{ x: number; y: number }>({
    x: -1000,
    y: -1000,
  });

  // Configuration constants
  const REPULSION_RADIUS = 100;
  const REPULSION_STRENGTH = 0.5;
  const NUMBER_OF_NODES = 60;
  const BASE_SPEED = 0.2;
  const MOUSE_INFLUENCE_DECAY = 0.95;
  const WALL_BOUNCE_DAMPENING = 0.8;
  const EDGE_LENGTH = 200;
  const EDGE_FORCE = 0.02;
  const EXTRA_EDGES = 10; // Number of additional edges beyond the minimum spanning tree
  const CIRCULAR_MOTION_STRENGTH = 0.01;
  const WALL_REPULSION_FORCE = 2; // Force to push away from walls
  const WALL_REPULSION_DISTANCE = 60; // Distance at which wall repulsion starts

  // Initialize nodes and edges
  useEffect(() => {
    const width = containerRef.current
      ? containerRef.current.offsetWidth
      : 1000;
    const height = containerRef.current
      ? containerRef.current.offsetHeight
      : 800;

    // Create nodes
    const newNodes: Node[] = Array.from({ length: NUMBER_OF_NODES }, () => ({
      x: width * 0.25 + Math.random() * width * 0.5,
      y: height * 0.25 + Math.random() * height * 0.5,
      vx: 0,
      vy: 0,
      angle: Math.random() * Math.PI * 2,
      speed: BASE_SPEED * (0.8 + Math.random() * 0.4),
      radius: Math.random() * 1 + 0.5,
      direction: Math.random() < 0.5 ? 1 : -1,
      lastBounceTime: 0,
    }));

    // Calculate all possible edges and their weights (distances)
    const allPossibleEdges: { from: number; to: number; weight: number }[] = [];
    for (let i = 0; i < NUMBER_OF_NODES; i++) {
      for (let j = i + 1; j < NUMBER_OF_NODES; j++) {
        const distance = Math.sqrt(
          Math.pow(newNodes[i].x - newNodes[j].x, 2) +
            Math.pow(newNodes[i].y - newNodes[j].y, 2)
        );
        allPossibleEdges.push({ from: i, to: j, weight: distance });
      }
    }

    // Sort edges by weight
    allPossibleEdges.sort((a, b) => a.weight - b.weight);

    // Create minimum spanning tree using Kruskal's algorithm
    const unionFind = new UnionFind(NUMBER_OF_NODES);
    const newEdges: Edge[] = [];
    let remainingEdges = [...allPossibleEdges];

    // First, create the minimum spanning tree
    for (const edge of allPossibleEdges) {
      if (newEdges.length === NUMBER_OF_NODES - 1) break;

      if (unionFind.union(edge.from, edge.to)) {
        newEdges.push({ from: edge.from, to: edge.to });
        remainingEdges = remainingEdges.filter(
          (e) => !(e.from === edge.from && e.to === edge.to)
        );
      }
    }

    // Add a few extra edges for visual interest while maintaining reasonable spacing
    let extraEdgesAdded = 0;
    for (const edge of remainingEdges) {
      if (extraEdgesAdded >= EXTRA_EDGES) break;

      // Check if this edge would create a good visual connection
      const distance = Math.sqrt(
        Math.pow(newNodes[edge.from].x - newNodes[edge.to].x, 2) +
          Math.pow(newNodes[edge.from].y - newNodes[edge.to].y, 2)
      );

      // Only add edges that aren't too long
      if (distance < EDGE_LENGTH * 1.5) {
        newEdges.push({ from: edge.from, to: edge.to });
        extraEdgesAdded++;
      }
    }

    setNodes(newNodes);
    setEdges(newEdges);
  }, []);

  // Rest of the component remains the same as previous version
  // ... (mouse handling, animation loop, and render code)

  // Handle mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent): void => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      mousePosition.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = (): void => {
      mousePosition.current = { x: -1000, y: -1000 };
    };

    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Animation loop
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (currentTime: number): void => {
      const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      setNodes((prevNodes): Node[] => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const padding = 50;

        return prevNodes.map((node, nodeIndex): Node => {
          let vx = node.vx;
          let vy = node.vy;
          let newDirection = node.direction;

          // Update angle based on current direction
          const newAngle = node.angle + node.speed * deltaTime * newDirection;

          // Add gentle circular motion
          vx += Math.cos(newAngle) * node.radius * CIRCULAR_MOTION_STRENGTH;
          vy += Math.sin(newAngle) * node.radius * CIRCULAR_MOTION_STRENGTH;

          // Mouse repulsion
          const dx = node.x - mousePosition.current.x;
          const dy = node.y - mousePosition.current.y;
          const distanceToMouse = Math.sqrt(dx * dx + dy * dy);

          if (distanceToMouse < REPULSION_RADIUS) {
            const force =
              (REPULSION_RADIUS - distanceToMouse) / REPULSION_RADIUS;
            vx += (dx / distanceToMouse) * force * REPULSION_STRENGTH;
            vy += (dy / distanceToMouse) * force * REPULSION_STRENGTH;
          }

          // Edge forces
          edges.forEach((edge) => {
            if (edge.from === nodeIndex || edge.to === nodeIndex) {
              const otherNodeIndex =
                edge.from === nodeIndex ? edge.to : edge.from;
              const otherNode = prevNodes[otherNodeIndex];
              const edgeDx = otherNode.x - node.x;
              const edgeDy = otherNode.y - node.y;
              const distance = Math.sqrt(edgeDx * edgeDx + edgeDy * edgeDy);

              if (distance > EDGE_LENGTH) {
                vx += (edgeDx / distance) * EDGE_FORCE;
                vy += (edgeDy / distance) * EDGE_FORCE;
              } else if (distance < EDGE_LENGTH * 0.5) {
                vx -= (edgeDx / distance) * EDGE_FORCE;
                vy -= (edgeDy / distance) * EDGE_FORCE;
              }
            }
          });

          // Wall repulsion forces
          const distanceToLeftWall = node.x - padding;
          const distanceToRightWall = width - padding - node.x;
          const distanceToTopWall = node.y - padding;
          const distanceToBottomWall = height - padding - node.y;

          // Apply wall repulsion
          if (distanceToLeftWall < WALL_REPULSION_DISTANCE) {
            const force =
              (1 - distanceToLeftWall / WALL_REPULSION_DISTANCE) *
              WALL_REPULSION_FORCE;
            vx += force;
          }
          if (distanceToRightWall < WALL_REPULSION_DISTANCE) {
            const force =
              (1 - distanceToRightWall / WALL_REPULSION_DISTANCE) *
              WALL_REPULSION_FORCE;
            vx -= force;
          }
          if (distanceToTopWall < WALL_REPULSION_DISTANCE) {
            const force =
              (1 - distanceToTopWall / WALL_REPULSION_DISTANCE) *
              WALL_REPULSION_FORCE;
            vy += force;
          }
          if (distanceToBottomWall < WALL_REPULSION_DISTANCE) {
            const force =
              (1 - distanceToBottomWall / WALL_REPULSION_DISTANCE) *
              WALL_REPULSION_FORCE;
            vy -= force;
          }

          // Apply mouse influence decay
          vx *= MOUSE_INFLUENCE_DECAY;
          vy *= MOUSE_INFLUENCE_DECAY;

          // Calculate new position
          let newX = node.x + vx;
          let newY = node.y + vy;

          // Handle wall collisions with immediate direction change
          if (newX < padding) {
            newX = padding;
            vx = Math.abs(vx) * WALL_BOUNCE_DAMPENING;
            // Immediately switch direction based on current vertical movement
            newDirection = (vy >= 0 ? 1 : -1) as 1 | -1;
          } else if (newX > width - padding) {
            newX = width - padding;
            vx = -Math.abs(vx) * WALL_BOUNCE_DAMPENING;
            // Immediately switch direction based on current vertical movement
            newDirection = (vy >= 0 ? 1 : -1) as 1 | -1;
          }

          if (newY < padding) {
            newY = padding;
            vy = Math.abs(vy) * WALL_BOUNCE_DAMPENING;
            // Immediately switch direction based on current horizontal movement
            newDirection = (vx >= 0 ? -1 : 1) as 1 | -1;
          } else if (newY > height - padding) {
            newY = height - padding;
            vy = -Math.abs(vy) * WALL_BOUNCE_DAMPENING;
            // Immediately switch direction based on current horizontal movement
            newDirection = (vx >= 0 ? -1 : 1) as 1 | -1;
          }

          return {
            x: newX,
            y: newY,
            vx,
            vy,
            angle: newAngle,
            speed: node.speed,
            radius: node.radius,
            direction: newDirection,
            lastBounceTime: node.lastBounceTime,
          };
        });
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [edges]);

  return (
    <div ref={containerRef} className="w-full h-full overflow-hidden">
      <svg className="w-full h-full">
        {edges.map((edge, index) => {
          const fromNode = nodes[edge.from];
          const toNode = nodes[edge.to];

          if (!fromNode || !toNode) return null;

          return (
            <line
              key={`edge-${index}`}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke="var(--foreground)"
              strokeWidth="1"
              strokeOpacity="0.5"
            />
          );
        })}

        {nodes.map((node, index) => (
          <circle
            key={`node-${index}`}
            cx={node.x}
            cy={node.y}
            r="9"
            fill="var(--foreground)"
            fillOpacity="0.8"
          />
        ))}
      </svg>
    </div>
  );
};

export default ParticleGraph;
