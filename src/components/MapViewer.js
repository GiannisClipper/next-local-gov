import React, { useState, useEffect } from "react";
import * as d3 from 'd3';

function MapViewer( { width, height, geojson, pathStroke, pathFill, textProp, onClickHandler } ) {

  const [ zoom, setZoom ] = useState( 1000 );
  
    useEffect( () => {

        const div = d3.select( `.map-content` );

        const svg = div.append( "svg" )
            .attr( "width", width )
            .attr( "height", height )
            .attr( "stroke", "steelblue" )
            .attr( "fill", "white" );

        // const projection = d3.geoEquirectangular()
        const projection = d3.geoMercator()
            .scale( 1 )
            .translate( [ 0, 0 ] );
        
        // Create a path generator.
        const path = d3.geoPath().projection( projection );
        
        // Compute the bounds of a feature of interest, then derive scale & translate.
        // based on https://stackoverflow.com/questions/14492284/center-a-map-in-d3-given-a-geojson-object
        const [ [ left, top ],[ right, bottom ]] = path.bounds( geojson );
        const scale = .95 / Math.max( ( right - left ) / width, ( bottom - top ) / height );
        const translate = [ ( width - scale * ( right + left ) ) / 2, ( height - scale * ( bottom + top ) ) / 2 ];
        
        // Update the projection to use computed scale & translate.
        projection
            .scale( scale )
            .translate( translate );

        const g = svg.append( "g" )
           .attr( "class", "group features" )

        // g.append( "ellipse" )
        //     .attr("cx", width / 2 )
        //     .attr("cy", height / 2 )
        //     .attr("rx", height/2 )
        //     .attr("ry", height/2)
        //     .attr("stroke", "yellow")
        //     .attr( "fill", "transparent" )

        g.selectAll( "path" )
            .data( geojson.features )
            .enter()
            .append( "path" )
            .attr( "d", path )
            .style( 'stroke', pathStroke )
            .style( "stroke-width", .9 )
            .style( 'fill', pathFill )

            .on( 'mouseover', function( e, d ) {
                d3.select( this )
                    .transition()
                    .duration( 400 )
                    .style( 'fill', 'lightsteelblue' )
            } )
            .on( 'mouseout', function( e, d ) { 
                d3.select( this )
                  .transition()
                  .duration( 200 )
                    .style( 'fill', 'white')
            } )
            .on( 'click', function ( e, d ) {
                if ( onClickHandler ) {
                    onClickHandler( d );
                }
            } )

        g.selectAll( "text" )
            .attr( "class", "svg-map-text" )
            .data( geojson.features )
            .enter()
            .append( "text" )
            .attr( "transform", d => `translate(${path.centroid( d )})` )
            // .attr( "dy", ".35em" )
            .style( "text-anchor", "middle" )
            .style( "font-size", ".66rem" )
            .style( "color", "steelblue" )
            .style( "stroke-width", .9 )
            .text( textProp );
 
        const onZoomHandler = e => {
            g.selectAll( "path" )
                .style( "stroke-width", .9 / e.transform.k );

            g.selectAll( "text" )
              .style( "font-size", `${ 2 * .66 / (1 + e.transform.k ) }rem` )
              .style( "stroke-width", .9 / e.transform.k );

            g.attr( "transform", e.transform );
        }

        const zoom_behavior = d3.zoom()
            .scaleExtent( [ 1, 10 ] )
            // .translateExtent( [ 0, 0 ], [ width, height ] )
            .on( 'zoom', onZoomHandler );

        svg.call( zoom_behavior );

    }, [] );

    return (
        <>
        <div className={`map-content`}>
            {/* <svg width={width} height={height}></svg> */}
        </div>
        <div onClick={ e => { console.log( zoom ); setZoom( zoom + 1000 ); } }>zoom</div>
        </>
    )
}

export default MapViewer;
