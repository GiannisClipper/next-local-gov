import Menu from "@/components/Menu.js";
import PeriphList from "@/components/PeriphList";
import * as topojsonClient from 'topojson-client/dist/topojson-client';
import DataHandler from "@/helpers/DataHandler";

function Periphereies( { periphereies, topojson } ) {

    const geojson = topojsonClient.feature( topojson, topojson.objects.periphereies );

    return (
        <>
        <Menu />
        <PeriphList
            periphereies={periphereies}
            geojson={geojson}
        />
        </>
    );
}

export default Periphereies;


export async function getStaticProps() {

    const dh = new DataHandler();
    const periphereies = dh.periphereies.findAll();
    const topojson = dh.periphereies.readTopojson();

    /*
    to create topojson from geojson: 
    import * as topojsonServer from 'topojson-server/dist/topojson-server';
    const topojson = topojsonServer.topology( [ geojson ] , 1e4 );
    https://stackoverflow.com/questions/69237683/uncaught-in-promise-referenceerror-topojson-is-not-defined/76133207#76133207
    */

    console.log( `Static rendering Periphereies` );

    return {
        props: {
            periphereies,
            topojson
        }
    }
}