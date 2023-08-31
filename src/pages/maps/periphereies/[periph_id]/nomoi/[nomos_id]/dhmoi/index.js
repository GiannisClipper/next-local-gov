import * as topojsonClient from 'topojson-client/dist/topojson-client';
import DataHandler from "@/helpers/DataHandler";
import { LinksMenu, LinkPeriph, LinkPeriphIdNomoi, LinkPeriphIdNomoiIdDhmoi } from "@/components/Links";
import MapViewer, { 
    getMapSetup,
    getPathElements,
    getTextElements,
    getHoverPathAbility,
    getZoomAbility
} from "@/components/MapViewer";

function DhmoiMap( { periphereia, nomos, topojson } ) {

    const geojson = topojsonClient.feature( topojson, topojson.objects.dhmoi_okxe );
    const periph_id = periphereia.id;
    const periph_name = periphereia.name;
    const nomos_id = nomos.id;
    const nomos_name = nomos.name;
    const nomos_autonomous = nomos.autonomous;

    const mapSetup = getMapSetup( { width: 800, height: 600, geojson} );

    const hoverPathAbility = getHoverPathAbility( {} );
    const pathElements = getPathElements( { abilities: [ hoverPathAbility ] } );

    const getTextValue = d => d.properties.NAME.toUpperCase();
    const textElements = getTextElements( { getTextValue } );

    const zoomAbility = getZoomAbility( { scaleExtent: [ 1, 20 ] } );

    return (
        <>
        <LinksMenu>
            <LinkPeriph domain="maps"/>
            <LinkPeriphIdNomoi domain="maps" periph_id={periph_id} periph_name={periph_name} />
            <LinkPeriphIdNomoiIdDhmoi focused={true} domain="maps" 
                periph_id={periph_id} periph_name={periph_name} 
                nomos_id={nomos_id} nomos_name={nomos_name} nomos_autonomous={nomos_autonomous}
            />
        </LinksMenu>

        <MapViewer 
            className="full-map-viewer"
            mapSetup={ mapSetup }
            mapElements={ [ pathElements, textElements ] }
            zoomAbility={ zoomAbility }
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

    // select csv data

    const dh = new DataHandler();
    const periphereia = dh.periphereies.findOne( p => p.id === periph_id );
    const nomos = dh.nomoi.findOne( n => n.id === nomos_id );
    const dhmoi = dh.dhmoi.findMany( d => d.nomos_name === nomos.name );

    // select topojson data

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
