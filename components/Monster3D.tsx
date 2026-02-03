import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

export default function Monster3D() {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            background: transparent;
          }
          canvas {
            width: 100%;
            height: 100%;
            touch-action: none;
          }
        </style>
      </head>
      <body>
        <canvas id="renderCanvas"></canvas>

        <script src="https://cdn.babylonjs.com/babylon.js"></script>
        <script src="https://cdn.babylonjs.com/loaders/babylonjs.loaders.min.js"></script>

        <script>
          const canvas = document.getElementById("renderCanvas");
          const engine = new BABYLON.Engine(canvas, true, {
            preserveDrawingBuffer: true,
            stencil: true,
          });

          const createScene = () => {
            const scene = new BABYLON.Scene(engine);
            scene.clearColor = new BABYLON.Color4(0, 0, 0, 0); // transparant

            const camera = new BABYLON.ArcRotateCamera(
              "camera",
              Math.PI / 2,
              Math.PI / 2.3,
              3,
              BABYLON.Vector3.Zero(),
              scene
            );
            camera.attachControl(canvas, true);
            camera.lowerRadiusLimit = 2;
            camera.upperRadiusLimit = 4;

            const light = new BABYLON.HemisphericLight(
              "light",
              new BABYLON.Vector3(0, 1, 0),
              scene
            );
            light.intensity = 1.2;

            BABYLON.SceneLoader.ImportMesh(
              "",
              "https://models.babylonjs.com/",
              "BoomBox.glb",
              scene
            );

            return scene;
          };

          const scene = createScene();
          engine.runRenderLoop(() => scene.render());
          window.addEventListener("resize", () => engine.resize());
        </script>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        style={styles.webview}
        originWhitelist={["*"]}
        source={{ html }}
        javaScriptEnabled
        domStorageEnabled
        allowsInlineMediaPlayback
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,                     // 🔥 FULL SCREEN
    backgroundColor: "transparent",
  },
  webview: {
    flex: 1,                     // 🔥 WebView krijgt echte hoogte
    backgroundColor: "transparent",
  },
});
