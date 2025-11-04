const clamp = (min: number, value: number, max: number) => {
  return Math.max(min, Math.min(max, value));
};

export default clamp;
