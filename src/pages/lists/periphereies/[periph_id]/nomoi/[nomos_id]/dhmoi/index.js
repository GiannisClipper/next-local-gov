// import Link from "next/link";
import * as topojsonClient from 'topojson-client/dist/topojson-client';
import Menu from "@/components/Menu.js";
import DhmoiTile from "@/components/DhmoiTile";
import DataHandler from "@/helpers/DataHandler";

function Dhmoi( { periphereia, nomos, dhmoi, topojson } ) {

    const geojson = topojsonClient.feature( topojson, topojson.objects.dhmoi_okxe );
    // const periph_id = periphereia.id;
    // const nomos_id = nomos.id;

    let key = 0;

    return (
        <>
        <Menu />
        <ul className="flex-container">
        {
            dhmoi.map( dhmos => {

                // const { id } = dhmos;
                key++;

                return (
                    <div key={key} className="flex-item">
                        {/* <Link href={`/lists/periphereies/${periph_id}/nomoi/${nomos_id}/dhmoi/${id}`}> */}
                            <DhmoiTile 
                                periphereia={periphereia}
                                nomos={nomos}
                                dhmos={dhmos}
                                geojson={geojson}
                            />
                        {/* </Link> */}
                    </div>
                );
            } )
        }
        </ul>
        </>
    );
}

export default Dhmoi;

// export async function getStaticPaths( context ) {

//     const { params } = context;
//     const { periph_id } = params; // TypeError: Cannot destructure property 'periph_id' of 'params' as it is undefined.

//     const dh = new DataHandler();
//     const periphereia = dh.periphereies.findOne( p => p.id === periph_id );
//     const nomoi = dh.nomoi.findMany( n => n.periph_name === periphereia.name );
//     const paths = nomoi.map( n => ( { params: { nomos_id: n.id } } ) );
//     console.log( 'paths', paths )
//     return {
//         paths,
//         fallback: false
//     }
// }

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
    
    console.log( `Static rendering Periphereies/id/Nomoi/id/Dhmoi` );

    return {
        props: {
            periphereia,
            nomos,
            dhmoi,
            topojson
        }
    }
}
