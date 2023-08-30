import * as d3 from 'd3';
import MapViewer from "@/components/MapViewer";

function SimpleMapViewer( { id, geojson, hasFocus } ) {
  
    const gPaths = ( g, pathGenerator, geojson ) => {

        g.selectAll( "path" )
            .data( geojson.features )
            .enter()
            .append( "path" )
            .attr( "class", "svg-path" )
            .classed( "focus", hasFocus )
            .attr( "d", pathGenerator );
    }
 
    return (
        <MapViewer
            id={ `id${id}` }
            className="simple-map-viewer"
            width={ 300 }
            height={ 300 }
            geojson={ geojson }
            gProjections={ [ gPaths ] }
        />
    );
}

export default SimpleMapViewer;
