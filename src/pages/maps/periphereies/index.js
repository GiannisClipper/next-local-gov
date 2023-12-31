import * as topojsonClient from 'topojson-client/dist/topojson-client';
import { useRouter } from "next/router";
import { LinksMenu, LinkPeriph } from "@/components/Links";
import MapViewer, { 
    getMapSetup,
    getPathElements,
    getTextElements,
    getHoverPathAbility,
    getTooltipAbility,
    getClickPathAbility,
    getZoomAbility
} from "@/components/MapViewer";
import DataHandler from "@/helpers/DataHandler";

function PeriphMap( { periphereies, topojson } ) {

    const geojson = topojsonClient.feature( topojson, topojson.objects.periphereies );

    const mapSetup = getMapSetup( { width: 800, height: 600, geojson} );

    const router = useRouter();
    const clickHandler = d => {
        const periph_id = periphereies.find( p => d.properties.PER === p.name ).id;
        router.push( `/maps/periphereies/${periph_id}/nomoi` );
    };
    const clickPathAbility = getClickPathAbility( { clickHandler } );

    const hoverPathAbility = getHoverPathAbility( {} );

    const getTooltipValue = d => periphereies.find( p => d.properties.PER === p.name ).info;
    const tooltipAbility = getTooltipAbility( { leftOffset: -202, topOffset: -50, getTooltipValue } );

    const pathElements = getPathElements( { abilities: [ hoverPathAbility, tooltipAbility, clickPathAbility ] } );

    const getTextValue = d => d.properties.PER;
    const textElements = getTextElements( { getTextValue } );

    const zoomAbility = getZoomAbility( { scaleExtent: [ 1, 10 ] } );

    return (
        <>
        <LinksMenu>
            <LinkPeriph focused={true} domain="maps"/>
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

export default PeriphMap;

export async function getStaticProps() {

    // select csv data

    const dh = new DataHandler();
    const periphereies = dh.periphereies.findAll();

    // select topojson data

    const topojson = dh.periphereies.readTopojson();

    console.log( `Static rendering maps/periphereies` );

    return {
        props: {
            periphereies,
            topojson
        }
    }
}
