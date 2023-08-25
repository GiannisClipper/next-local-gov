import Menu from "@/components/Menu";
import MapViewer from "@/components/MapViewer";
import * as topojsonClient from 'topojson-client/dist/topojson-client';
import DataHandler from "@/helpers/DataHandler";

function Perifereia( { topojson } ) {

    const geojson = topojsonClient.feature( topojson, topojson.objects.nomoi_okxe );

    return (
        <>
        <Menu />
        <MapViewer 
            width={800} 
            height={600} 
            geojson={geojson}
            // pathStrokec={ ( d ) => d.properties.NAME_GR !== name ? "#333333" : "#333333" }
            // pathFill={ ( d ) => d.properties.NAME_GR !== name ? "white" : "steelblue" }
            textProp={ d => d.properties.NAME_GR + ' ' + d.properties.ID }
        />
        </>
    );
}

export default Perifereia;

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

    const dh = new DataHandler();
    const periphereia = dh.periphereies.findOne( p => p.id === periph_id );
    const nomoi = dh.nomoi.findMany( n => n.periph_name === periphereia.name );
    const topojson = dh.nomoi.readTopojson();
    
    const names = nomoi.map( n => n.name );
    const geometries = topojson.objects.nomoi_okxe.geometries.filter( g => names.includes( g.properties.NAME_GR ) );
    //geometries.forEach( (g,i) => g.properties.ID = `ID-${i}` );
    topojson.objects.nomoi_okxe.geometries = geometries;
    
    console.log( `Static rendering Periphereies/id` );

    return {
        props: {
            topojson
        }
    }
}
