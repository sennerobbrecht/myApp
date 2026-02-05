import { OrbitControls, useGLTF } from "@react-three/drei/native";
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
  return <primitive object={scene} scale={2} position={[0, -1, 0]} />;
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
        {/* Neutral white light so colors render true */}
        <ambientLight intensity={1} />
        {/* Main light from the top-right */}
        <directionalLight position={[5, 5, 5]} intensity={2} />
        {/* Soft fill light from the other side */}
        <directionalLight position={[-5, 5, 5]} intensity={1} />

        <Suspense fallback={null}>
          <Model uri={modelUri} />
        </Suspense>

        <OrbitControls
          enablePan={false}
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
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
