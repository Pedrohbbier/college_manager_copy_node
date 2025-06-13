import { NextFunction, Request, Response } from "express";
import multer, { FileFilterCallback, diskStorage } from "multer";
import { basename, extname, join } from "path";
import { v4 as UUIDV4 } from 'uuid';

const storage = diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb) {
    cb(null, join(__dirname, '../../', './volumes/uploads'));
  },
  filename: function (req: Request, file: Express.Multer.File, cb) {
    cb(null, file.fieldname + '-' + UUIDV4() + '-' + basename(file.originalname)?.replaceAll(' ', '_'));
  }
});

const fileFilter = (allowedTypes?: RegExp) => (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (!allowedTypes) {
    cb(null, true);
  } else {
    const extensionValid = allowedTypes.test(extname(file.originalname).toLowerCase());

    if (extensionValid) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não permitido!'));
    }
  }
};

export const upload = (allowedTypes?: RegExp) => multer({
  storage: storage,
  fileFilter: fileFilter(allowedTypes),
  limits: { fileSize: 100000000 },
});