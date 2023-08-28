import Menu from "@/components/Menu";
import MapViewer from "@/components/MapViewer";
import * as topojsonClient from 'topojson-client/dist/topojson-client';
import DataHandler from "@/helpers/DataHandler";

function DhmoiMap( { periphereia, nomoi, topojson } ) {

    const geojson = topojsonClient.feature( topojson, topojson.objects.dhmoi_okxe );
    
    return (
        <>
        <Menu />
        <MapViewer 
            width={800} 
            height={600} 
            geojson={geojson}
            // pathStrokec={ ( d ) => d.properties.NAME_GR !== name ? "#333333" : "#333333" }
            // pathFill={ ( d ) => d.properties.NAME_GR !== name ? "white" : "steelblue" }
            textProp={ d => d.properties.NAME }
        />
        </>
    );
}

export default DhmoiMap;

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
    
    console.log( `Static rendering maps/periphereies/{id}/nomoi{id}/dhmoi` );

    return {
        props: {
            periphereia,
            nomos,
            dhmoi,
            topojson
        }
    }
}
