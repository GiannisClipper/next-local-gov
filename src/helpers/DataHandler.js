const fs = require( 'fs' );


// gegneric parent class

function Collection( csvFilename, csvParser, topojsonFilename ) {

    this._csvFilename = csvFilename;
    this._csvParser = csvParser;
    this._topojsonFilename = topojsonFilename;

    this._data = [];
}

Collection.prototype._read = function() {

    let text = fs.readFileSync( this._csvFilename, "utf8" );
    let rows = text.split( '\n' );
    let result = rows.map( r => this._csvParser( r.split( ',' ) ) );

    this._data = result;
    return this;
}

Collection.prototype.findOne = function( func ) {
    for ( let d of this._data ) {
        if ( func( d ) ) {
            return { ...d };
        }
    }
    return null;
}

Collection.prototype.findMany = function( func ) {
    return this._data.filter( d => func( d ) );
}

Collection.prototype.findAll = function() {
    return [ ...this._data ];
}

Collection.prototype.readTopojson = function() {
    const text = fs.readFileSync( this._topojsonFilename, "utf8" );
    const topojson = JSON.parse( text );
    return topojson;        
}


// specific child class

function Periphereies( csvFilename, topojsonFilename ) {

    const csvParser = row => {
        const [ id, name ] = row;
        return { id, name }; 
    }

    Collection.call( this, csvFilename, csvParser, topojsonFilename );
    this._read();
}

Periphereies.prototype = new Collection();

Periphereies.prototype.constructor = Periphereies;


// specific child class

function Nomoi( csvFilename, topojsonFilename ) {

    const csvParser = row => {
        const [ id, name, periph_name ] = row;
        return { id, name, periph_name }; 
    }

    Collection.call( this, csvFilename, csvParser, topojsonFilename );
    this._read();
}

Nomoi.prototype = new Collection();

Nomoi.prototype.constructor = Nomoi;


// specific child class

function Dhmoi( csvFilename, topojsonFilename ) {

    const csvParser = row => {
        let [ id, name, nomos_name, area, pop2021 ] = row;
        area = parseFloat( area );
        pop2021 = parseInt( pop2021 );
        return { id, name, nomos_name, area, pop2021 }; 
    }

    Collection.call( this, csvFilename, csvParser, topojsonFilename );
    this._read();
}

Dhmoi.prototype = new Collection();

Dhmoi.prototype.constructor = Dhmoi;


// specific class to export

function DataHandler() {

    this.periphereies = new Periphereies(
        "data/periphereies_final.csv",
        "data/periphereies_simplified.topojson"
    );

    this.nomoi = new Nomoi(
        "data/nomoi_okxe_final.csv",
        "data/nomoi_okxe_simplified.topojson"  
    );

    this.dhmoi = new Dhmoi(
        "data/dhmoi_okxe_final.csv",
        "data/dhmoi_okxe_simplified.topojson"  
    );

    const text = fs.readFileSync( "data/additions.json", "utf8" );
    const additions = JSON.parse( text );

    const propsInjection = ( data, additions ) => {
        return data.map( x => {
            const props = additions[ x.name ];
            return props ? { ...x, ...props } : x;
        } ); 
    }

    this.nomoi._data = propsInjection( this.nomoi._data, additions.nomoi );
    this.dhmoi._data = propsInjection( this.dhmoi._data, additions.dhmoi );
}

export default DataHandler;
