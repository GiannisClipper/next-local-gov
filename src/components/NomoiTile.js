import Link from "next/link";
import MapSimpleViewer from "@/components/MapSimpleViewer";

function NomoiTile( { periphereia, nomos, geojson, textHeight } ) {

    const periph_id = periphereia.id;
    const { id, name, dhmoi } = nomos;
    const dhmNames = dhmoi.map( d => d.name ).join( ', ' );
    const text= `Στο νομό ${name} περιλαμβάνονται οι δήμοι ${dhmNames}.`;

    return (
        <Link href={`/periphereies/${periph_id}/nomoi/${id}/dhmoi`}>
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
                        strokeFunc={ ( d ) => d.properties.NAME_GR !== name ? "#333333" : "#333333" }
                        fillFunc={ ( d ) => d.properties.NAME_GR !== name ? "white" : "steelblue" }
                    />
                </div>
                <div className="info">
                    {text}
                </div>
            </li>
        </Link>
    );
}

export default NomoiTile;