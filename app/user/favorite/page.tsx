'use client'

import FavList from "./fav/FavList"
import FilterDropdowns from "./fav/FilterDropdowns"

export default function Favorite(){
    return(
        <main>
            <FilterDropdowns/>
            <FavList/>
        </main>
    )
}