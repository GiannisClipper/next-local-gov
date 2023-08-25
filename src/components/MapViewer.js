import React, { useEffect } from "react";
import * as d3 from 'd3';

function MapViewer( { width, height, geojson, pathStroke, pathFill, textProp, clickMap } ) {

    useEffect( () => {

        // based on `Jan van der Laan` answer/idea:
        // https://stackoverflow.com/questions/14492284/center-a-map-in-d3-given-a-geojson-object

        // a sample projection
        const center = d3.geoCentroid( geojson ); // map coordinates
        let scale  = 1;
        let offset = [ width / 2, height / 2 ];
  
        let projection = d3.geoEquirectangular()
            .center( center )
            .scale( scale )
            .translate( offset )

        let geoPathGenerator = d3.geoPath().projection( projection );

        // get the sample bounds and calculate values to scale and translate
        let bounds = geoPathGenerator.bounds( geojson );
        const [ sampleLeft, sampleTop ] = bounds[ 0 ];
        const [ sampleRight, sampleBottom ] = bounds[ 1 ];
        const sampleWidth = sampleRight - sampleLeft;
        const sampleHeight = sampleBottom - sampleTop;

        const hscale = scale * width / sampleWidth;
        const vscale = scale * height / sampleHeight;
        scale = ( hscale < vscale ) ? hscale : vscale;

        const [ hOffset, vOffset ] = offset;
        const hCorrection = ( hOffset - sampleWidth / 2 ) - sampleLeft;
        const vCorrection = ( vOffset - sampleHeight / 2 ) - sampleTop;
        offset = [
            hOffset + hCorrection * scale,
            vOffset + vCorrection * scale,
        ];

        // the actual projection
        projection = d3.geoEquirectangular()
            .center( center )
            .scale( scale )
            .translate( offset )

        geoPathGenerator = geoPathGenerator.projection( projection );

        const div = d3.select( `.map-content` );

        const svg = div.select( "svg" )
            // .attr( "width", width )
            // .attr( "height", height )
            .attr( "stroke", "steelblue" )
            .attr( "fill", "white" );

        const group = svg.append( "g" );

        group.append( "ellipse" )
            .attr("cx", width / 2 )
            .attr("cy", height / 2 )
            .attr("rx", height/2 )
            .attr("ry", height/2)
            .attr("stroke", "yellow")
            .attr( "fill", "transparent" );

        group.selectAll( "path" )
            .data( geojson.features )
            .enter()
            .append( "path" )
            .attr( "d", geoPathGenerator )
            .style( 'stroke', pathStroke )
            .style( 'fill', pathFill )
            .on( 'mouseover', function( e, d ) {
                d3.select( this )
                    .transition()
                    .duration( 200 )
                    .style( 'fill', 'lightgreen' )
            } )
            .on( 'mouseout', function( e, d ) { 
                d3.select( this )
                  .transition()
                  .duration( 200 )
                    .style( 'fill', 'white')
            } )
            .on( 'click', function (e, d) {
                clickMap()
                // alert( textProp(d) )
            } )

        svg.append("rect")
            .attr("x", bounds[ 0 ][ 0 ])
            .attr("y", bounds[ 0 ][ 1 ])
            .attr("width", bounds[ 1 ][ 0 ]-bounds[ 0 ][ 0 ])
            .attr("height", bounds[ 1 ][ 1 ]-bounds[ 0 ][ 1 ])
            .attr("stroke", "red");

        group.selectAll( "text" )
            .data( geojson.features )
            .enter()
            .append( "text" )
            .attr( "transform", d => `translate(${geoPathGenerator.centroid( d )})` )
            // .attr( "dy", ".35em" )
            .style( "text-anchor", "middle" )
            .style( "font-size", ".66em" )
            .style( "color", "lime" )
            .text( textProp );

        // const u = d3.select( `.map-content-${id}` )            
        // .selectAll( 'path' )
        // .data( featureCollection.features )
        // .join( 'path' )
        // .attr( 'd', geoGenerator );

    }, [ width, height ] );

    return (
        <div className={`map-content id`}>
            <svg width={width} height={height}></svg>
        </div>
    )
}

export default MapViewer;