'use client'

import CountryList from "../countries/list/CountryList";
import { countries } from "../countries/list/DataCard";
import ExploreFilter from "./cards/ExploreFilter";


const handleApply = () => {
    console.log("Filter applied!");
  };


export default function Explore(){
    return (
        <main>
            <ExploreFilter onApply={handleApply} />
            
            <CountryList 
                title="List All Countries"
                description="Discover our handpicked selection of must-visit destinations"
                countries={countries}
                />
        </main>
    );
}