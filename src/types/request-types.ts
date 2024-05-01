import { Request } from 'express';

export type RequestWithBody<B> = Request<{}, {}, B>

export type RequestWithQuery<Q> = Request<{}, {}, {}, Q>

export type RequestWithPrams<P> = Request<P>

export type RequestWithPramsAndBody<B, P> = Request<P, {}, B>
