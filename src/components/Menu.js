import Link from "next/link";

function Menu() {

    return (
        <div className="menu">

            <Link href="/">
                <h2>Home</h2>
            </Link>

            <Link href="/periphereies">
                <h2>Κατάλογοι</h2>
            </Link>

            <Link href="/periphereies/map">
                <h2>Χάρτες</h2>
            </Link>

        </div>
    );
}

export default Menu;
