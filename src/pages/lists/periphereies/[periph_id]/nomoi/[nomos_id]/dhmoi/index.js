// import Link from "next/link";
import * as topojsonClient from 'topojson-client/dist/topojson-client';
import Menu from "@/components/Menu.js";
import Tile from "@/components/Tile";
import DataHandler from "@/helpers/DataHandler";

function DhmoiList( { periphereia, nomos, dhmoi, topojson } ) {

    // let manyGeometries = [];

    // if ( nomos.partialFocus ) {
    //     for ( let i = 0; i < nomos.partialFocus.length; i++ ) {
    //         const part = nomos.partialFocus[ i ];
    //         // const geometries = topojson.objects.dhmoi_okxe.geometries.filter( g => part.includes( g.properties.NAME ) );
    //         // manyGeometries.push( geometries );
    //         const geometries = [];
    //         for ( let i = 0; i < topojson.objects.dhmoi_okxe.geometries.length; i++ ) {
    //             if ( part.includes( topojson.objects.dhmoi_okxe.geometries[ i ].properties.NAME ) ) {
    //                 geometries.push( topojson.objects.dhmoi_okxe.geometries[ i ] );
    //             }
    //         }
    //         manyGeometries.push( geometries );
    //     }
    //     manyGeometries = JSON.stringify( manyGeometries );

    // } else {
    //     manyGeometries.push( topojson.objects.dhmoi_okxe.geometries );
    // }

    // const geojsons = [];
    // for ( let i = 0; i < nomos.partialFocus.length; i++ ) {
    //     const geometries = JSON.parse( manyGeometries )[ i ];
    //     topojson.objects.dhmoi_okxe.geometries = geometries;
    //     geojsons.push( topojsonClient.feature( topojson, topojson.objects.dhmoi_okxe ) );
    // }

    const geojson = topojsonClient.feature( topojson, topojson.objects.dhmoi_okxe );

    let key = 0;

    return (
        <>
        <Menu />
        <ul className="flex-container">
        {
            dhmoi.map( dhmos => {

                // let geojson = geojsons[ 0 ];
                // if ( nomos.partialFocus ) {
                //     for ( let i = 0; i < nomos.partialFocus.length; i++ ) {
                //         if ( nomos.partialFocus[ i ].includes( name ) ) {
                //             geojson = geojsons[ i ];
                //             break;
                //         }
                //     }
                // }
                const { id, name, info } = dhmos;
                const attrStrokeHandler = d => d.properties.NAME_ !== name ? "#333333" : "#333333";
                const attrFillHandler = d => d.properties.NAME !== name ? "white" : "steelblue";
                key++;

                return (
                    <div key={key} className="flex-item">
                        <Tile
                            id={id}
                            name={name}
                            info={info}
                            geojson={geojson}
                            attrStrokeHandler={attrStrokeHandler}
                            attrFillHandler={attrFillHandler}
                        />
                    </div>
                );
            } )
        }
        </ul>
        </>
    );
}

export default DhmoiList;

export async function getStaticPaths() {

    const paths = [];
    const dh = new DataHandler();

    const periphereies = dh.periphereies.findAll();
    periphereies.forEach( p => {

        const nomoi = dh.nomoi.findMany( n => n.periph_name === p.name );
        nomoi.forEach( n => {
            paths.push( { params: { periph_id: p.id, nomos_id: n.id } } );
        } );
    } );

    return {
        paths,
        fallback: false
    }
}

export async function getStaticProps( context ) {

    const { params } = context;
    const { periph_id, nomos_id } = params;

    // select csv data

    const dh = new DataHandler();
    const periphereia = dh.periphereies.findOne( p => p.id === periph_id );
    const nomos = dh.nomoi.findOne( n => n.id === nomos_id );
    const dhmoi = dh.dhmoi.findMany( d => d.nomos_name === nomos.name );

    // add info property

    dhmoi.forEach( d => {
        if ( ! d.info ) {
            const { name, area, pop2021 } = d;
            d.info = `Ο δήμος ${name} έχει έκταση ${area} τ.χμ. και πληθυσμό ${pop2021} κάτοικους (απογραφή 2021).`;
        }
    } );

    // select topojson data

    const topojsons = [];

    const topojson = dh.dhmoi.readTopojson();
    const ids = dhmoi.map( d => d.id );
    const geometries = topojson.objects.dhmoi_okxe.geometries.filter( g => ids.includes( g.properties.KWD_YPES ) );
    topojson.objects.dhmoi_okxe.geometries = geometries;
    
    console.log( `Static rendering lists/periphereies/{id}/nomoi{id}/dhmoi` );

    return {
        props: {
            periphereia,
            nomos,
            dhmoi,
            topojson
        }
    }
}
