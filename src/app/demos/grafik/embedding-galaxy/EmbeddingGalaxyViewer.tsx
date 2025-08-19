"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Points, PointsMaterial, BufferGeometry, BufferAttribute, Vector3, Color } from "three";
import { OrbitControls } from "@react-three/drei";
import WebGPUViewer from "../../../../components/graphics/WebGPUViewer";
import * as THREE from "three";

// AI Concept Categories with semantic positioning
const AI_CONCEPTS = {
  "Neural Networks": {
    center: new Vector3(0, 0, 0),
    color: new Color(0x4F46E5), // Indigo
    concepts: [
      "Deep Learning", "CNN", "RNN", "LSTM", "GRU", "Transformer", "Attention",
      "Backpropagation", "Gradient Descent", "Dropout", "Batch Normalization",
      "Activation Functions", "Loss Functions", "Optimizer", "Training Loop",
      "Neural Architecture", "Layer Design", "Network Topology", "Forward Pass"
    ]
  },
  "Computer Vision": {
    center: new Vector3(-8, 3, -5),
    color: new Color(0xEC4899), // Pink
    concepts: [
      "Image Classification", "Object Detection", "Semantic Segmentation", "YOLO",
      "ResNet", "VGG", "AlexNet", "Image Processing", "Feature Extraction",
      "Edge Detection", "Convolution", "Pooling", "Filter", "Kernel",
      "OpenCV", "PIL", "Image Augmentation", "Transfer Learning", "GANs"
    ]
  },
  "Natural Language": {
    center: new Vector3(8, -2, 4),
    color: new Color(0x10B981), // Emerald
    concepts: [
      "NLP", "Language Model", "GPT", "BERT", "T5", "Tokenization",
      "Word Embeddings", "Word2Vec", "GloVe", "Sentiment Analysis",
      "Named Entity Recognition", "POS Tagging", "Machine Translation",
      "Question Answering", "Text Generation", "Chatbot", "LLM", "Prompt Engineering"
    ]
  },
  "Reinforcement Learning": {
    center: new Vector3(-4, -6, 8),
    color: new Color(0xF59E0B), // Amber
    concepts: [
      "Q-Learning", "Policy Gradient", "Actor-Critic", "DQN", "PPO",
      "Environment", "Agent", "Reward", "State", "Action", "Markov Decision",
      "Exploration", "Exploitation", "Epsilon-Greedy", "Monte Carlo",
      "Temporal Difference", "Value Function", "Policy", "OpenAI Gym"
    ]
  },
  "Machine Learning": {
    center: new Vector3(5, 4, -6),
    color: new Color(0x8B5CF6), // Violet
    concepts: [
      "Supervised Learning", "Unsupervised Learning", "Classification", "Regression",
      "Clustering", "K-Means", "SVM", "Random Forest", "Decision Tree",
      "Linear Regression", "Logistic Regression", "Cross Validation",
      "Feature Selection", "Dimensionality Reduction", "PCA", "t-SNE", "UMAP"
    ]
  },
  "Data Science": {
    center: new Vector3(-6, 8, 2),
    color: new Color(0x06B6D4), // Cyan
    concepts: [
      "Pandas", "NumPy", "Matplotlib", "Seaborn", "Jupyter", "Data Cleaning",
      "Data Visualization", "Statistical Analysis", "Hypothesis Testing",
      "A/B Testing", "Time Series", "Data Mining", "Big Data", "ETL",
      "Data Pipeline", "Feature Engineering", "Data Quality", "Analytics"
    ]
  },
  "AI Ethics": {
    center: new Vector3(2, -8, -4),
    color: new Color(0xEF4444), // Red
    concepts: [
      "Bias", "Fairness", "Explainable AI", "Interpretability", "Privacy",
      "GDPR", "Algorithmic Accountability", "Transparency", "AI Governance",
      "Responsible AI", "Human-in-the-loop", "AI Safety", "Robustness",
      "Adversarial Examples", "Model Auditing", "AI Impact Assessment"
    ]
  }
};

// Interactive Search and Navigation Component
function SearchInterface({ onSearch, onNavigate }: { 
  onSearch: (term: string) => void;
  onNavigate: (category: string) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    onSearch(term);
  };

  return (
    <div className="absolute top-4 left-4 z-20 bg-black/70 backdrop-blur-sm rounded-xl p-4 text-white min-w-[300px]">
      <div className="mb-3">
        <input
          type="text"
          placeholder="Search AI concepts..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:border-white/40"
        />
      </div>
      
      <div className="text-xs text-gray-300 mb-2">Quick Navigation:</div>
      <div className="grid grid-cols-2 gap-1 text-xs">
        {Object.keys(AI_CONCEPTS).map((category) => (
          <button
            key={category}
            onClick={() => onNavigate(category)}
            className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded transition-colors text-left"
          >
            {category}
          </button>
        ))}
      </div>
      
      <div className="mt-3 text-xs text-gray-400">
        <div>💡 Click points for details</div>
        <div>🖱️ Drag to orbit, scroll to zoom</div>
      </div>
    </div>
  );
}

