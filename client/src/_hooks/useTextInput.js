import { useState } from "react";
export default function useTextInput(initialValue) {
  const [value, setValue] = useState(initialValue);

  function onChange(e) {
    setValue(e.target.value);
  }

  return {
    onChange,
    value,
  };
}
