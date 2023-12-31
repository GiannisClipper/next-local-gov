import React, { useEffect } from "react";
import * as d3 from 'd3';

function MapViewer( { id, className, mapSetup, mapElements, zoomAbility } ) {
  
    id = id || "map-viewer";

    className = `map-viewer ${className}`;

    useEffect( () => {

        const { width, height, pathGenerator, geojson } = mapSetup();

        const map = d3.select( `#${id}` );

        const tooltip = map.append( "div" )
            .attr( "class", "tooltip hidden" );

        const svg = map.append( "svg" )
            .attr( "width", width )
            .attr( "height", height );
    
        const g = svg.append( "g" );

        mapElements.forEach( elem => elem( { map, tooltip, svg, g, pathGenerator, geojson } ) );
        
        zoomAbility && zoomAbility( { svg, g } );

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

    }, [] );

    return (
        <>
        <div id={`${id}`} className={`${className}`}>
            {/* <svg width={width} height={height}></svg> */}
            <div className="tootip hidden"></div>
        </div>
        </>
    );
}

function getMapSetup( { width, height, geojson, zoomFeatures } ) {

    return () => {
        // const projection = d3.geoEquirectangular()
        const projection = d3.geoMercator()
            .scale( 1 )
            .translate( [ 0, 0 ] );
        
        // Create a path generator.
        const pathGenerator = d3.geoPath().projection( projection );

        const allFeatures = geojson.features;
        if ( zoomFeatures && zoomFeatures.length > 0 ) {
            geojson.features = zoomFeatures;
        }

        // Get the bounds of the geojson data and compute scale and translate.
        // based on https://stackoverflow.com/questions/14492284/center-a-map-in-d3-given-a-geojson-object
        const [ [ left, top ],[ right, bottom ]] = pathGenerator.bounds( geojson );
        const scale = .98 / Math.max( ( right - left ) / width, ( bottom - top ) / height );
        const translate = [ ( width - scale * ( right + left ) ) / 2, ( height - scale * ( bottom + top ) ) / 2 ];

        geojson.features = allFeatures;

        // Update projection with computed scale and translate.
        projection
            .scale( scale )
            .translate( translate );

        return { width, height, geojson, pathGenerator };
    }
}

function getPathElements( { className, abilities } ) {

    return ( { map, tooltip, svg, g, pathGenerator, geojson } ) => {

        className = className || "svg-path";

        g.selectAll( "path" )
            .data( geojson.features )
            .enter()
            .append( "path" )
            .attr( "class", className )
            .attr( "d", pathGenerator )

        abilities && abilities.forEach( a => a( { tooltip, g } ) );
    }
}

function getTextElements( { className, getTextValue } ) {

    return ( { g, pathGenerator, geojson } ) => {

        className = className || "svg-text";

        g.selectAll( "text" )
            .data( geojson.features )
            .enter()
            .append( "text" )
            .attr( "class", className )
            .attr( "transform", d => `translate(${pathGenerator.centroid( d )})` )
            .style( "text-anchor", "middle" )
            .text( getTextValue );
    }
}

function getFocusPathAbility( { className, shouldFocus } ) {

    className = className || "focused";

    return ( { g } ) => {
        g.selectAll( "path" )
            .classed( className, shouldFocus );
    }
}

function getHoverPathAbility( { className } ) {

    className = className || "hovered";

    return ( { g } ) => {
        g.selectAll( "path" )
            .on( 'mouseover', function( e, d ) {
                d3.select( this )
                    .classed( className, true );
            } )
            .on( 'mouseout', function( e, d ) { 
                d3.select( this )
                    .classed( className, false );
            } )
    }
}

function getTooltipAbility( { leftOffset, topOffset, getTooltipValue } ) {

    return ( { tooltip, g } ) => {

        g.selectAll( "path" )
            .on( 'mouseenter', function( e, d ) {
                tooltip
                    .classed( "hidden", false )
                    .html( getTooltipValue( d ) );
            } )
            // .on( 'mousemove', function( e, d ) {
            //     tooltip
            //         .style( "left", ( e.pageX + leftOffset ) + "px") 
            //         .style( "top", ( e.pageY + topOffset ) + "px");
            // } )
            .on( 'mouseleave', function( e, d ) { 
                tooltip
                    .classed( "hidden", true );
            } );
    }
}

function getClickPathAbility( { className, clickHandler } ) {

    className = className || "clickable clicked";
    className = className.split( ' ' );

    return ( { g } ) => {

        g.selectAll( "path" )
            .classed( className[ 0 ], true )
            .on( 'click', function ( e, d ) {
                d3.select( this )
                    .classed( className[ 1 ], true )
                clickHandler( d );
            } );
    }
}

function getZoomAbility( { scaleExtent } ) {

    scaleExtent = scaleExtent || [ 1, 10 ];

    return ( { g, svg } ) => {

        const onZoomHandler = e => {
            g.selectAll( "path" )
                .style( "stroke-width", .9 / e.transform.k );
    
            g.selectAll( "text" )
            .style( "font-size", `${ 2 * .66 / ( 1 + e.transform.k ) }rem` )
            .style( "stroke-width", .9 / e.transform.k );
    
            g.attr( "transform", e.transform );
        }
    
        const zoom_behavior = d3.zoom()
            .scaleExtent( scaleExtent )
            // .translateExtent( [ 0, 0 ], [ width, height ] )
            .on( 'zoom', onZoomHandler );
    
        svg.call( zoom_behavior );
    }
}

export default MapViewer;
export { 
    getMapSetup,
    getPathElements,
    getTextElements,
    getFocusPathAbility,
    getHoverPathAbility,
    getTooltipAbility,
    getClickPathAbility,
    getZoomAbility
};
