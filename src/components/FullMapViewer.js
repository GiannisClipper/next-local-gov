import * as d3 from 'd3';
import MapViewer from "@/components/MapViewer";

function FullMapViewer( { id, geojson, onClickPath, getTextValue } ) {
  
    const gPaths = ( g, pathGenerator, geojson ) => {

        g.selectAll( "path" )
            .data( geojson.features )
            .enter()
            .append( "path" )
            .attr( "class", "svg-path" )
            .attr( "d", pathGenerator )

            .on( 'mouseover', function( e, d ) {
                d3.select( this )
                    .classed( "focus", true )
                    .transition()
                    .duration( 400 )
            } )
            .on( 'mouseout', function( e, d ) { 
                d3.select( this )
                    .classed( "focus", false )
                    .transition()
                    .duration( 200 )
            } )
            .on( 'click', function ( e, d ) {
                if ( onClickPath ) {
                    onClickPath( d );
                }
            } );
    }

    const gTexts = ( g, pathGenerator, geojson ) => {

        g.selectAll( "text" )
            .data( geojson.features )
            .enter()
            .append( "text" )
            .attr( "class", "svg-text" )
            .attr( "transform", d => `translate(${pathGenerator.centroid( d )})` )
            .style( "text-anchor", "middle" )
            .text( getTextValue );
    }
 
    return (
        <MapViewer
            id={ id }
            width={ 800 }
            height={ 600 }
            geojson={ geojson }
            gProjections={ [ gPaths, gTexts ] }
            zoom={ true }
        />
    );
}

export default FullMapViewer;
