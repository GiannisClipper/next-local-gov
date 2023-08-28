// import Link from "next/link";
import * as topojsonClient from 'topojson-client/dist/topojson-client';
import Menu from "@/components/Menu.js";
import DhmoiTile from "@/components/DhmoiTile";
import DataHandler from "@/helpers/DataHandler";

function DhmoiList( { periphereia, nomos, dhmoi, topojson } ) {

    const geojson = topojsonClient.feature( topojson, topojson.objects.dhmoi_okxe );
    let key = 0;

    return (
        <>
        <Menu />
        <ul className="flex-container">
        {
            dhmoi.map( dhmos => {

                key++;

                return (
                    <div key={key} className="flex-item">
                        <DhmoiTile 
                            periphereia={periphereia}
                            nomos={nomos}
                            dhmos={dhmos}
                            geojson={geojson}
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

    const dh = new DataHandler();
    const periphereia = dh.periphereies.findOne( p => p.id === periph_id );
    const nomos = dh.nomoi.findOne( n => n.id === nomos_id );
    const dhmoi = dh.dhmoi.findMany( d => d.nomos_name === nomos.name );
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