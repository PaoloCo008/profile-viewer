import { useDebounceFn } from '@vueuse/core'
import { watch, ref } from 'vue'
import { type LocationQueryValue, useRoute, useRouter } from 'vue-router'

export default function useSearchParams(
  key: string,
  defaultValue: string,
  routeName: string,
  { debounce = false, delay = 500 }: { debounce?: boolean; delay?: number } = {},
) {
  const router = useRouter()
  const route = useRoute()

  const controlRef = ref<LocationQueryValue | LocationQueryValue[]>(
    route.query[key] || defaultValue,
  )

  let callback = () => {
    if (controlRef.value !== defaultValue) {
      setUrlQuery(routeName, key, controlRef.value as string)
    } else {
      removeUrlQuery(routeName, key)
    }
  }

  if (debounce) {
    callback = useDebounceFn(callback, delay)
  }

  watch(controlRef, callback)

  function removeUrlQuery(pathName: string, key: string) {
    const query = { ...route.query }

    delete query[key]

    router.replace({ name: pathName, query })
  }

  function setUrlQuery(pathName: string, key: string, value: string) {
    const query = { ...route.query, [key]: value.trim() }

    if (key !== 'page') {
      delete query['page']
    }

    router.replace({ name: pathName, query })
  }

  return controlRef
}
