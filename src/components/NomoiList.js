import NomoiTile from "@/components/NomoiTile";

function NomoiList( { periphereia, nomoi, geojson } ) {

    let key = 0;

    return (
        <ul>
            {
                nomoi.map( n => {
                    key++;
                    return (
                        <NomoiTile 
                            key={key}
                            periphereia={periphereia}
                            nomos={n}
                            geojson={geojson}
                        />
                    )
                } )
            }
        </ul>
    );
}

export default NomoiList;
