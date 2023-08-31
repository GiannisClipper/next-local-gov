function Home( { topojson } ) {
    
    return (
        <div className="welcome">
            <div>
                <div>
                    <div>
                        <span className="welcome-text-0"> Καλώς ήλθατε, </span><span>στην ενδεικτική αυτή παρουσίαση διαφορετικών</span>
                    </div>
                    <div className="welcome-text-2"> βαθμίδων τοπικής αυτοδιοίκησης στην Ελλάδα (περιφέρειες, νομοί, δήμοι).</div>
                </div>
            </div>
            <div>
                <span className="symbol">&#9657;</span> Η παρουσίαση είναι ενδεικτική, έχουν συνδυαστεί σύνολα δεδομένων που αναφέρονται σε διαφορετικές φάσεις μεταρρυθμιστικών αλλαγών, συνεπώς υπάρχουν αποκλίσεις από όσα ισχύουν σήμερα.
            </div>
            <div>
                <span className="symbol">&#9657;</span> Σκοπός της υλοποίησης ήταν η εκμάθηση και η πρακτική άσκηση σε τεχνολογίες ανάπτυξης web εφαρμογών και ιστοσελίδων, καθώς και στη χρήση γεωγραφικών δεδομένων και τη γραφική απεικόνισή τους.
            </div>
            <div>
                <span className="symbol">&#9657;</span> Για την ανάπτυξη του κώδικα χρησιμοποιήθηκε Next.js (React framework), τα γεωγραφικά δεδομένα προέρχονται από ανοικτά δεδομένα στο geodata.gov.gr, επίσης συμπληρώθηκαν πληροφορίες από το el.wikipedia.org.
            </div>
            <div>
                <span className="symbol">&#9657;</span> Ο σχεδιασμός και η υλοποίηση έγινε από τον giannisclipper, ο κώδικας είναι ανοικτός και διαθέσιμος στο github.com/giannisclipper/next-local-gov.
            </div>
        </div>
    );
}

export default Home;
