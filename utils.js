export const toQueryString = object =>
    '?' +
    Object.keys(object)
        .map(key => `${key}=${object[key].toString()}`)
        .join('&');
export const replaceSmallImg=url=> {
    return url.replace('i.pximg.net', 'img.cheerfun.dev')
}
