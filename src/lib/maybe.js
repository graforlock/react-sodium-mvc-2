import * as R from 'ramda';

//--> Minimalistic implementation of a Maybe/Optional type.
export default class Maybe {
    constructor(x)
    {
        this.__value = x;
    }

    static of(x)
    {
        return new Maybe(x);
    }

    static fromNullable(x)
    {
        return !x ? None.of(x) : Just.of(R.identity(x));
    }

    isNone()
    {
        return this.constructor === None;
    };

    map(f)
    {
        return this.isNone() ? None.of(null) : Just.of(f(this.__value));
    };

    orElse(f)
    {
        return this.isNone() ? None.of(f(this.__value)) : Just.of(this.__value);
    }

    flatMap(f)
    {
        return new Maybe(f(this.__value)).join();
    }

    join()
    {
        return this.isNone() ? None.of(null) : this.__value;
    };

    ap(other)
    {
        return other.map(this.__value);
    };
}

//--> Just is value (non-null).
class Just extends Maybe {
    constructor(x)
    {
        super(x);
    }

    static of = function (v)
    {
        return new Just(v);
    };


}

//--> None is nothing, never maps.
class None extends Maybe {
    constructor(x)
    {
        super(x);
    }

    static of = function (v)
    {
        return new None(v);
    };
}

