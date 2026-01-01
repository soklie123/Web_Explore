export async function GET() {
  try {
    const fieldsParam = "fields=name,region,population,area,flag,capital,languages,currencies"
    const response = await fetch(`https://restcountries.com/v3.1/all?${fieldsParam}`, {
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`REST Countries API returned ${response.status}`)
    }

    const data = await response.json()
    return Response.json(data)
  } catch (error) {
    console.error("[v0] Countries API error:", error)
    return Response.json({ error: "Failed to fetch countries" }, { status: 500 })
  }
}
