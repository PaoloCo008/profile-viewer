import type {
  GeoNamesPostalCode,
  GeoNamesResponse,
  PostalCodeSuggestion,
} from '@/lib/types/geoNames'
import type { UseGlobalCitySearchReturn } from '@/lib/types/global'
import { ref } from 'vue'

export function useGlobalCitySearch(): UseGlobalCitySearchReturn {
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const geoNamesUsername = 'paolo008'

  const searchCityPostalCodes = async (cityName: string): Promise<PostalCodeSuggestion[]> => {
    if (!cityName || cityName.length < 2) return []

    loading.value = true
    error.value = null

    try {
      const response = await fetch(
        `http://api.geonames.org/postalCodeSearchJSON?placename=${encodeURIComponent(cityName)}&username=${geoNamesUsername}&maxRows=20`,
      )

      if (!response.ok) {
        throw new Error(`API unavailable (${response.status})`)
      }

      const data: GeoNamesResponse = await response.json()

      if (data.status) {
        throw new Error(data.status.message || 'GeoNames API error')
      }

      const results: PostalCodeSuggestion[] =
        data.postalCodes?.map((postal: GeoNamesPostalCode) => ({
          postalCode: postal.postalCode,
          placeName: postal.placeName,
          countryCode: postal.countryCode,
          adminName1: postal.adminName1,
          fullAddress:
            `${postal.placeName}, ${postal.adminName1 || ''}, ${postal.countryCode}`.replace(
              ', ,',
              ',',
            ),
          coordinates: [postal.lat, postal.lng] as [number, number],
        })) || []

      const unique = Array.from(
        new Map(results.map((item) => [`${item.postalCode}-${item.placeName}`, item])).values(),
      )

      if (unique.length === 0) {
        error.value = 'No postal codes found for this city'
      }

      return unique.slice(0, 10)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unable to search postal codes'
      return []
    } finally {
      loading.value = false
    }
  }

  const clearError = (): void => {
    error.value = null
  }

  return {
    loading,
    error,
    searchCityPostalCodes,
    clearError,
  }
}
