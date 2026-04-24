import { Request, Response, NextFunction } from "express";

export const supportedLanguages = ["en", "ar", "fr", "ur", "ms"];

export const i18nMiddleware = (req: any, _res: Response, next: NextFunction) => {
  const lang = req.query.lang as string;
  if (lang && supportedLanguages.includes(lang)) {
    req.locale = lang;
  } else {
    req.locale = "ar"; // Default to Arabic as requested
  }
  next();
};
