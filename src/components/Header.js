import Link from "next/link";
import { useRouter } from "next/router";

function Header() {

    const router = useRouter();
    const { pathname } = router;

    const focused = {
        home: pathname === '/' ? "focused" : "",
        lists: pathname.startsWith( "/lists" ) ? "focused" : "",
        maps: pathname.startsWith( "/maps" ) ? "focused" : ""
    };

    return (
        <div className="header">

            <Link href="/">
                <div className={`home ${focused.home}`}>nextLocalGovProject</div>
            </Link>

            <Link href="/lists/periphereies">
                <div className={`lists ${focused.lists}`}>λίστες</div>
            </Link>

            <Link href="/maps/periphereies">
                <div className={`maps ${focused.maps}`}>χάρτες</div>
            </Link>

        </div>
    );
}

export default Header;
