import ProfileView from './info/ProfileView'
import CountryList from '../countries/list/CountryList'
import { countries } from '../countries/list/DataCard'

const page = () => {
  return (
    <div>
      <ProfileView/>
      <CountryList 
        title="Recent Activity"
        description="Discover our handpicked selection of must-visit destinations"
        countries={countries}
        horizontalScroll={true} 
      />
    </div>
  )
}

export default page