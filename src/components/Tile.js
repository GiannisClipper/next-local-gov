import SimpleMapViewer from "@/components/SimpleMapViewer";

function Tile( { id, name, info, hasFocus, geojson } ) {

    return (
        <li className="tile">
            <div className="title">
                <h5>{name}</h5> 
            </div>

            <div className="map">
                <SimpleMapViewer
                    id={`id-${id}`}
                    geojson={geojson}
                    hasFocus={hasFocus}
                    // strokeFunc={attrStrokeHandler}
                    // fillFunc={attrFillHandler}
                />
            </div>

            <div className="info">
                {info}
            </div>
        </li>
    );
}

export default Tile;