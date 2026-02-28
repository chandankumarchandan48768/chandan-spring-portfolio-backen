import { Canvas, useFrame } from "@react-three/fiber";
import HeroText from "../components/HeroText";
import ParallaxBackground from "../components/parallaxBackground";
import { Astronaut } from "../components/Astronaut";
import { Float } from "@react-three/drei";
import { useMediaQuery } from "react-responsive";
import { easing } from "maath";
import { Suspense, Component } from "react";
import Loader from "../components/Loader";

// Error boundary to prevent WebGL crashes from breaking the whole page
class WebGLErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return null; // silently hide if 3D fails
    }
    return this.props.children;
  }
}

const Hero = () => {
  const isMobile = useMediaQuery({ maxWidth: 853 });
  return (
    <section id="home" className="flex items-start justify-center min-h-screen overflow-hidden md:items-start md:justify-start c-space">
      <HeroText />
      <ParallaxBackground />
      <figure
        className="absolute inset-0"
        style={{ width: "100vw", height: "100vh" }}
      >
        <WebGLErrorBoundary>
          <Canvas
            camera={{ position: [0, 1, 3] }}
            dpr={[0.5, 1]}
            gl={{
              powerPreference: "default",
              antialias: false,
              failIfMajorPerformanceCaveat: false,
            }}
          >
            <Suspense fallback={<Loader />}>
              <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.3}>
                <Astronaut
                  scale={isMobile ? 0.23 : undefined}
                  position={isMobile ? [0, -1.5, 0] : undefined}
                />
              </Float>
              <Rig />
            </Suspense>
          </Canvas>
        </WebGLErrorBoundary>
      </figure>
    </section>
  );
};

function Rig() {
  return useFrame((state, delta) => {
    easing.damp3(
      state.camera.position,
      [state.mouse.x / 10, 1 + state.mouse.y / 10, 3],
      0.5,
      delta
    );
  });
}

export default Hero;
