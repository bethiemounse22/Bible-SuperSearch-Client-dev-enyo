module.exports = {
    routeRequest: function(value) {
        var field = false,
            nonPassageChars = this._containsNonPassageCharacters(value),
            passages = this.explodeReferences(value, true);

        console.log('routeRequest');
        console.log('passages', passages);

        // todo - migrate full logic here!

        // Treats as passage if 
        // * It's not empty AND 
        // * doesn't contain Strong's Numbers AND
        // * doesn't contain invalid characters for a reference (such as those used for boolean or REGEXP queries) AND 
        // * either
        //      1) It contains numbers but no (parentheses) or
        //      2) It resolves to multiple (possible) passages
        // Note: This passage-checking logic is specific to this method

        if(
            passages.length >= 1 &&
            !nonPassageChars && 
            !value.match(/[GHgh][0-9]+/) && 
            (value.match(/[0-9]/) && !value.match(/\(\)/) || passages.length >= 2) 
        ) {
            field = 'reference';
        }
        else {
            field = 'search';
        }

        return field;
    },

    isPassage: function(str) {
        return this.routeRequest(str) == 'reference' ? true : false;
    },

    _containsNonPassageCharacters: function(str) {
        // migrated from PHP API.
        nonPassageChars = str.match(/[`\\~!@#$%\^&*{}_[\]()]/);
        return nonPassageChars ? true : false;
    },

    explodeReferences: function(reference, separate_book) {
        separate_book = separate_book ? true : false;

        console.log('explodeReferences');

        if(this._containsNonPassageCharacters(reference)) {
            return [];
        }

        exploded = [];
        ref_end  = reference.length - 1;
        book_end = false;

        for(pos = ref_end; pos >= 0; pos --) {
            char = reference.charAt(pos);

            if(!book_end && !char.match(/[0-9\s.,;:\- ]/) ) {
                book_end = pos;
            }
            else if(book_end && (char == ',' || char == ';' || pos == 0)) {
                bpos = (pos == 0) ? 0 : pos + 1;

                if(separate_book) {
                    book    = this._trim(this._substr(reference, bpos, book_end - pos + 1), ' .,;');
                    chapter = this._trim(this._substr(reference, book_end + 1, ref_end - book_end), ' .,;');
                    
                    exploded.push({
                        book: book,
                        chapter_verse: chapter
                    });
                }
                else {
                    ref = this._trim(this._substr(reference, bpos, ref_end - bpos + 1), ' .,;');
                    exploded.push(ref);
                }

                ref_end  = pos;
                book_end = false;
            }
        }

        return exploded.reverse(); // To keep the references in the same order that they were submitted
    },
    _substr: function(str, offset, len) {
        return str.substring(offset, offset + len);
    },
    _trim: function(str, char) {
        return char ? this._trimChars(str, char) : str.trim();
    },
    _trimChars: function(str, chars) {
        var start = 0, 
            end = str.length;

        while(start < end && chars.indexOf(str[start]) >= 0) {
            ++ start;
        }

        while(end > start && chars.indexOf(str[end - 1]) >= 0) {
            -- end;
        }

        return (start > 0 || end < str.length) ? str.substring(start, end) : str;
    }
};