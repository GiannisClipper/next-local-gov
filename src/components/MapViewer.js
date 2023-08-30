import React, { useEffect } from "react";
import * as d3 from 'd3';

function enableZoomFeature( svg, g ) {

    const onZoomHandler = e => {
        g.selectAll( "path" )
            .style( "stroke-width", .9 / e.transform.k );

        g.selectAll( "text" )
        .style( "font-size", `${ 2 * .66 / ( 1 + e.transform.k ) }rem` )
        .style( "stroke-width", .9 / e.transform.k );

        g.attr( "transform", e.transform );
    }

    const zoom_behavior = d3.zoom()
        .scaleExtent( [ 1, 10 ] )
        // .translateExtent( [ 0, 0 ], [ width, height ] )
        .on( 'zoom', onZoomHandler );

    svg.call( zoom_behavior );
}

function MapViewer( { id, className, width, height, geojson, gProjections, zoom } ) {
  
    id = id || "map-viewer";

    className = `map-viewer ${className}`;

    useEffect( () => {

        const div = d3.select( `#${id}` );

        const svg = div.append( "svg" )
            .attr( "width", width )
            .attr( "height", height )

        // const projection = d3.geoEquirectangular()
        const projection = d3.geoMercator()
            .scale( 1 )
            .translate( [ 0, 0 ] );
        
        // Create a path generator.
        const pathGenerator = d3.geoPath().projection( projection );
        
        // Compute the bounds of the geojson data and calculate scale & translate.
        // based on https://stackoverflow.com/questions/14492284/center-a-map-in-d3-given-a-geojson-object
        const [ [ left, top ],[ right, bottom ]] = pathGenerator.bounds( geojson );
        const scale = .98 / Math.max( ( right - left ) / width, ( bottom - top ) / height );
        const translate = [ ( width - scale * ( right + left ) ) / 2, ( height - scale * ( bottom + top ) ) / 2 ];
        
        // Update the projection to use computed scale & translate.
        projection
            .scale( scale )
            .translate( translate );

        const g = svg.append( "g" );

        // g.append( "rect" )
        //     .attr( "x", ( width - ( width * .98 ) ) / 2 )
        //     .attr( "y", ( height - ( height * .98 ) ) / 2 )
        //     .attr( "width", width * .98 )
        //     .attr( "height", height * .98 )
        //     .attr( "stroke", "indianred")
        //     .attr( "fill", "transparent" );

        // g.append( "ellipse" )
        //     .attr( "cx", width / 2 )
        //     .attr( "cy", height / 2 )
        //     .attr( "rx", height / 2 )
        //     .attr( "ry", height / 2)
        //     .attr( "stroke", "yellowgreen")
        //     .attr( "fill", "transparent" );

        gProjections.forEach( p => p( g, pathGenerator, geojson ) );
        
        if ( zoom ) {
            enableZoomFeature( svg, g );
        }

    }, [] );

    return (
        <div id={`${id}`} className={`${className}`}>
            {/* <svg width={width} height={height}></svg> */}
        </div>
    )
}

export default MapViewer;
