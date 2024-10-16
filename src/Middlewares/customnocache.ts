
import express, { Request, Response, NextFunction } from 'express';

const nocache = (req: Request, res: Response, next: NextFunction): void => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.set('Surrogate-Control', 'no-store');
    next();
};

export default nocache;