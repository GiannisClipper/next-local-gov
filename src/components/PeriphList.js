import PeriphTile from "@/components/PeriphTile";

function PeriphList( { periphereies, geojson } ) {


    let key = 0;

    return (
        <ul>
            {
                periphereies.map( p => {
                    key++;
                    return (
                        <PeriphTile 
                            key={key}
                            periphereia={p}
                            geojson={geojson}
                        />
                    )
                } )
            }
        </ul>
    );
}

export default PeriphList;
