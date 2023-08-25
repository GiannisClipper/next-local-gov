import React, { useEffect } from "react";
import * as d3 from 'd3';

function MapSimpleViewer( { id, width, height, geojson, strokeFunc, fillFunc } ) {


    useEffect( () => {

        const projection = d3.geoEquirectangular();

        projection.fitSize( [ width, height ], geojson );
        // projection.center([0,0]);
        // projection.translate([0,0]);
        
        /// A geographic path generator is a function that takes a GeoJSON object and converts it into an SVG path string r
        // something like "M464.0166237760863,154.09974265651798L491.1506253268278,154.8895088551978 ... L448.03311471280136,183.1346693994119Z"
        const geoPathGenerator = d3.geoPath().projection( projection );

        // An array of features is joined to path elements. The d attribute is set using the function geoGenerator. 
        // This receives a feature as its first parameter and outputs a path string
        const div = d3.select( `.map-content.id-${id}` );
        const svg = div.select( "svg" );
            // .attr( "width", width )
            // .attr( "height", height )
            // .attr( "stroke", "yellowgreen" )
            // .attr( "fill", "transparent" );

        const g = svg.append( "g" );
        g.selectAll( "path" )
            .data( geojson.features )
            .enter()
            .append( "path" )
            .attr( "d", geoPathGenerator )
            .style( 'stroke', strokeFunc )
            .style( 'fill', fillFunc );

        // g.append( "text" )
        //     .text( function ( d ) {
        //         return d.properties.NAME;
        //     } );

        // const u = d3.select( `.map-content-${id}` )            
        // .selectAll( 'path' )
        // .data( featureCollection.features )
        // .join( 'path' )
        // .attr( 'd', geoGenerator );

    }, [ width, height ] );

    return (
        <div className={`map-content id-${id}`}>
            <svg width={width} height={height}></svg>
        </div>
    )
}

export default MapSimpleViewer;