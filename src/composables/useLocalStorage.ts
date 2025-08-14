import { ref, watch, type Ref } from 'vue'

export default function useLocalStorage<T>(key: string, val: T) {
  const storedValue = read()

  let value: Ref<T>

  if (storedValue) {
    value = ref(JSON.parse(storedValue))
  } else {
    value = ref(val) as Ref<T>

    write()
  }

  watch(value, write, { deep: true })

  function read() {
    return localStorage.getItem(key)
  }

  function write() {
    if (value.value === null || value.value === false) {
      localStorage.removeItem(key)
    } else {
      localStorage.setItem(key, JSON.stringify(value.value))
    }
  }

  return value
}
