import Particles, { initParticlesEngine } from "@tsparticles/react";
import { useEffect, useMemo, useState } from "react";
import { loadSlim } from "@tsparticles/slim";

const ParticlespnfComponent = ({ id, isDarkMode }) => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = (container) => {
    console.log(container);
  };

  const options = useMemo(
    () => ({
      background: {
        color: {
          value: isDarkMode ? "#000" : "#fff", // Change background color based on mode
        },
      },
      fpsLimit: 60,
      particles: {
        color: {
          value: ["#023e8a", "#004c96", "#005aa2", "#0069ac", "#CAF0F8"],
        },
        links: {
          color: "#aec6cf",
          distance: 200,
          enable: true,
          opacity: 1,
          width: 3,
        },
        move: {
          direction: "none",
          enable: true,
          outModes: {
            default: "bounce",
          },
          speed: 2,
        },
        number: {
          density: {
            enable: true,
            value_area: 800,
          },
          value: 90,
        },
        opacity: {
          value: {
            min: 0,
            max: 0.5,
            animation: {
              enable: true,
              speed: 2,
              minimumValue: 0,
              sync: false,
            },
          },
          animation: {
            count: 0,
            enable: true,
            speed: 1,
            sync: false,
            destroy: "none",
            minimumValue: 0,
            startValue: "max",
          },
        },
        size: {
          value: { min: 1, max: 10 },
          animation: {
            enable: true,
            speed: 2,
            sync: false,
          },
        },
      },
      detectRetina: true,
    }),
    [isDarkMode]
  );

  return <Particles id={id} init={particlesLoaded} options={options} />;
};

export default ParticlespnfComponent;
