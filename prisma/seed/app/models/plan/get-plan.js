"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPlans = exports.getPlanById = void 0;
const db_1 = require("../../utils/db");
async function getPlanById(id, include) {
    return db_1.db.plan.findUnique({
        where: { id },
        include: {
            ...include,
            prices: (include === null || include === void 0 ? void 0 : include.prices) || false,
        },
    });
}
exports.getPlanById = getPlanById;
async function getAllPlans(include) {
    return db_1.db.plan.findMany({
        include: {
            ...include,
            prices: (include === null || include === void 0 ? void 0 : include.prices) || false,
        },
    });
}
exports.getAllPlans = getAllPlans;
