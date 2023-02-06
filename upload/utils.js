import axios from "axios";

export const downloadFromUrl = async (url, options) => {
    const res = await axios.get(url, {responseType: 'stream', ...options})

    if (res.status !== 200) {
        throw new Error(`Did not get a valid response from ${url}`)
    }

    return [res.data, res.headers['content-type']]
}

export const uploadFileToStorage = async (data, bucket, path, contentType) => {
    const writeStream = bucket.file(path).createWriteStream({metadata: {contentType}})
    await data.pipe(writeStream)
}
