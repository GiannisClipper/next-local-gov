const fs = require( 'fs' );

// gegneric parent class

function Collection( csvFilename, topojsonFilename ) {
    this._csvFilename = csvFilename;
    this._topojsonFilename = topojsonFilename;
    this._data = [];
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
    Collection.call( this, csvFilename, topojsonFilename );
}

Periphereies.prototype = new Collection();

Periphereies.prototype.constructor = Periphereies;

Periphereies.prototype.read = function() {
    const text = fs.readFileSync( this._csvFilename, "utf8" );
    const rows = text.split( '\n' );
    const result = rows.map( r => {
        const [ id, name ] = r.split( ',' );
        return { id, name }; 
    } );

    this._data = result;
    return this;
}

// specific child class

function Nomoi( csvFilename, topojsonFilename ) {
    Collection.call( this, csvFilename, topojsonFilename );
}

Nomoi.prototype = new Collection();

Nomoi.prototype.constructor = Nomoi;

Nomoi.prototype.read = function() {
    const text = fs.readFileSync( this._csvFilename, "utf8" );
    const rows = text.split( '\n' );
    const result = rows.map( r => {
        const [ id, name, periph_name ] = r.split( ',' );
        return { id, name, periph_name }; 
    } )

    this._data = result;
    return this;
}

// specific child class

function Dhmoi( csvFilename, topojsonFilename ) {
    Collection.call( this, csvFilename, topojsonFilename );
}

Dhmoi.prototype = new Collection();

Dhmoi.prototype.constructor = Dhmoi;

Dhmoi.prototype.read = function() {
    const text = fs.readFileSync( this._csvFilename, "utf8" );
    const rows = text.split( '\n' );
    const result = rows.map( r => {
        let [ id, name, nom_name, area, pop2021 ] = r.split( ',' );
        area = parseFloat( area );
        pop2021 = parseInt( pop2021 );
        return { id, name, nom_name, area, pop2021 }; 
    } )

    this._data = result;
    return this;
}

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

    this.periphereies.read();
    this.nomoi.read();
    this.dhmoi.read();
}

export default DataHandler;
