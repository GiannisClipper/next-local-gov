import Link from "next/link";
import * as topojsonClient from 'topojson-client/dist/topojson-client';
import { LinksMenu, LinkPeriph, LinkPeriphIdNomoi } from "@/components/Links";
import Tile from "@/components/Tile";
import DataHandler from "@/helpers/DataHandler";

function NomoiList( { periphereia, nomoi, topojson } ) {

    const geojson = topojsonClient.feature( topojson, topojson.objects.nomoi_okxe );
    const periph_id = periphereia.id;
    const periph_name = periphereia.name;

    let key = 0;

    return (
        <>
        <LinksMenu>
            <LinkPeriph domain="lists"/>
            <LinkPeriphIdNomoi focused={true} domain="lists" periph_id={periph_id} periph_name={periph_name}/>
        </LinksMenu>

        <ul className="flex-container">
        {
            nomoi.map( nomos => {

                const { id, name, info } = nomos;
                const shouldFocus = d => d.properties.NAME_GR === name;

                key++;

                return (
                    <div key={key} className="flex-item">
                        <Link href={`/lists/periphereies/${periph_id}/nomoi/${id}/dhmoi`}>
                            <Tile
                                id={id}
                                name={name}
                                info={info}
                                shouldFocus={shouldFocus}
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

export default NomoiList;

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

    // select csv data

    const dh = new DataHandler();
    const periphereia = dh.periphereies.findOne( p => p.id === periph_id );
    const nomoi = dh.nomoi.findMany( n => n.periph_name === periphereia.name );

    // add info property

    nomoi.forEach( n => {

        const { name, area, areaRatio, pop2021, pop2021Ratio } = n;
        if ( ! n.info ) {
            const dhmoi = dh.dhmoi.findMany( d => d.nomos_name === n.name );
            const names = dhmoi.map( n => n.name );

            if ( names.length === 0 ) {
                n.info = "";
            } else if ( names.length === 1 ) {
                n.info = `Ο νομός ${name} περιλαμβάνει το δήμο ${names[ 0 ]}.`;
            } else {
                n.info = `Ο νομός ${name} περιλαμβάνει τους δήμους ${names.join( ', ' )}.`;
            }
        }
        n.info += ` Έχει έκταση ${area.toFixed( 1 )} τ.χμ. (${areaRatio.toFixed( 1 )}%) και πληθυσμό ${pop2021} (${pop2021Ratio.toFixed( 1 )}%) κατοίκους (απογραφή 2021).`;
    } );

    // select topojson data

    const topojson = dh.nomoi.readTopojson();

    const names = nomoi.map( n => n.name );
    const geometries = topojson.objects.nomoi_okxe.geometries.filter( g => names.includes( g.properties.NAME_GR ) );
    topojson.objects.nomoi_okxe.geometries = geometries;
    
    console.log( `Static rendering /lists/periphereies/{id}/nomoi` );

    return {
        props: {
            periphereia,
            nomoi,
            topojson
        }
    }
}
