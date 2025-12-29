import CountryList from "./CountryList";
import { countries } from "./DataCard";

export default function RecentlyViewed() {
  return (
    <CountryList
      title="Recently Viewed"
      description="Continue exploring where you left off"
      countries={countries}
      horizontalScroll={true} // <-- enables horizontal scroll with arrows
    />
  )
}
