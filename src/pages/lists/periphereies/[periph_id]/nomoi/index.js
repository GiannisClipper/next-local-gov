import Link from "next/link";
import * as topojsonClient from 'topojson-client/dist/topojson-client';
import Menu from "@/components/Menu.js";
import NomoiTile from "@/components/NomoiTile";
import DataHandler from "@/helpers/DataHandler";

function Nomoi( { periphereia, nomoi, topojson } ) {

    const geojson = topojsonClient.feature( topojson, topojson.objects.nomoi_okxe );
    const periph_id = periphereia.id;

    let key = 0;

    return (
        <>
        <Menu />
        <ul className="flex-container">
        {
            nomoi.map( nomos => {

                const { id } = nomos;
                key++;

                return (
                    <div key={key} className="flex-item">
                        <Link href={`/lists/periphereies/${periph_id}/nomoi/${id}/dhmoi`}>
                            <NomoiTile 
                                periphereia={periphereia}
                                nomos={nomos}
                                geojson={geojson}
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

export default Nomoi;

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
    nomoi.forEach( n => n.dhmoi = dh.dhmoi.findMany( d => d.nomos_name === n.name ) );
    const topojson = dh.nomoi.readTopojson();

    const names = nomoi.map( n => n.name );
    const geometries = topojson.objects.nomoi_okxe.geometries.filter( g => names.includes( g.properties.NAME_GR ) );
    topojson.objects.nomoi_okxe.geometries = geometries;
    
    console.log( `Static rendering Periphereies/id/Nomoi` );

    return {
        props: {
            periphereia,
            nomoi,
            topojson
        }
    }
}
