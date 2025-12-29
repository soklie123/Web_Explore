'use client'

import ExploreFilter from "./cards/ExploreFilter";
import ExploreList from "./cards/ExploreList";

const handleApply = () => {
    console.log("Filter applied!");
  };


export default function Explore(){
    return (
        <main>
            <ExploreFilter onApply={handleApply} />
            
            <ExploreList/>
        </main>
    );
}