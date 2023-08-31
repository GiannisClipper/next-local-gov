function removePunctuation( text ) {

    const punctuated = { Ά: 'Α', Έ: 'Ε', Ή: 'Η', Ί: 'Ι', Ϊ: 'Ι', Ό: 'Ο' ,Ύ: 'Υ', Ϋ: 'Υ', Ώ: 'Ω' };

    for ( let i = 0; i < text.length; i++ ) {
        if ( punctuated[ text[ i ] ] ) {
            text = text.substring( 0, i ) + punctuated[ text[ i ] ] + text.substring( i + 1, text.length );
        }
    }

    return text;
}

export { removePunctuation };