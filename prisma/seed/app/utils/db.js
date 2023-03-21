"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const client_1 = require("@prisma/client");
let db;
exports.db = db;
if (process.env.NODE_ENV === 'production') {
    exports.db = db = new client_1.PrismaClient();
}
else {
    if (!global.__db__)
        global.__db__ = new client_1.PrismaClient();
    exports.db = db = global.__db__;
    db.$connect();
}
