import MapSimpleViewer from "@/components/MapSimpleViewer";

function Tile( { id, name, info, geojson, attrStrokeHandler, attrFillHandler } ) {

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
                    strokeFunc={attrStrokeHandler}
                    fillFunc={attrFillHandler}
                />
            </div>

            <div className="info">
                {info}
            </div>
        </li>
    );
}

export default Tile;