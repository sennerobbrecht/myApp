
// Extend React's JSX namespace directly for React 19+
declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        ambientLight: any;
        pointLight: any;
        directionalLight: any;
        hemisphereLight: any;
        spotLight: any;

        primitive: any;
        group: any;
        mesh: any;

        meshStandardMaterial: any;
        boxGeometry: any;
        ContactShadows: any; // Note: ContactShadows is usually a component, but just in case

        // Add wildcards if possible, or specific known elements
      }
    }
  }
}
