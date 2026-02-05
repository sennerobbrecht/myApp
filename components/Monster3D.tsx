import {
  ContactShadows,
  Environment,
  OrbitControls,
  useGLTF,
} from "@react-three/drei/native";
import { Canvas } from "@react-three/fiber/native";
import { Asset } from "expo-asset";
import { Suspense, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import TaskoModel from "../assets/3d-models/Tasko.glb";

// ... (keep the existing console warning silence code) ...
const originalWarn = console.warn;
const originalLog = console.log;

const silencedLogs = [
  "EXT_color_buffer_float",
  "gl.pixelStorei",
  "EXGL: gl.pixelStorei()",
];

console.warn = (...args) => {
  if (
    typeof args[0] === "string" &&
    silencedLogs.some((log) => args[0].includes(log))
  ) {
    return;
  }
  originalWarn(...args);
};

console.log = (...args) => {
  if (
    typeof args[0] === "string" &&
    silencedLogs.some((log) => args[0].includes(log))
  ) {
    return;
  }
  originalLog(...args);
};

// 1. The Model Component (Inside Canvas)
function Model({ uri }: { uri: string }) {
  // useGLTF will auto-suspend while loading
  const { scene } = useGLTF(uri);

  useEffect(() => {
    if (scene) {
      console.log("🦾 SCENE LOADED. Traversing...");
      scene.traverse((child: any) => {
        if (child.isMesh) {
          console.log(`📦 Found Mesh: ${child.name}`);
          console.log(`   🎨 Material: ${child.material?.name}`);
          console.log(
            `   🖼️ Map (Texture):`,
            child.material?.map ? "✅ YES" : "❌ NO",
          );

          // 🛠️ FIX: Use Emissive channel to mimic "Unlit" / "Baked" appearance
          // This makes the texture glow with its own color, ignoring shadows/lights.
          if (child.material) {
            child.material.roughness = 1.0;
            child.material.metalness = 0.0;

            // If we have a texture map, use it as the emissive map too
            // This makes it self-illuminated (shadeless)
            if (child.material.map) {
              child.material.emissiveMap = child.material.map;
              child.material.emissive.set("white");
              child.material.emissiveIntensity = 1;
            }

            child.material.needsUpdate = true;
          }
        }
      });
    }
  }, [scene]);

  return <primitive object={scene} scale={3.5} position={[0, -1.5, 0]} />;
}

export default function Monster3D() {
  const [modelUri, setModelUri] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 2. Resolve the local asset to a URI
    const loadResource = async () => {
      try {
        const asset = Asset.fromModule(TaskoModel);
        await asset.downloadAsync();
        setModelUri(asset.localUri || asset.uri);
      } catch (err) {
        setError(String(err));
      }
    };
    loadResource();
  }, []);

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>Error: {error}</Text>
      </View>
    );
  }

  if (!modelUri) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000000" />
        <Text style={{ marginTop: 10 }}>Loading Asset...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Canvas>
        <ambientLight intensity={1.5} />

        <hemisphereLight intensity={1} groundColor="#444" />

        <directionalLight position={[5, 5, 5]} intensity={2} />

        <directionalLight position={[-5, 5, 5]} intensity={1} />

        <ContactShadows
          opacity={0.6}
          scale={10}
          blur={2.5}
          far={4}
          color="#000000"
        />

        {/* Wrap BOTH Environment and Model in Suspense */}
        <Suspense fallback={null}>
          <Environment preset="city" />
          <Model uri={modelUri} />
        </Suspense>

        <OrbitControls
          enablePan={false}
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
          rotateSpeed={2.5}
        />
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
