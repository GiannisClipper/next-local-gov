import Link from "next/link";
import * as topojsonClient from 'topojson-client/dist/topojson-client';
import Menu from "@/components/Menu.js";
import Tile from "@/components/Tile";
import DataHandler from "@/helpers/DataHandler";

function PeriphList( { periphereies, topojson } ) {

    const geojson = topojsonClient.feature( topojson, topojson.objects.periphereies );

    let key = 0;

    return (
        <>
            <Menu />

            <ul className="flex-container">
            {
                periphereies.map( periphereia => {

                    const { id, name, info } = periphereia;
                    const attrStrokeHandler = d => d.properties.PER !== name ? "#333333" : "#333333";
                    const attrFillHandler = d => d.properties.PER !== name ? "white" : "steelblue";
                    key++;

                    return (
                        <div key={key} className="flex-item">
                            <Link href={`/lists/periphereies/${id}/nomoi`}>
                                <Tile
                                    id={id}
                                    name={name}
                                    info={info}
                                    geojson={geojson}
                                    attrStrokeHandler={attrStrokeHandler}
                                    attrFillHandler={attrFillHandler}
                                />
                            </Link>
                        </div>
                    );
                } )
            }
            </ul>
        </>
    );    
}

export default PeriphList;


export async function getStaticProps() {

    // select csv data

    const dh = new DataHandler();
    const periphereies = dh.periphereies.findAll();

    // add info property

    periphereies.forEach( p => {

        if ( ! p.info ) {
            const nomoi = dh.nomoi.findMany( n => n.periph_name === p.name );
            const names = nomoi.map( n => n.name );

            if ( names.length === 0 ) {
                p.info = "";
            } else if ( names.length === 1 ) {
                p.info = `Η περιφέρεια ${p.name} περιλαμβάνει το νομό ${names[ 0 ]}.`;
            } else {
                p.info = `Η περιφέρεια ${p.name} περιλαμβάνει τους νομούς ${names.join( ', ' )}.`;
            }
        }
    } );

    // select topojson data

    const topojson = dh.periphereies.readTopojson();

    /*
    to create topojson from geojson: 
    import * as topojsonServer from 'topojson-server/dist/topojson-server';
    const topojson = topojsonServer.topology( [ geojson ] , 1e4 );
    https://stackoverflow.com/questions/69237683/uncaught-in-promise-referenceerror-topojson-is-not-defined/76133207#76133207
    */

    console.log( `Static rendering /lists/periphereies` );

    return {
        props: {
            periphereies,
            topojson
        }
    }
}