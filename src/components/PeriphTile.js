import Link from "next/link";
import MapSimpleViewer from "@/components/MapSimpleViewer";

function PeriphTile( { periphereia, geojson } ) {

    const { id, name } = periphereia;

    return (
        <Link href={`/periphereies/${id}/nomoi`}>
            <li className="tile">
                <div className="title">
                    <h5>{name}</h5> 
                </div>
                <div className="map">
                    <MapSimpleViewer
                        id={id} 
                        width={300} 
                        height={300} 
                        geojson={geojson}
                        strokeFunc={ ( d ) => d.properties.PER !== name ? "#333333" : "#333333" }
                        fillFunc={ ( d ) => d.properties.PER !== name ? "white" : "steelblue" }
                    />
                </div>
            </li>
        </Link>
    );
}

export default PeriphTile;