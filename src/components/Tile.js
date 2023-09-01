import MapViewer, { getMapSetup, getPathElements, getFocusPathAbility } from "@/components/MapViewer";

function Tile( { id, name, info, shouldFocus, geojson, zoomFeatures } ) {

    const mapSetup = getMapSetup( { width: 250, height: 250, geojson, zoomFeatures } );
    const focusPathAbility = getFocusPathAbility( { shouldFocus } );
    const pathElements = getPathElements( { abilities: [ focusPathAbility ] } );

    return (
        <li className="tile">
            <div className="title">
                <h5>{name}</h5> 
            </div>

            <div className="map">
                <MapViewer 
                    id={`id-${id}`}
                    className="simple-map-viewer"
                    mapSetup={ mapSetup }
                    mapElements={ [ pathElements ] }
                />
            </div>

            <div className="info">
                {info}
            </div>
        </li>
    );
}

export default Tile;