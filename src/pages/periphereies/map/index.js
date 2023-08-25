import Menu from "@/components/Menu";
import MapViewer from "@/components/MapViewer";
import * as topojsonClient from 'topojson-client/dist/topojson-client';
import { useRouter } from "next/router";
import DataHandler from "@/helpers/DataHandler";

function Map( { topojson } ) {

    const geojson = topojsonClient.feature( topojson, topojson.objects.periphereies );
    const router = useRouter();
    const clickMap = () => router.push( "/periphereies" );
    
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
            clickMap={ clickMap }
        />
        </>
    );
}

export default Map;

export async function getStaticProps() {

    const dh = new DataHandler();
    const topojson = dh.periphereies.readTopojson();

    console.log( `Static rendering Periphereies/Map` );

    return {
        props: {
            topojson
        }
    }
}