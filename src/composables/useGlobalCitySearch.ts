// composables/useGlobalCitySearch.ts
import { ref } from 'vue'

export function useGlobalCitySearch() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const searchCityPostalCodes = async (cityName: string) => {
    if (!cityName || cityName.length < 2) return []

    loading.value = true
    error.value = null

    try {
      // Try OpenDataSoft first (no registration needed)
      const response = await fetch(
        `https://public.opendatasoft.com/api/records/1.0/search/?dataset=geonames-postal-code&q=${encodeURIComponent(cityName)}&rows=20`,
      )

      if (!response.ok) throw new Error('Failed to fetch data')

      const data = await response.json()

      const results =
        data.records?.map((record: any) => ({
          postalCode: record.fields.postal_code,
          placeName: record.fields.place_name,
          countryCode: record.fields.country_code,
          adminName1: record.fields.admin_name1,
          fullAddress: `${record.fields.place_name}, ${record.fields.admin_name1}, ${record.fields.country_code}`,
          coordinates: record.geometry?.coordinates,
        })) || []

      // Remove duplicates and sort by relevance
      const unique = results.filter(
        (item, index, self) =>
          index ===
          self.findIndex((t) => t.postalCode === item.postalCode && t.placeName === item.placeName),
      )

      return unique.slice(0, 10) // Limit to 10 results
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to search postal codes'
      return []
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    searchCityPostalCodes,
  }
}
