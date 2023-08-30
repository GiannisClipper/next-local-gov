import * as topojsonClient from 'topojson-client/dist/topojson-client';
import { useRouter } from "next/router";
import DataHandler from "@/helpers/DataHandler";
import { LinksMenu, LinkPeriph } from "@/components/Links";
import FullMapViewer from "@/components/FullMapViewer";

function PeriphMap( { periphereies, topojson } ) {

    const geojson = topojsonClient.feature( topojson, topojson.objects.periphereies );
    const router = useRouter();
    const onClickPath = d => {
        const periph_id = periphereies.find( p => d.properties.PER === p.name ).id;
        router.push( `/maps/periphereies/${periph_id}/nomoi` );
    };
    
    return (
        <>
        <LinksMenu>
            <LinkPeriph focus={true} domain="maps"/>
        </LinksMenu>

        <FullMapViewer 
            width={800} 
            height={600} 
            geojson={geojson}
            onClickPath={ onClickPath }
            getTextValue={ d => d.properties.PER }
        />
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