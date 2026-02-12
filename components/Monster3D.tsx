import { useGLTF } from "@react-three/drei/native";
import { useLoader } from "@react-three/fiber/native";
import { useEffect } from "react";
import { Texture, TextureLoader } from "three";
import TaskoTexture from "../assets/3d-models/Final_bake.png";

// ... (console silencing code)

function Model({ uri }: { uri: string }) {
  const { scene } = useGLTF(uri);

  // 2. Cast the result as Texture so TypeScript knows it's not an array
  const texture = useLoader(TextureLoader, TaskoTexture) as Texture;

  // Configure texture
  if (texture) {
    texture.flipY = false;
    texture.colorSpace = "srgb";
  }

  useEffect(() => {
    if (scene && texture) {
      console.log("🦾 SCENE LOADED. Applying Manual Texture...");
      scene.traverse((child: any) => {
        if (child.isMesh && child.material) {
          child.material.map = texture;
          child.material.emissiveMap = texture;
          // ... (rest of the material settings)
          child.material.needsUpdate = true;
        }
      });
    }
  }, [scene, texture]);

  return <primitive object={scene} scale={3.5} position={[0, -1.5, 0]} />;
}
