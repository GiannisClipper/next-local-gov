import Link from "next/link";

function LinkPeriph( { focused, domain } ) {
    const className = focused ? "focused" : "";
    return (
        <Link href={`/${domain}/periphereies`}>
            <span className={className}>ΠΕΡΙΦΕΡΕΙΕΣ</span>
        </Link>
    );
}

function LinkPeriphIdNomoi( { focused, domain, periph_id, periph_name } ) {
    const className = focused ? "focused" : "";
    return (
        <Link href={`/${domain}/periphereies/${periph_id}/nomoi`}>
            <span className={className}>ΝΟΜΟΙ ΠΕΡΙΦΕΡΕΙΑΣ {periph_name}</span>
        </Link>
    );
}

function LinkPeriphIdNomoiIdDhmoi( { focused, domain, periph_id, nomos_id, nomos_name } ) {
    const className = focused ? "focused" : "";
    return (
        <Link href={`/${domain}/periphereies/${periph_id}/nomoi/${nomos_id}/dhmoi`}>
            <span className={className}>ΔΗΜΟΙ ΝΟΜΟΥ {nomos_name}</span>
        </Link>
    );
}

function LinksMenu( { children } ) {
    return (
        <div className="links_menu">
            { children }
        </div>
    );
}

export { LinksMenu, LinkPeriph, LinkPeriphIdNomoi, LinkPeriphIdNomoiIdDhmoi };
