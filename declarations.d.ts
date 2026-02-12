declare module "*.png" {
  const value: any;
  export = value;
}

declare module "*.jpg" {
  const value: any;
  export = value;
}

declare module "*.jpeg" {
  const value: any;
  export = value;
}

declare module "*.gif" {
  const value: any;
  export = value;
}

declare module "*.glb" {
  const value: any;
  export = value;
}

declare module "@react-three/drei" {
  const value: any;
  export = value;
}

// Add this SPECIFIC declaration
declare module "expo-three" {
  const value: any;
  export = value;
}

// The catch-all wildcard is what caused the confusing error message
declare module "*" {
  const value: any;
  export = value;
}
