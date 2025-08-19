export interface GeoNamesPostalCode {
  postalCode: string
  placeName: string
  countryCode: string
  adminName1?: string
  adminName2?: string
  adminName3?: string
  lat: number
  lng: number
}

export interface GeoNamesResponse {
  postalCodes: GeoNamesPostalCode[]
  status?: {
    message: string
    value: number
  }
}

export interface PostalCodeSuggestion {
  postalCode: string
  placeName: string
  countryCode: string
  adminName1?: string
  fullAddress: string
  coordinates: [number, number]
}
