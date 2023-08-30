import MapViewer, { getMapSetup, getPathElements, getFocusPathAbility } from "@/components/MapViewer";

function Tile( { id, name, info, shouldFocus, geojson } ) {

    const mapSetup = getMapSetup( { width: 300, height: 300, geojson} );
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