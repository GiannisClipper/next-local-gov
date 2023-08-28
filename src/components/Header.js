import Link from "next/link";

function Menu() {

    return (
        <div className="header">

            <Link href="/">
                <div className="home">nextLocalGovProject</div>
            </Link>

            <Link href="/lists/periphereies">
                <div className="lists">λίστες</div>
            </Link>

            <Link href="/maps/periphereies">
                <div className="maps">χάρτες</div>
            </Link>

        </div>
    );
}

export default Menu;
