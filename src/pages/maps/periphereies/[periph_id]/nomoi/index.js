import * as topojsonClient from 'topojson-client/dist/topojson-client';
import { useRouter } from "next/router";
import DataHandler from "@/helpers/DataHandler";
import { LinksMenu, LinkPeriph, LinkPeriphIdNomoi } from "@/components/Links";
import MapViewer, { 
    getMapSetup,
    getPathElements,
    getTextElements,
    getHoverPathAbility,
    getTooltipAbility,
    getClickPathAbility,
    getZoomAbility
} from "@/components/MapViewer";

function NomoiMap( { periphereia, nomoi, topojson } ) {

    const geojson = topojsonClient.feature( topojson, topojson.objects.nomoi_okxe );
    const periph_id = periphereia.id;
    const periph_name = periphereia.name;

    const mapSetup = getMapSetup( { width: 800, height: 600, geojson} );

    const router = useRouter();
    const clickHandler = d => {
        const nomoi_id = nomoi.find( n => d.properties.NAME_GR === n.name ).id;
        router.push( `/maps/periphereies/${periph_id}/nomoi/${nomoi_id}/dhmoi` );
    };
    const clickPathAbility = getClickPathAbility( { clickHandler } );

    const hoverPathAbility = getHoverPathAbility( {} );

    const getTooltipValue = d => nomoi.find( n => d.properties.NAME_GR === n.name ).info;
    const tooltipAbility = getTooltipAbility( { leftOffset: -202, topOffset: -50, getTooltipValue } );

    const pathElements = getPathElements( { abilities: [ hoverPathAbility, tooltipAbility, clickPathAbility ] } );

    const getTextValue = d => d.properties.NAME_GR;
    const textElements = getTextElements( { getTextValue } );

    const zoomAbility = getZoomAbility( { scaleExtent: [ 1, 10 ] } );
    
    return (
        <>
        <LinksMenu>
            <LinkPeriph domain="maps"/>
            <LinkPeriphIdNomoi focused={true} domain="maps" periph_id={periph_id} periph_name={periph_name}/>
        </LinksMenu>

        <MapViewer 
            className="full-map-viewer"
            mapSetup={ mapSetup }
            mapElements={ [ pathElements, textElements ] }
            zoomAbility={ zoomAbility }
        />
        <div className="zoom-reminder">[ διπλό κλικ για μεγένθυνση ] [ shift + διπλό κλικ για σμίκρυνση ]</div>
        </>
    );
}

export default NomoiMap;

export async function getStaticPaths() {

    const dh = new DataHandler();
    const periphereies = dh.periphereies.findAll();
    const paths = periphereies.map( p => ( { params: { periph_id: p.id } } ) );

    return {
        paths,
        fallback: false
    }
}

export async function getStaticProps( context ) {

    const { params } = context;
    const { periph_id } = params;

    // select csv data

    const dh = new DataHandler();
    const periphereia = dh.periphereies.findOne( p => p.id === periph_id );
    const nomoi = dh.nomoi.findMany( n => n.periph_name === periphereia.name );

    // select topojson data

    const topojson = dh.nomoi.readTopojson();
    const names = nomoi.map( n => n.name );
    const geometries = topojson.objects.nomoi_okxe.geometries.filter( g => names.includes( g.properties.NAME_GR ) );
    topojson.objects.nomoi_okxe.geometries = geometries;
    
    console.log( `Static rendering maps/periphereies/{id}/nomoi` );

    return {
        props: {
            periphereia,
            nomoi,
            topojson
        }
    }
}
