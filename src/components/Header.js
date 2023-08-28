import Link from "next/link";
import { useRouter } from "next/router";

function Header() {

    const router = useRouter();
    const { pathname } = router;

    const focus = {
        home: pathname === '/' ? "focus" : "",
        lists: pathname.startsWith( "/lists" ) ? "focus" : "",
        maps: pathname.startsWith( "/maps" ) ? "focus" : ""
    };

    return (
        <div className="header">

            <Link href="/">
                <div className={`home ${focus.home}`}>nextLocalGovProject</div>
            </Link>

            <Link href="/lists/periphereies">
                <div className={`lists ${focus.lists}`}>λίστες</div>
            </Link>

            <Link href="/maps/periphereies">
                <div className={`maps ${focus.maps}`}>χάρτες</div>
            </Link>

        </div>
    );
}

export default Header;
