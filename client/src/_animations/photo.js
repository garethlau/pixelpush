const config = {
  variants: {
    initial: { opacity: 0, y: 50, scale: 0.7 },
    enter: {
      opacity: 1,
      y: 0,
      scale: 1,
    },
    exit: {
      opacity: 0,
      y: 50,
      scale: 0.7,
    },
  },
  initial: "initial",
};

export default config;
