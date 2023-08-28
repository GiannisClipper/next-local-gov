import MapSimpleViewer from "@/components/MapSimpleViewer";

function DhmoiTile( { periphereia, nomos, dhmos, geojson } ) {

    const { id, name, area, pop2021 } = dhmos;
    const info = `Ο δήμος ${name} έχει έκταση ${area} τ.χμ. και πληθυσμό ${pop2021} άτομα σύμφωνα με την απογραφή του 2021.`;

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
                    strokeFunc={ ( d ) => d.properties.NAME !== name ? "#333333" : "#333333" }
                    fillFunc={ ( d ) => d.properties.NAME !== name ? "white" : "steelblue" }
                />
            </div>

            <div className="info">
                {info}
            </div>
        </li>
    );
}

export default DhmoiTile;