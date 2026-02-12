import {
  OrbitControls,
  useAnimations,
  useGLTF,
} from "@react-three/drei/native";
import { Canvas } from "@react-three/fiber/native";
import { Asset } from "expo-asset";
import { useEffect, useState } from "react";
import { LinearFilter, Texture } from "three";

// Ensure we treat this as a module import
const TEXTURE_ASSET = require("../assets/3d-models/Final_bake.png");
const MODEL_ASSET = require("../assets/3d-models/Tasko.glb");

function MonsterModel({ uri }: { uri: string }) {
  // Extract animations from the GLTF
  const { scene, animations } = useGLTF(uri);
  // Get the animation actions
  const { actions } = useAnimations(animations, scene);

  const [texture, setTexture] = useState<Texture | null>(null);

  // Play animations
  useEffect(() => {
    if (actions && animations.length > 0) {
      // Play the first animation found (usually 'Idle' or 'Walk')
      const firstAction = actions[animations[0].name];
      if (firstAction) {
        firstAction.reset().fadeIn(0.5).play();
      }
      return () => {
        firstAction?.fadeOut(0.5);
      };
    }
  }, [actions, animations]);

  // Load texture manually (bypassing expo-three and useTexture)
  useEffect(() => {
    async function loadTexture() {
      try {
        // 1. Resolve and download the asset
        const asset = Asset.fromModule(TEXTURE_ASSET);
        await asset.downloadAsync();

        // 2. Create a Three.js Texture manually
        const tex = new Texture();

        // 3. Configure it for expo-gl (mimicking expo-three logic)
        // expo-gl expects the 'image' to handle the asset data
        tex.image = {
          data: asset,
          width: asset.width || 1024,
          height: asset.height || 1024,
        } as any;

        // This flag tells expo-gl to use the raw asset data
        (tex as any).isDataTexture = true;

        tex.flipY = false;
        tex.colorSpace = "srgb"; // Modern three.js color space
        tex.minFilter = LinearFilter;
        tex.needsUpdate = true;

        setTexture(tex);
      } catch (error) {
        console.error("Error loading texture manually:", error);
      }
    }
    loadTexture();
  }, []);

  useEffect(() => {
    // Only apply texture once both scene and texture are ready
    if (scene && texture) {
      console.log("🦾 SCENE LOADED. Applying Manual Texture...");
      scene.traverse((child: any) => {
        if (child.isMesh && child.material) {
          child.material.map = texture;
          child.material.needsUpdate = true;
          // Some models might use emissiveMap, uncomment if needed
          // child.material.emissiveMap = texture;
        }
      });
    }
  }, [scene, texture]);

  return <primitive object={scene} scale={3.5} position={[0, -1.5, 0]} />;
}

export default function Monster3D() {
  // Resolve the model asset to a URI
  const uri = Asset.fromModule(MODEL_ASSET).uri;

  return (
    <Canvas style={{ flex: 1 }}>
      <ambientLight intensity={1} />
      <directionalLight position={[5, 10, 5]} intensity={2} />
      <MonsterModel uri={uri} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 2}
        maxPolarAngle={Math.PI / 2}
        rotateSpeed={3} // Adjusts the rotation speed (default is 1.0)
      />
    </Canvas>
  );
}
