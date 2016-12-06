//--> Either lightweight implementation.
class Either {
    constructor() {}

    static or(f, g, e)
    {
        switch(e.constructor)
        {
            case Left:
                return f(e.__value);
            case Right:
                return g(e.__value);
        }
    }

    orElse(g)
    {
        return Either.or(g, Right.of, this);
    }
}

//--> Left-hand side expected.
export class Left extends Either {
    constructor(x)
    {
        super();
        this.__value = x;
    }

    static of(x)
    {
        return new Left(x);
    }

    map(f)
    {
        return new Left(this.__value);
    }
}

//--> Right-hand side expected.
export class Right extends Either {
    constructor(x)
    {
        super();
        this.__value = x;
    }

    static of(x)
    {
        return new Right(x);
    }

    map(f)
    {
        return new Right(f(this.__value));
    }
}
