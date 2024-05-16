import * as url from "url";

const config = {
PORT: 8080,
DIRNAME: url.fileURLToPath(new URL('.', import.meta.url)),
get UPLOAD_DIR() { return `${this.DIRNAME}/public/img` },
MONGODB_URI: "mongodb://127.0.0.1:27017/coder_53160"
};


export default config;

