"use client"

/**
 * Service for handling geocoding operations
 */

const GEOAPIFY_API_KEY = "d5c724885353433bbc4b030a2d54a15f"

/**
 * Interface for geocoding response
 */
export interface GeocodeResult {
  formatted: string
  country: string
  state: string
  city: string
  street: string
  postcode: string
  error?: string
}

/**
 * Convert coordinates to address using reverse geocoding
 * @param lat - Latitude
 * @param lon - Longitude
 * @returns Promise with the address information
 */
export async function reverseGeocode(lat: number, lon: number): Promise<GeocodeResult> {
  try {
    const response = await fetch(
      `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${GEOAPIFY_API_KEY}`,
    )

    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`)
    }

    const data = await response.json()

    if (!data.features || data.features.length === 0) {
      return {
        formatted: "Address not found",
        country: "",
        state: "",
        city: "",
        street: "",
        postcode: "",
        error: "No results found",
      }
    }

    const properties = data.features[0].properties

    return {
      formatted: properties.formatted || "Address not found",
      country: properties.country || "",
      state: properties.state || "",
      city: properties.city || "",
      street: properties.street || "",
      postcode: properties.postcode || "",
    }
  } catch (error) {
    console.error("Error in reverse geocoding:", error)
    return {
      formatted: "Unable to retrieve address",
      country: "",
      state: "",
      city: "",
      street: "",
      postcode: "",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Custom hook for reverse geocoding
 */
import { useState, useEffect } from "react"

export function useReverseGeocode(lat: number | null, lon: number | null) {
  const [address, setAddress] = useState<GeocodeResult | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function getAddress() {
      if (lat === null || lon === null) {
        setAddress(null)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const result = await reverseGeocode(lat, lon)
        setAddress(result)
        if (result.error) {
          setError(result.error)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to get address")
        setAddress(null)
      } finally {
        setLoading(false)
      }
    }

    getAddress()
  }, [lat, lon])

  return { address, loading, error }
}
