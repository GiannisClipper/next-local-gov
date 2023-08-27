import MapSimpleViewer from "@/components/MapSimpleViewer";

function PeriphTile( { periphereia, geojson } ) {

    const { id, name, nomoi } = periphereia;
    const nomNames = nomoi.map( n => n.name ).join( ', ' );
    const info = `Στην περιφέρεια ${name} περιλαμβάνονται οι νομοί ${nomNames}.`;

    return (
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

            <div className="info">
                {info}
            </div>
        </li>
    );
}

export default PeriphTile;