// Point Cloud Galaxy Component
function EmbeddingGalaxy() {
  const pointsRef = useRef<Points>(null);
  const materialRef = useRef<PointsMaterial>(null);
  const controlsRef = useRef<any>(null);
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);
  const [searchHighlight, setSearchHighlight] = useState<string>("");
  const pointCount = 50000;
  const { camera, gl } = useThree();

  // Generate galaxy points with semantic clustering
  const { positions, colors, conceptMap } = useMemo(() => {
    const positions = new Float32Array(pointCount * 3);
    const colors = new Float32Array(pointCount * 3);
    const conceptMap: { [key: number]: string } = {};
    
    let pointIndex = 0;
    
    // Generate points for each AI category
    Object.entries(AI_CONCEPTS).forEach(([categoryName, categoryData]) => {
      const conceptsInCategory = categoryData.concepts.length;
      const pointsPerConcept = Math.floor(pointCount / (Object.keys(AI_CONCEPTS).length * conceptsInCategory));
      
      categoryData.concepts.forEach((concept, conceptIndex) => {
        // Create cluster around concept
        for (let i = 0; i < pointsPerConcept && pointIndex < pointCount; i++) {
          // Gaussian distribution around concept center
          const clusterRadius = 1.5;
          const angle1 = Math.random() * Math.PI * 2;
          const angle2 = Math.random() * Math.PI * 2;
          const radius = Math.random() * clusterRadius;
          
          // Concept offset within category
          const conceptOffset = new Vector3(
            Math.cos(conceptIndex * 0.5) * 2,
            Math.sin(conceptIndex * 0.3) * 2,
            Math.cos(conceptIndex * 0.7) * 2
          );
          
          // Point position
          const x = categoryData.center.x + conceptOffset.x + Math.cos(angle1) * Math.sin(angle2) * radius;
          const y = categoryData.center.y + conceptOffset.y + Math.sin(angle1) * Math.sin(angle2) * radius;
          const z = categoryData.center.z + conceptOffset.z + Math.cos(angle2) * radius;
          
          positions[pointIndex * 3] = x;
          positions[pointIndex * 3 + 1] = y;
          positions[pointIndex * 3 + 2] = z;
          
          // Color with slight variation
          const color = categoryData.color.clone();
          const brightness = 0.8 + Math.random() * 0.4;
          color.multiplyScalar(brightness);
          
          colors[pointIndex * 3] = color.r;
          colors[pointIndex * 3 + 1] = color.g;
          colors[pointIndex * 3 + 2] = color.b;
          
          conceptMap[pointIndex] = concept;
          pointIndex++;
        }
      });
    });
    
    // Fill remaining points with noise
    while (pointIndex < pointCount) {
      positions[pointIndex * 3] = (Math.random() - 0.5) * 40;
      positions[pointIndex * 3 + 1] = (Math.random() - 0.5) * 40;
      positions[pointIndex * 3 + 2] = (Math.random() - 0.5) * 40;
      
      colors[pointIndex * 3] = Math.random() * 0.3;
      colors[pointIndex * 3 + 1] = Math.random() * 0.3;
      colors[pointIndex * 3 + 2] = Math.random() * 0.3;
      
      conceptMap[pointIndex] = "Unknown Concept";
      pointIndex++;
    }
    
    return { positions, colors, conceptMap };
  }, [pointCount]);

  // Handle search highlighting
  useEffect(() => {
    if (!pointsRef.current || !searchHighlight) return;
    
    const colorAttribute = pointsRef.current.geometry.attributes.color as BufferAttribute;
    const colorArray = colorAttribute.array as Float32Array;
    
    // Reset all colors
    for (let i = 0; i < pointCount; i++) {
      const originalColor = new Color(colors[i * 3], colors[i * 3 + 1], colors[i * 3 + 2]);
      colorArray[i * 3] = originalColor.r;
      colorArray[i * 3 + 1] = originalColor.g;
      colorArray[i * 3 + 2] = originalColor.b;
    }
    
    // Highlight matching points
    Object.entries(conceptMap).forEach(([index, concept]) => {
      if (concept.toLowerCase().includes(searchHighlight.toLowerCase())) {
        const i = parseInt(index);
        colorArray[i * 3] = 1.0;     // Bright white highlight
        colorArray[i * 3 + 1] = 1.0;
        colorArray[i * 3 + 2] = 0.0; // Yellow tint
      }
    });
    
    colorAttribute.needsUpdate = true;
  }, [searchHighlight, conceptMap, colors, pointCount]);

  // Navigation to categories
  const navigateToCategory = (categoryName: string) => {
    const category = AI_CONCEPTS[categoryName as keyof typeof AI_CONCEPTS];
    if (!category || !controlsRef.current) return;
    
    // Smooth camera transition
    const targetPosition = category.center.clone().multiplyScalar(1.2);
    targetPosition.add(new Vector3(5, 5, 5));
    
    // Simple camera animation (could be enhanced with GSAP)
    const startPosition = camera.position.clone();
    const duration = 2000; // 2 seconds
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
      
      camera.position.lerpVectors(startPosition, targetPosition, easeProgress);
      controlsRef.current.target.lerp(category.center, easeProgress);
      controlsRef.current.update();
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  };

  // Mouse interaction for hover effects
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1
      );
      
      // Simple proximity detection (could be enhanced with raycasting)
      const mouseWorld = new Vector3(mouse.x * 20, mouse.y * 20, 0);
      let closestDistance = Infinity;
      let closestConcept = null;
      
      Object.entries(conceptMap).forEach(([index, concept]) => {
        const i = parseInt(index);
        const pointPos = new Vector3(
          positions[i * 3],
          positions[i * 3 + 1],
          positions[i * 3 + 2]
        );
        
        const distance = mouseWorld.distanceTo(pointPos);
        if (distance < closestDistance && distance < 5) {
          closestDistance = distance;
          closestConcept = concept;
        }
      });
      
      setHoveredPoint(closestConcept);
    };

    gl.domElement.addEventListener('mousemove', handleMouseMove);
    return () => gl.domElement.removeEventListener('mousemove', handleMouseMove);
  }, [gl, positions, conceptMap]);

  // Subtle animation
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * 0.05;
    }
    
    if (materialRef.current) {
      materialRef.current.opacity = 0.7 + 0.1 * Math.sin(time);
    }
  });

  return (
    <>
      {/* Search Interface */}
      <SearchInterface
        onSearch={setSearchHighlight}
        onNavigate={navigateToCategory}
      />

      {/* Hover Tooltip */}
      {hoveredPoint && (
        <div className="absolute top-20 right-4 z-20 bg-black/80 backdrop-blur-sm rounded-lg p-3 text-white max-w-xs">
          <div className="font-semibold text-green-400">{hoveredPoint}</div>
          <div className="text-xs text-gray-300 mt-1">
            AI concept in the knowledge galaxy
          </div>
        </div>
      )}

      {/* Point Cloud */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute 
            attach="attributes-position" 
            array={positions} 
            count={pointCount} 
            itemSize={3} 
          />
          <bufferAttribute 
            attach="attributes-color" 
            array={colors} 
            count={pointCount} 
            itemSize={3} 
          />
        </bufferGeometry>
        <pointsMaterial
          ref={materialRef}
          size={0.05}
          sizeAttenuation={true}
          transparent={true}
          opacity={0.8}
          vertexColors={true}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Category Labels */}
      {Object.entries(AI_CONCEPTS).map(([name, data]) => (
        <mesh key={name} position={data.center} onClick={() => navigateToCategory(name)}>
          <sphereGeometry args={[0.2]} />
          <meshBasicMaterial color={data.color} transparent opacity={0.6} />
        </mesh>
      ))}

      {/* Camera Controls */}
      <OrbitControls
        ref={controlsRef}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={100}
        autoRotate={false}
        autoRotateSpeed={0.5}
      />

      {/* Ambient lighting for sphere markers */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.3} />
    </>
  );
}

// Main viewer component
export default function EmbeddingGalaxyViewer() {
  return (
    <WebGPUViewer
      title="Embedding Galaxy"
      description="Interactive AI knowledge universe with 50,000 semantic concepts"
      gradient="bg-gradient-to-br from-green-500 to-green-700"
      requiresWebGPU={false}
      showPerformanceMonitor={true}
      minFps={30}
      maxMemory={400}
      fallbackVideoUrl="/demos/embedding-galaxy-preview.mp4"
      fallbackImageUrl="/demos/embedding-galaxy-poster.jpg"
    >
      <EmbeddingGalaxy />
    </WebGPUViewer>
  );
}