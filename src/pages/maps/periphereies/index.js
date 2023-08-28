import Menu from "@/components/Menu";
import MapViewer from "@/components/MapViewer";
import * as topojsonClient from 'topojson-client/dist/topojson-client';
import { useRouter } from "next/router";
import DataHandler from "@/helpers/DataHandler";

function PeriphMap( { periphereies, topojson } ) {

    const geojson = topojsonClient.feature( topojson, topojson.objects.periphereies );
    const router = useRouter();
    const onClickHandler = d => {
        const periph_id = periphereies.find( p => d.properties.PER === p.name ).id;
        router.push( `/maps/periphereies/${periph_id}/nomoi` );
    };
    
    return (
        <>
        <Menu />
        <MapViewer 
            width={800} 
            height={600} 
            geojson={geojson}
            // pathStrokec={ ( d ) => d.properties.NAME_GR !== name ? "#333333" : "#333333" }
            // pathFill={ ( d ) => d.properties.NAME_GR !== name ? "white" : "steelblue" }
            textProp={ d => d.properties.PER }
            onClickHandler={ onClickHandler }
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