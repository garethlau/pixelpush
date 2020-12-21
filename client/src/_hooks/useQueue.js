import { useState } from "react";

export default function useQueue(initialValues) {
  const [values, setValues] = useState(initialValues);

  function enqueue(value) {
    setValues((prev) => [...prev, value]);
  }

  function enqueueMany(values) {
    setValues((prev) => [...prev, ...values]);
  }

  function dequeue() {
    const top = values[0];
    setValues((prev) => prev.slice(1));

    return top;
  }

  function peek() {
    return values[0];
  }

  function size() {
    return values.length;
  }

  function clear() {
    setValues([]);
  }

  function reset() {
    setValues(initialValues);
  }

  return {
    size,
    enqueue,
    enqueueMany,
    dequeue,
    clear,
    reset,
    peek,
    values,
  };
}
