"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverConfig = exports.jwtConfig = exports.testDatabaseConnection = exports.getDatabasePool = exports.databaseConfig = exports.env = void 0;
var env_config_1 = require("./env.config");
Object.defineProperty(exports, "env", { enumerable: true, get: function () { return env_config_1.env; } });
var database_config_1 = require("./database.config");
Object.defineProperty(exports, "databaseConfig", { enumerable: true, get: function () { return database_config_1.databaseConfig; } });
Object.defineProperty(exports, "getDatabasePool", { enumerable: true, get: function () { return database_config_1.getDatabasePool; } });
Object.defineProperty(exports, "testDatabaseConnection", { enumerable: true, get: function () { return database_config_1.testDatabaseConnection; } });
var jwt_config_1 = require("./jwt.config");
Object.defineProperty(exports, "jwtConfig", { enumerable: true, get: function () { return jwt_config_1.jwtConfig; } });
var server_config_1 = require("./server.config");
Object.defineProperty(exports, "serverConfig", { enumerable: true, get: function () { return server_config_1.serverConfig; } });
//# sourceMappingURL=index.js.map