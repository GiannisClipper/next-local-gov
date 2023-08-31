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

    let key = 0;

    return (
        <>
        <LinksMenu>
            <LinkPeriph domain="lists" />
            <LinkPeriphIdNomoi domain="lists" periph_id={periph_id} periph_name={periph_name} />
            <LinkPeriphIdNomoiIdDhmoi focused={true} domain="lists" periph_id={periph_id} periph_name={periph_name} nomos_id={nomos_id} nomos_name={nomos_name} />
        </LinksMenu>

        <ul className="flex-container">
        {
            dhmoi.map( dhmos => {

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

    // add info property

    dhmoi.forEach( d => {
        const { name, area, pop2021 } = d;
        if ( ! d.info ) {
            d.info = `Ο δήμος ${name} έχει έκταση ${area} τ.χμ. και πληθυσμό ${pop2021} κατοίκους (απογραφή 2021).`;
        } else {
            d.info = d.info + ` Έχει έκταση ${area} τ.χμ. και πληθυσμό ${pop2021} κατοίκους (απογραφή 2021).`;
        }
    } );

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
