// import Link from "next/link";
import * as topojsonClient from 'topojson-client/dist/topojson-client';
import { LinksMenu, LinkPeriph, LinkPeriphIdNomoi, LinkPeriphIdNomoiIdDhmoi } from "@/components/Links";
import Tile from "@/components/Tile";
import DataHandler from "@/helpers/DataHandler";

function DhmoiList( { periphereia, nomos, dhmoi, topojson } ) {

    const geojson = topojsonClient.feature( topojson, topojson.objects.dhmoi_okxe );
    const periph_id = periphereia.id;
    const periph_name = periphereia.name;
    const nomos_id = nomos.id;
    const nomos_name = nomos.name;
    const nomos_title = nomos.title;

    let key = 0;

    return (
        <>
        <LinksMenu>
            <LinkPeriph domain="lists" />
            <LinkPeriphIdNomoi domain="lists" periph_id={periph_id} periph_name={periph_name} />
            <LinkPeriphIdNomoiIdDhmoi focused={true} domain="lists" 
                periph_id={periph_id} periph_name={periph_name} 
                nomos_id={nomos_id} nomos_name={nomos_name} nomos_title={nomos_title}
            />
        </LinksMenu>

        <ul className="flex-container">
        {
            dhmoi.map( dhmos => {

                let zoomFeatures = null;
                if ( nomos.zoomDhmoi ) {
                    const ids = nomos.zoomDhmoi.reduce( ( result, dhmoi ) => result = dhmoi.includes( dhmos.id ) ? dhmoi : result, [] );
                    zoomFeatures = geojson.features.filter( f => ids.includes( f.properties.KWD_YPES ) );
                }

                const { id, name, info } = dhmos;
                const shouldFocus = d => d.properties.KWD_YPES === id;
                key++;

                return (
                    <div key={key} className="flex-item">
                        <Tile
                            id={id}
                            name={name}
                            info={info}
                            shouldFocus={shouldFocus}
                            geojson={geojson}
                            zoomFeatures={zoomFeatures}
                        />
                    </div>
                );
            } )
        }
        </ul>
        </>
    );
}

export default DhmoiList;

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

    // select csv data

    const dh = new DataHandler();
    const periphereia = dh.periphereies.findOne( p => p.id === periph_id );
    const nomos = dh.nomoi.findOne( n => n.id === nomos_id );
    const dhmoi = dh.dhmoi.findMany( d => d.nomos_name === nomos.name );

    // select topojson data

    const topojsons = [];

    const topojson = dh.dhmoi.readTopojson();
    const ids = dhmoi.map( d => d.id );
    const geometries = topojson.objects.dhmoi_okxe.geometries.filter( g => ids.includes( g.properties.KWD_YPES ) );
    topojson.objects.dhmoi_okxe.geometries = geometries;
    
    console.log( `Static rendering lists/periphereies/{id}/nomoi{id}/dhmoi` );

    return {
        props: {
            periphereia,
            nomos,
            dhmoi,
            topojson
        }
    }
}
