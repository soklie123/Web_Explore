'use client'

import CountryList from "../countries/list/CountryList"
import { countries } from "../countries/list/DataCard"
import FilterDropdowns from "./fav/FilterDropdowns"

export default function Favorite(){
    return(
        <main>
            <FilterDropdowns/>
            
            <CountryList
            title="List All Countries"
            description="Discover our handpicked selection of must-visit destinations"
            countries={countries}
            />        
        </main>
    )
}