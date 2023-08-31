import Link from "next/link";
import * as topojsonClient from 'topojson-client/dist/topojson-client';
import { LinksMenu, LinkPeriph } from "@/components/Links";
import Tile from "@/components/Tile";
import DataHandler from "@/helpers/DataHandler";

function PeriphList( { periphereies, topojson } ) {

    const geojson = topojsonClient.feature( topojson, topojson.objects.periphereies );

    let key = 0;

    return (
        <>
        <LinksMenu>
            <LinkPeriph focused={true} domain="lists" />
        </LinksMenu>

        <ul className="flex-container">
        {
            periphereies.map( periphereia => {

                const { id, name, title, info } = periphereia;
                const shouldFocus = d => d.properties.PER === name;
                key++;

                return (
                    <div key={key} className="flex-item">
                        <Link href={`/lists/periphereies/${id}/nomoi`}>
                            <Tile
                                id={id}
                                name={title || name}
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

export default PeriphList;


export async function getStaticProps() {

    // select csv data

    const dh = new DataHandler();
    const periphereies = dh.periphereies.findAll();

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