const SnowflakeId = require("snowflake-id").default;
const gen = new SnowflakeId();

const generateID = (prefix: string) => `${prefix}${gen.generate()}`;
export default generateID;
