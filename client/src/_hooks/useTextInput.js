import { useState } from "react";
export default function useTextInput(initialValue) {
  const [value, setValue] = useState(initialValue);

  function onChange(e) {
    setValue(e.target.value);
  }

  function reset() {
    setValue(initialValue);
  }

  return {
    onChange,
    value,
    reset,
  };
}
